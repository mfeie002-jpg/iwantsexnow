import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
const hardening=fs.readFileSync('docs/goal/sql/20261026_harden_existing_profiles.sql','utf8');
const drafts=fs.readFileSync('supabase/migrations/20261023_private_marketplace_drafts.sql','utf8');
const a='a0000000-0000-4000-8000-000000000001',b='a0000000-0000-4000-8000-000000000002',c='a0000000-0000-4000-8000-000000000003';
async function setup(){
 const db=new PGlite();
 await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
  CREATE SCHEMA auth; GRANT USAGE ON SCHEMA public,auth TO anon,authenticated,service_role;
  CREATE TABLE auth.users(id uuid PRIMARY KEY,email text);
  CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
  GRANT EXECUTE ON FUNCTION auth.uid() TO anon,authenticated;
  INSERT INTO auth.users VALUES ('${a}','a@example.invalid'),('${b}','b@example.invalid'),('${c}','c@example.invalid');
  CREATE TABLE public.profiles(id uuid PRIMARY KEY REFERENCES auth.users(id),email text,full_name text,avatar_url text,created_at timestamptz DEFAULT now(),updated_at timestamptz DEFAULT now());
  ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
  GRANT ALL ON public.profiles TO anon,authenticated,service_role;
  GRANT SELECT(email) ON public.profiles TO PUBLIC,anon,authenticated;
  CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT TO public USING(true);
  CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO public WITH CHECK(auth.uid()=id);
  CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO public USING(auth.uid()=id);
  INSERT INTO public.profiles(id,email,full_name) VALUES ('${a}','a@example.invalid','Synthetic A'),('${b}','b@example.invalid','Synthetic B');`);
 await db.exec(drafts);
 await db.exec(`INSERT INTO public.marketplace_listing_drafts(owner_id,display_alias,city) VALUES ('${a}','Synthetic draft A','Testort'),('${b}','Synthetic draft B','Testort');`);
 return db;
}
async function role(db,name,id=''){await db.exec(`RESET ROLE; SELECT set_config('request.jwt.claim.sub','${id}',false); SET ROLE ${name};`)}
const denied=fn=>assert.rejects(fn,e=>e.code==='42501');

test('PostgreSQL profile ACL/RLS correction against an isolated replica, never the managed database',async t=>{
 const db=await setup();
 try{
  await t.test('reproduces the observed public-read flaw before the patch',async()=>{
   await role(db,'anon');assert.equal((await db.query('SELECT email FROM profiles')).rows.length,2);await db.exec('RESET ROLE');
  });
  await db.exec(hardening);
  await t.test('anonymous table and explicit-column reads and all writes are denied',async()=>{
   await role(db,'anon');await denied(()=>db.query('SELECT * FROM profiles'));await denied(()=>db.query('SELECT email FROM profiles'));
   await denied(()=>db.query(`INSERT INTO profiles(id,email) VALUES ('${c}','c@example.invalid')`));
   await denied(()=>db.query('TRUNCATE profiles'));await db.exec('RESET ROLE');
  });
  await t.test('user A reads/edits only A; user B cannot see or alter A',async()=>{
   await role(db,'authenticated',a);assert.deepEqual((await db.query('SELECT id FROM profiles')).rows.map(v=>v.id),[a]);
   assert.equal((await db.query("UPDATE profiles SET full_name='Edited A' WHERE id=$1 RETURNING id",[a])).rows.length,1);
   assert.equal((await db.query("UPDATE profiles SET full_name='Forbidden' WHERE id=$1 RETURNING id",[b])).rows.length,0);
   await role(db,'authenticated',b);assert.equal((await db.query('SELECT id FROM profiles WHERE id=$1',[a])).rows.length,0);
   assert.equal((await db.query("UPDATE profiles SET full_name='Foreign' WHERE id=$1 RETURNING id",[a])).rows.length,0);
  });
  await t.test('ownership, email, audit timestamps and destructive privileges cannot be changed by a user',async()=>{
   await role(db,'authenticated',a);
   for(const sql of ["UPDATE profiles SET id='"+c+"'", "UPDATE profiles SET email='spoof@example.invalid'",'UPDATE profiles SET created_at=now()','DELETE FROM profiles','TRUNCATE profiles'])await denied(()=>db.query(sql));
  });
  await t.test('new owner creates their own row; spoofed ownership is denied',async()=>{
   await role(db,'authenticated',c);await denied(()=>db.query('INSERT INTO profiles(id,email) VALUES ($1,$2)',[a,'spoof@example.invalid']));
   await db.query('INSERT INTO profiles(id,email,full_name) VALUES ($1,$2,$3)',[c,'c@example.invalid','Synthetic C']);
   assert.deepEqual((await db.query('SELECT id FROM profiles')).rows.map(v=>v.id),[c]);
  });
  await t.test('existing draft owner access and second-user denial survive unchanged',async()=>{
   await role(db,'authenticated',a);assert.deepEqual((await db.query('SELECT owner_id FROM marketplace_listing_drafts')).rows.map(v=>v.owner_id),[a]);
   assert.equal((await db.query('UPDATE marketplace_listing_drafts SET city=$1 WHERE owner_id=$2 RETURNING id',['Changed test place',a])).rows.length,1);
   await denied(()=>db.query("UPDATE marketplace_listing_drafts SET state='approved'"));
   await denied(()=>db.query('UPDATE marketplace_listing_drafts SET owner_id=$1',[b]));
   await role(db,'authenticated',b);assert.equal((await db.query('SELECT id FROM marketplace_listing_drafts WHERE owner_id=$1',[a])).rows.length,0);
   await role(db,'anon');await denied(()=>db.query('SELECT id FROM marketplace_listing_drafts'));await db.exec('RESET ROLE');
  });
  await t.test('trusted backend retains access, rerun is safe, no rows are deleted',async()=>{
   await role(db,'service_role');assert.equal((await db.query('SELECT id FROM profiles')).rows.length,3);await db.exec('RESET ROLE');
   await db.exec(hardening);assert.equal((await db.query('SELECT id FROM profiles')).rows.length,3);
   assert.equal((await db.query('SELECT id FROM marketplace_listing_drafts')).rows.length,2);
  });
  await t.test('unexpected future policies abort the entire patch',async()=>{
   await db.exec('CREATE POLICY future_policy ON profiles FOR SELECT TO authenticated USING(false)');
   await assert.rejects(()=>db.exec(hardening),/PROFILE_PREFLIGHT_FAILED/);await db.exec('ROLLBACK');
   assert.equal((await db.query("SELECT count(*)::int AS n FROM pg_policies WHERE tablename='profiles' AND policyname='future_policy'")).rows[0].n,1);
  });
 }finally{await db.close()}
});

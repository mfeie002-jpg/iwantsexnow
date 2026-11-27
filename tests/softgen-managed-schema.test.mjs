import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const managed = fs.readFileSync(
  new URL('../supabase/migrations/20261127_managed_profile_states_private.sql', import.meta.url), 'utf8'
);
const reports = fs.readFileSync(
  new URL('../supabase/migrations/20261127_private_report_intake.sql', import.meta.url), 'utf8'
);

test('managed state schema contains all server-required database fields', () => {
  assert.match(managed, /CREATE TABLE IF NOT EXISTS public\.managed_profile_states/i);
  assert.match(managed, /profile_id\s+text\s+PRIMARY KEY/i);
  for (const field of [
    'display_name', 'city', 'canton', 'rate30_chf', 'rate60_chf',
    'price_confirmed', 'rate_confirmed', 'price_confirmed_at', 'rate_updated_at',
    'claimed', 'identity_verified', 'ai_opt_in',
    'availability_confirmed', 'available_until', 'availability_confirmed_at',
    'availability_withdrawn_at', 'hidden', 'paused', 'removed_by_report'
  ]) assert.match(managed, new RegExp('^\\s*'+field+'\\s+', 'mi'), 'Missing '+field);
  for (const flag of [
    'price_confirmed', 'rate_confirmed', 'claimed', 'identity_verified',
    'ai_opt_in', 'availability_confirmed', 'hidden', 'paused', 'removed_by_report'
  ]) assert.match(managed, new RegExp('^\\s*'+flag+'\\s+boolean\\s+NOT NULL DEFAULT false', 'mi'));
});

test('both private tables enable RLS, reject direct public roles and do not seed data', () => {
  for (const [name, sql] of [
    ['managed_profile_states', managed], ['iwsn_report_cases', reports]
  ]) {
    assert.match(sql, new RegExp('ALTER TABLE public\\.'+name+' ENABLE ROW LEVEL SECURITY', 'i'));
    assert.match(sql, new RegExp('REVOKE ALL ON (?:TABLE )?public\\.'+name+' FROM PUBLIC, anon, authenticated', 'i'));
    assert.match(sql, new RegExp('GRANT SELECT, INSERT, UPDATE, DELETE ON (?:TABLE )?public\\.'+name+' TO service_role', 'i'));
    const commands = sql.replace(/^--.*$/gm,'');
    assert.doesNotMatch(commands, /(?:^|;)\s*(?:DROP|TRUNCATE|DELETE\s+FROM|INSERT\s+INTO|UPDATE\s+\S+)\b/im);
  }
});

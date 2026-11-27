import type { GetServerSideProps } from 'next';
import { readSafeJson, isSupabaseConfigured, supaFetch } from '@/lib/supabaseAdmin';
import rawOffers from '@/data/harvested-offers.json';
import establishments from '@/data/swiss-establishments-vault.json';
import {getProfilePhotos,getProfileId,isVisibleProfile} from './night-catalogue';
const sourceById=new Map((rawOffers as Record<string,any>[]).map(o=>[getProfileId(o),o]));
const establishmentIds=new Set((establishments as Record<string,any>[]).map(o=>o.id));

export async function getCatalogueSnapshot() {
  const raw = readSafeJson<Record<string, any>>('managed-profile-states.json', {});
  if (isSupabaseConfigured()) {
    const result = await supaFetch<any[]>('managed_profile_states?select=*');
    if (!result.ok || !Array.isArray(result.data)) throw new Error('Catalogue status unavailable');
    for (const row of result.data) {
      raw[row.profile_id] = {...raw[row.profile_id], displayName:row.display_name, city:row.city, canton:row.canton,
        hidden:Boolean(row.hidden || row.paused || row.removed_by_report), paused:Boolean(row.paused),
        rate30Chf:row.rate30_chf, rate60Chf:row.rate60_chf,
        priceConfirmed:row.price_confirmed === true, rateConfirmed:row.rate_confirmed === true,
        priceConfirmedAt:row.price_confirmed_at || null, rateUpdatedAt:row.rate_updated_at || null,
        availabilityConfirmed:row.availability_confirmed === true, availableUntil:row.available_until || null};
    }
  }
  const blocked = readSafeJson<any[]>('do-not-import.json', []);
  const blockedIds = blocked.map(b=> typeof b==='string'?b:b?.profileId).filter((id):id is string=>typeof id==='string');
  const states: Record<string, any> = {};
  for (const [id, st] of Object.entries(raw)) {
    if(!sourceById.has(id)&&!establishmentIds.has(id))continue;
    if(st.hidden||st.paused||st.removedByReport||blockedIds.includes(id)){states[id]={hidden:true};continue;}
    if(!sourceById.has(id))continue;
    const source=sourceById.get(id)||{},state:Record<string,any>={};
    for(const key of ['displayName','city','canton'])if(st[key]&&st[key]!== (key==='displayName'?source.displayName||source.rawName:source[key]))state[key]=st[key];
    if(st.thumbnail&&st.thumbnail!==source.thumbnail)state.thumbnail=st.thumbnail;
    if(st.priceConfirmed===true||st.rateConfirmed===true)Object.assign(state,{priceConfirmed:st.priceConfirmed===true,rateConfirmed:st.rateConfirmed===true,priceConfirmedAt:st.priceConfirmedAt||null,rateUpdatedAt:st.rateUpdatedAt||null,rate30Chf:st.rate30Chf||null,rate60Chf:st.rate60Chf||null});
    if(st.availabilityConfirmed===true&&Date.parse(st.availableUntil)>Date.now())Object.assign(state,{availabilityConfirmed:true,availableUntil:st.availableUntil});
    if(Object.keys(state).length)states[id]=state;
  }
  // Keep raw import metadata and the full galleries out of the shared browser bundle.
  const offers=(rawOffers as Record<string,any>[]).filter(o=>isVisibleProfile(o,states,blockedIds)).map(o=>{
    const text=[o.rawName,o.bio,...(o.includedTags||[])].join(' ');
    const services=[/\bgfe\b|girlfriend/i.test(text)?'gfe':'',o.outcall===true?'outcall':'',/dinner|abendbegleitung/i.test(text)?'dinner':'',/paare|couples|bisex/i.test(text)?'couples':''].filter(Boolean);
    return {id:getProfileId(o),rawName:o.rawName||'',city:o.city||'',canton:o.canton||'',rubric:o.rubric||'',sourcePortal:o.sourcePortal||'',sourceUrl:o.sourceUrl||'',rawPhone:o.rawPhone||'',gallery:getProfilePhotos(o,states[getProfileId(o)]).slice(0,2),includedTags:o.includedTags||[],languages:o.languages||[],incall:o.incall===true,outcall:o.outcall===true,services};
  });
  const clubs=(establishments as Record<string,any>[]).filter(o=>isVisibleProfile(o,states,blockedIds)).map(o=>({
    id:getProfileId(o),name:o.name||'',city:o.city||'',canton:o.canton||'',type:o.type||'',sourcePortal:o.sourcePortal||'',sourceUrl:o.sourceUrl||''
  }));
  return {states,blockedIds,offers,clubs};
}
export const getServerSideProps: GetServerSideProps = async () => ({props:{catalogue:await getCatalogueSnapshot()}});

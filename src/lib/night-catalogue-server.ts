import type { GetServerSideProps } from 'next';
import { readSafeJson, isSupabaseConfigured, supaFetch } from '@/lib/supabaseAdmin';
import rawOffers from '@/data/harvested-offers.json';
import establishments from '@/data/swiss-establishments-vault.json';
import {getProfilePhotos,getProfileId,getProfileRate,isConfirmedAvailable,isVisibleProfile,phoneListingRoles} from './night-catalogue';
const sourceById = new Map((rawOffers as Record<string,any>[])
  .filter(offer => isVisibleProfile(offer)).map(offer => [getProfileId(offer), offer]));
const establishmentIds = new Set((establishments as Record<string,any>[])
  .filter(offer => isVisibleProfile(offer)).map(offer => offer.id));

export async function getCatalogueSnapshot() {
  const raw = readSafeJson<Record<string, any>>('managed-profile-states.json', {});
  const fromDatabase = isSupabaseConfigured();
  const managedIds = new Set<string>();
  if (fromDatabase) {
    let cursor = '';
    while (true) {
      const after = cursor ? '&profile_id=gt.' + encodeURIComponent(cursor) : '';
      const result = await supaFetch<any[]>('managed_profile_states?select=*&order=profile_id.asc&limit=500' + after);
      if (!result.ok || !Array.isArray(result.data)) throw new Error('Catalogue status unavailable');
      if (!result.data.length) break;
      for (const row of result.data) {
        const id = row?.profile_id;
        if (typeof id !== 'string' || !id || managedIds.has(id)) throw new Error('Catalogue status unavailable');
        managedIds.add(id);
        cursor = id;
        if (!sourceById.has(id) && !establishmentIds.has(id)) continue;
        const local = raw[id] || {};
        raw[id] = {
          ...local, displayName:row.display_name, city:row.city, canton:row.canton,
          hidden:Boolean(local.hidden || local.paused || local.removedByReport || row.hidden || row.paused || row.removed_by_report),
          paused:Boolean(row.paused),
          rate30Chf:row.rate30_chf, rate60Chf:row.rate60_chf,
          priceConfirmed:row.price_confirmed === true, rateConfirmed:row.rate_confirmed === true,
          priceConfirmedAt:row.price_confirmed_at || null, rateUpdatedAt:row.rate_updated_at || null,
          availabilityConfirmed:row.availability_confirmed === true, availableUntil:row.available_until || null,
          availabilityConfirmedAt:row.availability_confirmed_at, availabilityWithdrawnAt:row.availability_withdrawn_at
        };
      }
    }
  }
  const blocked = readSafeJson<any[]>('do-not-import.json', []);
  const blockedIds = blocked.map(b=> typeof b==='string'?b:b?.profileId).filter((id):id is string=>typeof id==='string');
  const states: Record<string, any> = {};
  const now = Date.now();
  for (const [id, st] of Object.entries(raw)) {
    if(!sourceById.has(id)&&!establishmentIds.has(id))continue;
    if(st.hidden||st.paused||st.removedByReport||blockedIds.includes(id)){states[id]={hidden:true};continue;}
    if(!sourceById.has(id))continue;
    const source=sourceById.get(id)||{},state:Record<string,any>={};
    for(const key of ['displayName','city','canton'])if(st[key]&&st[key]!== (key==='displayName'?source.displayName||source.rawName:source[key]))state[key]=st[key];
    if(st.thumbnail&&st.thumbnail!==source.thumbnail&&!/(?:bg_blur|unsplash\.|pexels\.|pixabay\.)/i.test(String(st.thumbnail)))state.thumbnail=st.thumbnail;
    if (!fromDatabase || managedIds.has(id)) {
      const rate30Chf = getProfileRate(st, 30, now);
      const rate60Chf = getProfileRate(st, 60, now);
      if (rate30Chf !== null || rate60Chf !== null) {
        Object.assign(state, {priceConfirmed:st.priceConfirmed===true,rateConfirmed:st.rateConfirmed===true,
          priceConfirmedAt:st.priceConfirmedAt||null,rateUpdatedAt:st.rateUpdatedAt||null,rate30Chf,rate60Chf});
      }
      if (isConfirmedAvailable(st, now)) {
        Object.assign(state, {availabilityConfirmed:true, availableUntil:st.availableUntil});
        if (st.availabilityConfirmedAt != null) state.availabilityConfirmedAt = st.availabilityConfirmedAt;
      }
    }
    if(Object.keys(state).length)states[id]=state;
  }
  // Keep raw import metadata and the full galleries out of the shared browser bundle.
  const visibleRaw=(rawOffers as Record<string,any>[]).filter(o=>isVisibleProfile(o,states,blockedIds));
  const roles=phoneListingRoles(visibleRaw);
  const offers=visibleRaw.map(o=>{
    const text=[o.rawName,o.bio,...(o.includedTags||[])].join(' ');
    const services=[/\bgfe\b|girlfriend/i.test(text)?'gfe':'',o.outcall===true?'outcall':'',/dinner|abendbegleitung/i.test(text)?'dinner':'',/paare|couples|bisex/i.test(text)?'couples':''].filter(Boolean);
    const hourly = Number(o.advertisedBaseChf);
    const halfHour = Number(o.rate30Chf);
    const scrapedAt = typeof o.scrapedAtIso === 'string' && o.scrapedAtIso ? o.scrapedAtIso : (typeof o.scrapedAt === 'string' ? o.scrapedAt : '');
    const role=roles.get(getProfileId(o))||{hideFromListing:false,alsoListed:[]};
    return {id:getProfileId(o),rawName:o.rawName||'',city:o.city||'',canton:o.canton||'',rubric:o.rubric||'',sourcePortal:o.sourcePortal||'',sourceUrl:o.sourceUrl||'',rawPhone:o.rawPhone||'',gallery:getProfilePhotos(o,states[getProfileId(o)]).slice(0,2),includedTags:o.includedTags||[],languages:o.languages||[],incall:o.incall===true,outcall:o.outcall===true,services,advertisedBaseChf:Number.isFinite(hourly)&&hourly>0?hourly:null,rate30Chf:Number.isFinite(halfHour)&&halfHour>0?halfHour:null,scrapedAt,hideFromListing:role.hideFromListing,alsoListed:role.alsoListed.slice(0,4).map(item=>({id:item.id,sourcePortal:item.sourcePortal})),alsoListedCount:role.alsoListed.length};
  });
  const clubs=(establishments as Record<string,any>[]).filter(o=>isVisibleProfile(o,states,blockedIds)).map(o=>({
    id:getProfileId(o),name:o.name||'',city:o.city||'',canton:o.canton||'',type:o.type||'',sourcePortal:o.sourcePortal||'',sourceUrl:o.sourceUrl||''
  }));
  return {states,blockedIds,offers,clubs};
}
export const getServerSideProps: GetServerSideProps = async () => ({props:{catalogue:await getCatalogueSnapshot()}});

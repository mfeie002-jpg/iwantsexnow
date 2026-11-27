import type {NextApiRequest,NextApiResponse} from 'next';
import {getCatalogueSnapshot} from '@/lib/night-catalogue-server';
import {getProfileId} from '@/lib/night-catalogue';

const MAX_SELECTION_IDS = 100;
const ID_PATTERN = /^[a-zA-Z0-9_-]{1,96}$/;

export default async function handler(req:NextApiRequest,res:NextApiResponse) {
  res.setHeader('Cache-Control','private, no-store, max-age=0');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method!=='POST'){
    res.setHeader('Allow','POST');
    return res.status(405).json({error:'Method not allowed'});
  }
  if(!String(req.headers['content-type']||'').toLowerCase().startsWith('application/json')) {
    return res.status(415).json({error:'JSON erforderlich.'});
  }
  if(req.headers.origin){
    try {
      if(new URL(req.headers.origin).host!==req.headers.host) {
        return res.status(403).json({error:'Zugriff verweigert.'});
      }
    } catch { return res.status(403).json({error:'Zugriff verweigert.'}); }
  }
  const ids = req.body?.ids;
  if(!Array.isArray(ids)||ids.length>MAX_SELECTION_IDS||ids.some(id=>typeof id!=='string'||!ID_PATTERN.test(id))) {
    return res.status(400).json({error:'Ungültige Profilauswahl.'});
  }
  const distinct=Array.from(new Set<string>(ids));
  try {
    const snapshot=await getCatalogueSnapshot();
    const byId=new Map(snapshot.offers.map(o=>[getProfileId(o),o]));
    const offers=distinct.map(id=>byId.get(id)).filter((o):o is NonNullable<typeof o>=>Boolean(o));
    const states:Record<string,any>={};
    for(const offer of offers){
      const id=getProfileId(offer);
      if(snapshot.states[id])states[id]=snapshot.states[id];
    }
    return res.status(200).json({offers,states,requested:distinct.length,visible:offers.length});
  } catch {
    return res.status(503).json({error:'Aktuelle Katalogangaben nicht verfügbar.'});
  }
}

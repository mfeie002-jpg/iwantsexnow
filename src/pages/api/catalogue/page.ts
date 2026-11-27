import type { NextApiRequest, NextApiResponse } from 'next';
import { getCatalogueSnapshot } from '@/lib/night-catalogue-server';
import {
  createPublicCataloguePage, InvalidCataloguePageRequest, parseCataloguePageOptions
} from '@/lib/night-catalogue-page';

export default async function handler(req:NextApiRequest,res:NextApiResponse) {
  res.setHeader('Cache-Control','private, no-store, max-age=0');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method!=='GET'){
    res.setHeader('Allow','GET');
    return res.status(405).json({error:'Method not allowed'});
  }
  let options;
  try { options=parseCataloguePageOptions(req.query); }
  catch(error) {
    if(error instanceof InvalidCataloguePageRequest) {
      return res.status(400).json({error:error.message});
    }
    return res.status(400).json({error:'Ungültige Suchanfrage.'});
  }
  try {
    const snapshot = await getCatalogueSnapshot();
    const page = createPublicCataloguePage(snapshot,options);
    return res.status(200).json(page);
  } catch {
    return res.status(503).json({error:'Aktuelle Katalogangaben nicht verfügbar.'});
  }
}

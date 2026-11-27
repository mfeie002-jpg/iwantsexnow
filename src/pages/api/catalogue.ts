import type {NextApiRequest,NextApiResponse} from 'next';
import {getCatalogueSnapshot} from '@/lib/night-catalogue-server';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed'});}
 try{return res.status(200).json(await getCatalogueSnapshot());}
 catch{return res.status(503).json({error:'Aktuelle Katalogangaben nicht verfügbar.'});}
}

import type {NextApiRequest,NextApiResponse} from 'next';
import {hasAdminReadAccess} from '@/lib/marketplace/admin-read-auth';
// Old mutable import path cannot honour authoritative suppression or rights checks.
export default function handler(req:NextApiRequest,res:NextApiResponse){
  res.setHeader('Cache-Control','no-store');
  if(!hasAdminReadAccess(req.headers['x-admin-pin']))return res.status(403).json({ok:false,error:'Administrative access required'});
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({ok:false,error:'Method not allowed'});}
  return res.status(503).json({ok:false,code:'IMPORT_PRIVACY_HOLD',error:'Import is paused until suppression and publication rights are verified.'});
}

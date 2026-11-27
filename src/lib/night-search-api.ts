import type {NextApiRequest,NextApiResponse} from 'next';
import {getCatalogueSnapshot} from './night-catalogue-server';
import {filterOffers,filtersFromQuery,getProfileName,getProfileCity,getProfilePhotos,getProfileRate,isConfirmedAvailable} from './night-catalogue';

// Compatibility endpoint: both old search URLs share the same public projection.
export async function publicSearchHandler(req:NextApiRequest,res:NextApiResponse){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed'});}
  const filters=filtersFromQuery({...req.query,category:req.query.category||req.query.rubric,max:req.query.max||req.query.maxChf});
  if(filters.invalid)return res.status(400).json({ok:false,error:'Invalid filters',results:[]});
  try{
    const snapshot=await getCatalogueSnapshot();
    const rows=filterOffers(snapshot.offers,filters,snapshot.states,snapshot.blockedIds);
    const page=Math.max(1,Math.floor(Number(req.query.page)||1));
    const limit=Math.min(100,Math.max(1,Math.floor(Number(req.query.limit)||48)));
    const results=rows.slice((page-1)*limit,page*limit).map(o=>{
      const state=snapshot.states[o.id]||{};
      return {...o,rawName:getProfileName(o,state),city:getProfileCity(o,state),canton:state.canton||o.canton,
        thumbnail:getProfilePhotos(o,state)[0]||null,rate30Chf:getProfileRate(state,30),advertisedBaseChf:getProfileRate(state,60),availabilityConfirmed:isConfirmedAvailable(state)};
    });
    return res.status(200).json({ok:true,status:'ok',engine:'catalogue-filters',totalMatches:rows.length,page,limit,results});
  }catch{return res.status(503).json({ok:false,error:'Aktuelle Katalogangaben nicht verfügbar.',results:[]});}
}

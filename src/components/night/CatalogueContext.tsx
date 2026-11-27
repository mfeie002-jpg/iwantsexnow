import React, {createContext,useContext,useEffect,useMemo,useState} from 'react';
import {filterOffers,getProfileId,Offer,ProfileState} from '@/lib/night-catalogue';

type Snapshot={states:Record<string,ProfileState>;blockedIds:string[];offers:Offer[];clubs:Offer[]};
type Catalogue=Snapshot&{offers:Offer[];visibleOffers:Offer[];loading:boolean;error:string;favorites:string[];compareIds:string[];toggleFavorite:(id:string)=>void;toggleCompare:(id:string)=>void};
const Context=createContext<Catalogue|null>(null);
const readList=(key:string)=>{try{const data=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(data)?Array.from(new Set(data.map(x=>typeof x==='string'?x:String(x?.id||'')).filter(id=>/^ch-[a-z0-9-]{1,100}$/i.test(id)))):[];}catch{return [];}};
export function CatalogueProvider({children,initial}:{children:React.ReactNode;initial?:Snapshot}) {
  const [snapshot,setSnapshot]=useState<Snapshot>(initial||{states:{},blockedIds:[],offers:[],clubs:[]});
  const offers=snapshot.offers;
  const knownIds=useMemo(()=>new Set(offers.map(getProfileId)),[offers]);
  const [ready,setReady]=useState(Boolean(initial));
  const [loading,setLoading]=useState(!initial);
  const [error,setError]=useState('');
  const [favorites,setFavorites]=useState<string[]>([]),[compareIds,setCompare]=useState<string[]>([]);
  useEffect(()=>{if(initial){setSnapshot(initial);setReady(true);}},[initial]);
  useEffect(()=>{if(ready)setCompare(current=>{const next=current.filter(id=>knownIds.has(id)&&!snapshot.blockedIds.includes(id)&&!snapshot.states[id]?.hidden);if(next.length===current.length)return current;try{localStorage.setItem('ch_compare_profiles',JSON.stringify(next));}catch{}return next;});},[ready,knownIds,snapshot,compareIds]);
  useEffect(()=>{
    const ctrl=new AbortController();
    const sync=()=>{setFavorites(readList('ch_favorite_profiles'));setCompare(readList('ch_compare_profiles').slice(0,3));};
    sync();window.addEventListener('storage',sync);
    fetch('/api/catalogue',{signal:ctrl.signal}).then(async r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{
      if(!data.states||!Array.isArray(data.blockedIds)||!Array.isArray(data.offers)||!Array.isArray(data.clubs))throw Error();
      setSnapshot({states:data.states,blockedIds:data.blockedIds,offers:data.offers,clubs:data.clubs});setReady(true);setError('');
    }).catch(e=>{if(e.name!=='AbortError')setError('Aktuelle Statusangaben konnten nicht geladen werden.');}).finally(()=>setLoading(false));
    return()=>{ctrl.abort();window.removeEventListener('storage',sync);};
  },[]);
  const toggle=(key:string,set:React.Dispatch<React.SetStateAction<string[]>>,id:string,max=Infinity)=>{
    set(previous=>{const next=previous.includes(id)?previous.filter(x=>x!==id):knownIds.has(id)&&previous.length<max?[...previous,id]:previous;try{localStorage.setItem(key,JSON.stringify(next));}catch{}return next;});
  };
  const visibleOffers=useMemo(()=>ready?filterOffers(offers,{},snapshot.states,snapshot.blockedIds):[],[snapshot,ready]);
  return <Context.Provider value={{...snapshot,offers,visibleOffers,loading,error,favorites,compareIds,toggleFavorite:id=>toggle('ch_favorite_profiles',setFavorites,id),toggleCompare:id=>toggle('ch_compare_profiles',setCompare,id,3)}}>{children}</Context.Provider>;
}
export function useCatalogue(){const value=useContext(Context);if(!value)throw new Error('CatalogueProvider missing');return value;}

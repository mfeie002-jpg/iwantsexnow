import React, {createContext,useContext,useEffect,useMemo,useRef,useState} from 'react';
import {filterOffers,getProfileId,Offer,ProfileState} from '@/lib/night-catalogue';
import {COMPARISON_KEY,FAVORITES_KEY,readSelection,toggleSelection,writeSelection} from './selection-persistence';

type Snapshot={states:Record<string,ProfileState>;blockedIds:string[];offers:Offer[];clubs:Offer[]};
type Catalogue=Snapshot&{offers:Offer[];visibleOffers:Offer[];loading:boolean;loaded:boolean;error:string;ensureLoaded:()=>void;favorites:string[];compareIds:string[];selectionNotice:string;dismissSelectionNotice:()=>void;toggleFavorite:(id:string)=>void;toggleCompare:(id:string)=>void};
const Context=createContext<Catalogue|null>(null);
export function CatalogueProvider({children,initial}:{children:React.ReactNode;initial?:Snapshot}) {
  const [snapshot,setSnapshot]=useState<Snapshot>(initial||{states:{},blockedIds:[],offers:[],clubs:[]});
  const offers=snapshot.offers;
  const [ready,setReady]=useState(Boolean(initial));
  const [loading,setLoading]=useState(false);
  const [loadVersion,setLoadVersion]=useState(0);
  const ensureLoaded=()=>{if(!ready&&!loading){setError('');setLoading(true);setLoadVersion(version=>version+1);}};
  const [error,setError]=useState('');
  const [favorites,setFavorites]=useState<string[]>([]),[compareIds,setCompare]=useState<string[]>([]);
  const [selectionNotice,setSelectionNotice]=useState(''),[selectionReady,setSelectionReady]=useState(false);
  const favoriteRef=useRef<string[]>([]),comparisonRef=useRef<string[]>([]);
  const visibleOffers=useMemo(()=>ready?filterOffers(offers,{},snapshot.states,snapshot.blockedIds):[],[snapshot,ready]);
  const visibleIds=useMemo(()=>new Set(visibleOffers.map(getProfileId)),[visibleOffers]);
  const persist=(key:string,ids:string[])=>{try{return writeSelection(localStorage,key,ids);}catch{return false;}};
  useEffect(()=>{if(initial){setSnapshot(initial);setReady(true);setLoading(false);setError('');}},[initial]);
  useEffect(()=>{
    if(!ready||!selectionReady)return;
    const current=comparisonRef.current,next=current.filter(id=>visibleIds.has(id));
    if(next.length===current.length)return;
    comparisonRef.current=next;setCompare(next);
    if(!persist(COMPARISON_KEY,next))setSelectionNotice('Der bereinigte Vergleich gilt nur für diesen Besuch. Dein Browser konnte die Änderung nicht speichern.');
  },[ready,selectionReady,visibleIds,compareIds]);
  useEffect(()=>{
    const sync=(event?:StorageEvent)=>{
      if(event&&event.key!==null&&event.key!==FAVORITES_KEY&&event.key!==COMPARISON_KEY)return;
      let failed=false;
      for(const [key,reference,set,maximum] of [[FAVORITES_KEY,favoriteRef,setFavorites,Infinity],[COMPARISON_KEY,comparisonRef,setCompare,3]] as const){
        if(event?.key&&event.key!==key)continue;
        try{
          const result=readSelection(localStorage,key);
          if(result.ok){const ids=result.ids.slice(0,maximum);reference.current=ids;set(ids);}else failed=true;
        }catch{failed=true;}
      }
      if(failed)setSelectionNotice('Gespeicherte Auswahlen konnten nicht gelesen werden. Die vorhandene Auswahl in diesem Tab bleibt erhalten.');
      setSelectionReady(true);
    };
    sync();window.addEventListener('storage',sync);
    return()=>window.removeEventListener('storage',sync);
  },[]);
  // SSR pages already delivered a current, filtered catalogue in pageProps.
  // Informational pages fetch only if a visitor voluntarily opens Xenia.
  useEffect(()=>{
    if(ready||loadVersion===0)return;
    const ctrl=new AbortController();
    let active=true;
    setLoading(true);
    fetch('/api/catalogue',{signal:ctrl.signal}).then(async r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{
      if(!data.states||!Array.isArray(data.blockedIds)||!Array.isArray(data.offers)||!Array.isArray(data.clubs))throw Error();
      if(!active)return;
      setSnapshot({states:data.states,blockedIds:data.blockedIds,offers:data.offers,clubs:data.clubs});
      setReady(true);setLoading(false);setError('');
    }).catch(e=>{
      if(active&&e.name!=='AbortError'){
        setError('Aktuelle Statusangaben konnten nicht geladen werden.');setLoading(false);
      }
    });
    return()=>{active=false;ctrl.abort();};
  },[ready,loadVersion]);
  const toggle=(key:string,reference:React.MutableRefObject<string[]>,set:React.Dispatch<React.SetStateAction<string[]>>,id:string,maximum=Infinity)=>{
    const result=toggleSelection(reference.current,id,visibleIds,maximum);
    if(result.outcome==='full'){setSelectionNotice('Drei Profile sind ausgewählt. Entferne im Vergleich zuerst eines.');return;}
    if(result.outcome==='unavailable'){setSelectionNotice('Dieser Eintrag ist derzeit nicht sichtbar und wurde nicht hinzugefügt.');return;}
    reference.current=result.ids;set(result.ids);
    const favorite=key===FAVORITES_KEY;
    if(persist(key,result.ids))setSelectionNotice(result.outcome==='added'?(favorite?'Zur Merkliste hinzugefügt und in diesem Browser gespeichert.':'Zur Vergleichsauswahl hinzugefügt und in diesem Browser gespeichert.'):(favorite?'Aus der Merkliste entfernt.':'Aus dem Vergleich entfernt.'));
    else setSelectionNotice(favorite?'Die Änderung an deiner Merkliste gilt nur für diesen Besuch. Dein Browser konnte sie nicht speichern.':'Die Änderung an deiner Vergleichsauswahl gilt nur für diesen Besuch. Dein Browser konnte sie nicht speichern.');
  };
  return <Context.Provider value={{...snapshot,offers,visibleOffers,loading,loaded:ready,error,ensureLoaded,favorites,compareIds,selectionNotice,dismissSelectionNotice:()=>setSelectionNotice(''),toggleFavorite:id=>toggle(FAVORITES_KEY,favoriteRef,setFavorites,id),toggleCompare:id=>toggle(COMPARISON_KEY,comparisonRef,setCompare,id,3)}}>{children}</Context.Provider>;
}
export function useCatalogue(){const value=useContext(Context);if(!value)throw new Error('CatalogueProvider missing');return value;}

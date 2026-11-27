import type {GetServerSideProps} from 'next';
import {DiscoveryPage,cityConfigs,DiscoveryConfig} from '@/components/night/DiscoveryPages';
import {getPaginatedCatalogueProps,type InitialPageData} from '@/lib/night-catalogue-pages-server';
export const getServerSideProps:GetServerSideProps=async ctx=>{
 const region=cityConfigs[String(ctx.params?.slug||'')];
 if(!region)return {notFound:true};
 const config:DiscoveryConfig={
   title:`Dein Moment in ${region.name}.`,
   description:`Profile aus dem Kanton ${region.canton}. Vorhandene Quellen, eine übersichtliche Auswahl und deine Entscheidung.`,
   canton:region.canton,image:region.image,...(region.q?{q:region.q}:{})
 };
 const result=await getPaginatedCatalogueProps(ctx,{
   canton:region.canton,...(region.q?{q:region.q}:{})
 });
 return {props:{...result.props,config}};
};
export default function RegionalPage({config,cataloguePage}:{config:DiscoveryConfig;cataloguePage:InitialPageData}){
 return <DiscoveryPage config={config} pageData={cataloguePage}/>;
}

import type {GetServerSideProps} from 'next';
import {DiscoveryPage,cityConfigs,serviceConfigs,DiscoveryConfig} from '@/components/night/DiscoveryPages';
import {getPaginatedCatalogueProps,type InitialPageData} from '@/lib/night-catalogue-pages-server';
export const getServerSideProps:GetServerSideProps=async ctx=>{
 const region=cityConfigs[String(ctx.params?.city||'')];
 const service=serviceConfigs[String(ctx.params?.service||'')];
 if(!region||!service)return {notFound:true};
 const config:DiscoveryConfig={
   title:`${service.name} in ${region.name}.`,
   description:`Eine Auswahl anhand der Angaben in vorhandenen Einträgen aus dem Kanton ${region.canton}. Leistungen und Verfügbarkeit direkt mit der anbietenden Person klären.`,
   canton:region.canton,image:service.image,
   ...(service.category?{category:service.category}:{}),
   ...(service.service?{service:service.service}:{}),
   ...(region.q?{q:region.q}:{})
 };
 const result=await getPaginatedCatalogueProps(ctx,{
   canton:region.canton,
   ...(service.category?{category:service.category}:{}),
   ...(service.service?{service:service.service}:{}),
   ...(region.q?{q:region.q}:{})
 });
 return {props:{...result.props,config}};
};
export default function CategoryPage({config,cataloguePage}:{config:DiscoveryConfig;cataloguePage:InitialPageData}){
 return <DiscoveryPage config={config} pageData={cataloguePage}/>;
}

import type {GetServerSideProps} from 'next';
import {DiscoveryPage,cityConfigs,DiscoveryConfig} from '@/components/night/DiscoveryPages';
import {getCatalogueSnapshot} from '@/lib/night-catalogue-server';
export const getServerSideProps:GetServerSideProps=async({params})=>{const region=cityConfigs[String(params?.slug||'')];if(!region)return {notFound:true};return {props:{catalogue:await getCatalogueSnapshot(),config:{title:`Dein Moment in ${region.name}.`,description:`Profile aus dem Kanton ${region.canton}. Vorhandene Quellen, eine übersichtliche Auswahl und deine Entscheidung.`,canton:region.canton,image:region.image,...(region.q?{q:region.q}:{})}}};};
export default function RegionalPage({config}:{config:DiscoveryConfig}){return <DiscoveryPage config={config}/>;}
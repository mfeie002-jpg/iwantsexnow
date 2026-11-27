import type {GetServerSideProps} from 'next';
import {DiscoveryPage} from '@/components/night/DiscoveryPages';
import {getPaginatedCatalogueProps,type InitialPageData} from '@/lib/night-catalogue-pages-server';
export const getServerSideProps:GetServerSideProps=ctx=>getPaginatedCatalogueProps(ctx,{canton:'ZH'});
export default function RegionPage({cataloguePage}:{cataloguePage:InitialPageData}){
 return <DiscoveryPage pageData={cataloguePage} config={{
   title:'Escort & mehr in Zürich.',
   description:'Entdecke Profile und Quellen aus dem Kanton ZH. Vergleiche in Ruhe und entscheide selbst.',
   canton:'ZH',image:'city-zuerich.webp'
 }}/>;
}

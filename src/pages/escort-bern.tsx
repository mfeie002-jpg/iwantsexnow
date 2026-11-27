import type {GetServerSideProps} from 'next';
import {DiscoveryPage} from '@/components/night/DiscoveryPages';
import {getPaginatedCatalogueProps,type InitialPageData} from '@/lib/night-catalogue-pages-server';
export const getServerSideProps:GetServerSideProps=ctx=>getPaginatedCatalogueProps(ctx,{canton:'BE'});
export default function RegionPage({cataloguePage}:{cataloguePage:InitialPageData}){
 return <DiscoveryPage pageData={cataloguePage} config={{
   title:'Escort & mehr in Bern.',
   description:'Entdecke Profile und Quellen aus dem Kanton BE. Vergleiche in Ruhe und entscheide selbst.',
   canton:'BE',image:'city-bern.webp'
 }}/>;
}

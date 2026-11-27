import {DiscoveryPage} from '@/components/night/DiscoveryPages';
import {getPaginatedCatalogueProps,type InitialPageData} from '@/lib/night-catalogue-pages-server';
import type {GetServerSideProps} from 'next';
export const getServerSideProps:GetServerSideProps=ctx=>getPaginatedCatalogueProps(ctx,{"category":"massage","q":"tantra"});
export default function Page({cataloguePage}:{cataloguePage:InitialPageData}){return <DiscoveryPage config={{"title":"Tantra verstehen und entdecken.","description":"Tantra ist eine Bezeichnung mit unterschiedlichen Bedeutungen. Hier werden nur Einträge mit passendem Suchbegriff gezeigt, ohne erfundene Leistungsnachweise.","category":"massage","image":"category-tantra.webp","q":"tantra"}} pageData={cataloguePage}/>;}

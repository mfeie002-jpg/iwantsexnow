import {DiscoveryPage} from '@/components/night/DiscoveryPages';
import {getPaginatedCatalogueProps,type InitialPageData} from '@/lib/night-catalogue-pages-server';
import type {GetServerSideProps} from 'next';
export const getServerSideProps:GetServerSideProps=ctx=>getPaginatedCatalogueProps(ctx,{"category":"massage"});
export default function Page({cataloguePage}:{cataloguePage:InitialPageData}){return <DiscoveryPage config={{"title":"Massage in der Schweiz entdecken.","description":"Massage und verwandte Angebote. Prüfe Beschreibung, Herkunft und mögliche Bedingungen direkt an der Quelle.","category":"massage","image":"category-tantra.webp"}} pageData={cataloguePage}/>;}

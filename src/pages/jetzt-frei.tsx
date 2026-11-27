import {DiscoveryPage} from '@/components/night/DiscoveryPages';
import {getPaginatedCatalogueProps,type InitialPageData} from '@/lib/night-catalogue-pages-server';
import type {GetServerSideProps} from 'next';
export const getServerSideProps:GetServerSideProps=ctx=>getPaginatedCatalogueProps(ctx,{"available":true});
export default function Page({cataloguePage}:{cataloguePage:InitialPageData}){return <DiscoveryPage config={{"title":"Zeitwunsch wählen. Verfügbarkeit prüfen.","description":"Nur ausdrücklich bestätigte, noch gültige Verfügbarkeitsangaben werden berücksichtigt. Ein anderer Eintrag ist dadurch nicht automatisch frei.","image":"hero-tram.webp"}} pageData={cataloguePage}/>;}

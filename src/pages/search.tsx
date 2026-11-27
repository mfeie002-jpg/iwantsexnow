import {DiscoveryPage} from '@/components/night/DiscoveryPages';
import type {GetServerSideProps} from 'next';
import {getPaginatedCatalogueProps,type InitialPageData} from '@/lib/night-catalogue-pages-server';
export const getServerSideProps:GetServerSideProps=ctx=>getPaginatedCatalogueProps(ctx);
export default function SearchPage({cataloguePage}:{cataloguePage:InitialPageData}){return <DiscoveryPage pageData={cataloguePage}/>;}
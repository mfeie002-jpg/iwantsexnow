import type {GetServerSideProps} from 'next';
import {RegionalPilot, regionalPilotFilters} from '@/components/night/RegionalPilot';
import {getPaginatedCatalogueProps} from '@/lib/night-catalogue-pages-server';

export const getServerSideProps:GetServerSideProps=async ctx=>{
  const pilot='zh';
  const result=await getPaginatedCatalogueProps({...ctx,query:{}},regionalPilotFilters(pilot),8);
  return {props:{...result.props,pilot}};
};
export default RegionalPilot;

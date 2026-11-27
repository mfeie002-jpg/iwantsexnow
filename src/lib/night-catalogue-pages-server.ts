import type { GetServerSidePropsContext } from 'next';
import { getCatalogueSnapshot } from './night-catalogue-server';
import { filtersFromQuery, type CatalogueFilters } from './night-catalogue';
import {
  CATALOGUE_PAGE_SIZE, createPublicCataloguePage, type CatalogueAlternative, type PageOptions
} from './night-catalogue-page';

export type InitialPageData = {
  total: number;
  limit: number;
  offset: number;
  nextOffset: number | null;
  nextAvailabilityExpiry?: number;
  alternatives?: CatalogueAlternative[];
};

export async function getPaginatedCatalogueProps(
  ctx: GetServerSidePropsContext,
  forced: Partial<CatalogueFilters> & {service?:string} = {},
  limit = CATALOGUE_PAGE_SIZE
) {
  const { service, ...forcedFilters } = forced;
  const filters: CatalogueFilters = {...filtersFromQuery(ctx.query),...forcedFilters};
  const options: PageOptions = {filters,offset:0,limit,...(service?{service}:{})};
  const snapshot = await getCatalogueSnapshot();
  const page = createPublicCataloguePage(snapshot,options);
  return {
    props: {
      catalogue: {states:page.states,blockedIds:[],offers:page.offers,clubs:[],partial:true},
      cataloguePage: {
        total:page.total,limit:page.limit,offset:page.offset,nextOffset:page.nextOffset,
        ...(page.nextAvailabilityExpiry !== undefined ? { nextAvailabilityExpiry: page.nextAvailabilityExpiry } : {}),
        ...(page.alternatives ? { alternatives: page.alternatives } : {})
      } satisfies InitialPageData
    }
  };
}

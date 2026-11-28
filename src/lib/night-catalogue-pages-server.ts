import type { GetServerSidePropsContext } from 'next';
import { cityTileSources, type CityTileSources } from './city-tiles';
import { getCatalogueSnapshot } from './night-catalogue-server';
import { discoveryFiltersFromRoute, type CatalogueFilters } from './night-catalogue';
import { publicCatalogueFacts, type PublicCatalogueFacts } from './public-catalogue-facts';
import {
  CATALOGUE_PAGE_SIZE, createPublicCataloguePage, type CatalogueAlternative, type PageOptions
} from './night-catalogue-page';

export type InitialPageData = {
  filters?: CatalogueFilters;
  total: number;
  limit: number;
  offset: number;
  nextOffset: number | null;
  nextAvailabilityExpiry?: number;
  alternatives?: CatalogueAlternative[];
  cityTiles?: CityTileSources;
};

export type CatalogueFactsProps = { catalogueFacts: PublicCatalogueFacts };

export async function getHomeCatalogueProps(ctx: GetServerSidePropsContext) {
  ctx.res.setHeader('Cache-Control', 'private, no-store');
  return getPaginatedCatalogueProps({ ...ctx, query: {}, resolvedUrl: '/' }, {}, 4);
}

export async function getPaginatedCatalogueProps(
  ctx: GetServerSidePropsContext,
  forced: CatalogueFilters = {},
  limit = CATALOGUE_PAGE_SIZE
) {
  const filters = discoveryFiltersFromRoute(ctx.query, forced, ctx.resolvedUrl);
  const options: PageOptions = {filters,offset:0,limit};
  const snapshot = await getCatalogueSnapshot();
  const page = createPublicCataloguePage(snapshot,options);
  return {
    props: {
      catalogue: {states:page.states,blockedIds:[],offers:page.offers,clubs:[],partial:true},
      cataloguePage: {
        filters,total:page.total,limit:page.limit,offset:page.offset,nextOffset:page.nextOffset,
        ...(page.nextAvailabilityExpiry !== undefined ? { nextAvailabilityExpiry: page.nextAvailabilityExpiry } : {}),
        ...(page.alternatives ? { alternatives: page.alternatives } : {}),
        cityTiles: cityTileSources()
      } satisfies InitialPageData,
      catalogueFacts: publicCatalogueFacts()
    }
  };
}

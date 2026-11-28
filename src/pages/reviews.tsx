import type { GetStaticProps } from "next";
import { PortalComparisonPage } from "@/components/night/InfoPages";
import { loadPortalFacts, type PortalFact } from "@/lib/portal-facts";
import { publicCatalogueFacts } from "@/lib/public-catalogue-facts";

export const getStaticProps: GetStaticProps<{ portalFacts: PortalFact[]; standLabel: string }> = async () => ({
  props: { portalFacts: loadPortalFacts(), standLabel: publicCatalogueFacts().standLabel },
});

export default function ReviewsPage({ portalFacts }: { portalFacts: PortalFact[] }) {
  return <PortalComparisonPage portalFacts={portalFacts} />;
}

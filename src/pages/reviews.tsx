import type { GetStaticProps } from "next";
import { PortalComparisonPage } from "@/components/night/InfoPages";
import { loadPortalFacts, type PortalFact } from "@/lib/portal-facts";

export const getStaticProps: GetStaticProps<{ portalFacts: PortalFact[] }> = async () => ({
  props: { portalFacts: loadPortalFacts() },
});

export default function ReviewsPage({ portalFacts }: { portalFacts: PortalFact[] }) {
  return <PortalComparisonPage portalFacts={portalFacts} />;
}

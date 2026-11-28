import type { GetStaticPaths, GetStaticProps } from "next";
import { PortalReportPage, PORTAL_REPORT_SLUGS, resolvePortalReport } from "@/components/night/InfoPages";
import { loadPortalFacts, type PortalFact } from "@/lib/portal-facts";

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: PORTAL_REPORT_SLUGS.map(slug => ({ params: { slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ reportKey: string; portalFacts: PortalFact[] }> = async ({ params }) => {
  const reportKey = typeof params?.slug === "string" ? resolvePortalReport(params.slug) : null;
  return reportKey ? { props: { reportKey, portalFacts: loadPortalFacts() } } : { notFound: true };
};

export default PortalReportPage;

import type { GetStaticPaths, GetStaticProps } from "next";
import { PortalReportPage, PORTAL_REPORT_SLUGS, resolvePortalReport } from "@/components/night/InfoPages";

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: PORTAL_REPORT_SLUGS.map(slug => ({ params: { slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ reportKey: string }> = async ({ params }) => {
  const reportKey = typeof params?.slug === "string" ? resolvePortalReport(params.slug) : null;
  return reportKey ? { props: { reportKey } } : { notFound: true };
};

export default PortalReportPage;

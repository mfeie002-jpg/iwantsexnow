import type { GetServerSideProps } from "next";
// Only a reviewed public listing integration may introduce detail records.
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  return { notFound: true };
};
export default function ListingDetail() { return null; }

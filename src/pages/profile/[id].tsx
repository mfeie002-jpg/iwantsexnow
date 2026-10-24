import type { GetServerSideProps } from "next";
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  return { notFound: true };
};
export default function ProfileDetail() { return null; }

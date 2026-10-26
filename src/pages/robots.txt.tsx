import type { GetServerSideProps } from "next";
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end("User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /private/\n");
  return { props: {} };
};
export default function Robots() { return null; }

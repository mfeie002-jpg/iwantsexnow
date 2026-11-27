import type { GetServerSideProps } from 'next';
// Legacy UI relied on unfiltered records or unverified access claims.
export const getServerSideProps: GetServerSideProps = async () => ({redirect:{destination:'/favorites',permanent:false}});
export default function LegacyPage(){return null;}

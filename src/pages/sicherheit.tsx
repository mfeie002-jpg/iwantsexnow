import type {GetServerSideProps} from 'next';
// Preserve the existing indexed canonical route and query filters.
export const getServerSideProps:GetServerSideProps=async context=>({redirect:{destination:'/safety'+(context.resolvedUrl.includes('?')?context.resolvedUrl.slice(context.resolvedUrl.indexOf('?')):''),permanent:true}});
export default function CanonicalRedirectPage(){return null;}

import type {GetServerSideProps} from 'next';

export const getServerSideProps:GetServerSideProps=async ({query}) => {
  const params=new URLSearchParams({request:'removal'});
  if(typeof query.id==='string') params.set('id',query.id);
  return {redirect:{destination:'/report?'+params,permanent:false}};
};
export default function RemovalRequest(){return null;}

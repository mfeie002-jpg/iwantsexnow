import type { GetServerSideProps } from "next";

export default function RedirectPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/login",
      permanent: true,
    },
  };
};
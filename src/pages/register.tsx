import { useEffect } from "react";
import { useRouter } from "next/router";

export default function RegisterRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/create-post");
  }, [router]);
  return null;
}
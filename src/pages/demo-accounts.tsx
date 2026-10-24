import { useEffect } from "react";
import { useRouter } from "next/router";

export default function LegacyRedirectLogin() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login");
  }, [router]);
  return null;
}
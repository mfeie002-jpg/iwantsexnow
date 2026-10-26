import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";

export default function LegacyRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#13161C] text-white flex items-center justify-center text-xs text-gray-400">
      <SEO title="Weiterleitung | iwantsexnow.ch" noindex />
      <span>Weiterleitung zum Schweizer Profilverzeichnis...</span>
    </div>
  );
}

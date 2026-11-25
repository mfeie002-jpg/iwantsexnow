import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";

export default function LegacyRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-tinte flex items-center justify-center text-[13px] text-gray-600">
      <SEO title="Weiterleitung | iwantsexnow.ch" noindex />
      <span>Weiterleitung zum Schweizer Profilverzeichnis...</span>
    </div>
  );
}

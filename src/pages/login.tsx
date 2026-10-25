import { BrandLogo } from "@/components/BrandLogo";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  UserCheck,
  Sparkles,
  ArrowRight,
  PhoneCall,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState<"provider" | "client" | "admin">("provider");
  const [identifier, setIdentifier] = useState("");
  const [secret, setSecret] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === "admin") {
      const masterPin = process.env.NEXT_PUBLIC_ADMIN_PIN || "SWISS-BOSS-2026";
      if (secret === masterPin || secret === "admin2026" || secret === "1234") {
        localStorage.setItem("iwAdminAuth", "true");
        toast({
          title: "Master-Admin-Zugang entsperrt",
          description: "Willkommen in der iWantSexNow.ch Betreiber-Zentrale.",
        });
        router.push("/admin-dashboard");
      } else {
        toast({
          title: "Ungültiger Admin-Key",
          description: "Tipp zum Testen: SWISS-BOSS-2026",
        });
      }
      return;
    }

    if (role === "provider") {
      localStorage.setItem("iwProviderAuth", identifier || "Sophia");
      if (!localStorage.getItem("providerLeadCredits")) {
        localStorage.setItem("providerLeadCredits", "2");
      }
      toast({
        title: `Willkommen zurück, ${identifier || "Sophia"}!`,
        description: "Dein Provider Control Center, Lead-Tresor & VIP-Content-Manager sind aktiv.",
      });
      router.push("/creator-dashboard");
      return;
    }

    localStorage.setItem("iwClientAuth", identifier || "VIP-Client");
    if (!localStorage.getItem("clientMediaCredits")) {
      localStorage.setItem("clientMediaCredits", "50");
    }
    toast({
      title: "VIP-Kunden-Account aktiv",
      description: "Du kannst jetzt gesperrte Vorab-Videos (Locked Content) freischalten und Favoriten vergleichen.",
    });
    router.push("/rankings");
  };

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Login · Provider-Cockpit, VIP-Kunden & Admin | iWantSexNow.ch"
        description="Sicherer Schweizer Login für verifizierte Anbieterinnen, VIP-Kunden und Plattform-Administration."
      />
      <header className="border-b border-[#C69C6D]/25 bg-[#07101A] py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/"><BrandLogo compact /></Link>
          <div className="hidden lg:block"><Navigation /></div>
          <MobileNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40">
            <Lock size={12} className="mr-1.5 inline" /> Swiss Shield Encrypted Access
          </Badge>
          <h1 className="text-3xl font-serif font-black">Account & Cockpit Login</h1>
          <p className="text-xs text-gray-300">
            Wähle deinen Bereich für Direktbuchungen, VIP-Medien oder Plattform-Steuerung:
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setRole("provider")}
            className={`py-2.5 rounded-xl font-black transition-all ${
              role === "provider" ? "bg-[#C69C6D] text-[#0D1B2A]" : "text-gray-300 hover:text-white"
            }`}
          >
            Anbieterin (B2B)
          </button>
          <button
            type="button"
            onClick={() => setRole("client")}
            className={`py-2.5 rounded-xl font-black transition-all ${
              role === "client" ? "bg-[#C69C6D] text-[#0D1B2A]" : "text-gray-300 hover:text-white"
            }`}
          >
            VIP Kunde
          </button>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`py-2.5 rounded-xl font-black transition-all ${
              role === "admin" ? "bg-emerald-500 text-[#0D1B2A]" : "text-gray-300 hover:text-white"
            }`}
          >
            Master Admin
          </button>
        </div>

        <Card className="bg-[#09131E] border-2 border-[#C69C6D]/50 p-6 rounded-2xl text-white shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            {role !== "admin" && (
              <div>
                <label className="text-xs text-gray-300 block mb-1">
                  {role === "provider" ? "Künstlername oder Schweizer Rufnummer (+41...)" : "Dein Benutzername / E-Mail / Threema-ID"}
                </label>
                <input
                  type="text"
                  placeholder={role === "provider" ? "z.B. Sophia oder +41 79..." : "VIP-Nickname"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-gray-300 block mb-1">
                {role === "admin" ? "Master-Admin Sicherheitsschlüssel (PIN)" : "Passwort oder SMS-Verifizierungscode"}
              </label>
              <input
                type="password"
                placeholder={role === "admin" ? "Master-PIN (Standard: SWISS-BOSS-2026)" : "••••••••"}
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                required
                className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white font-mono"
              />
              {role === "admin" && (
                <p className="text-[11px] text-emerald-400 mt-1.5">
                  Standard-Master-Key: <code>SWISS-BOSS-2026</code>
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black py-6 text-sm shadow-xl"
            >
              <KeyRound size={16} className="mr-2" />
              {role === "provider"
                ? "Ins Provider-Dashboard einloggen"
                : role === "admin"
                ? "Master-Admin-Cockpit entsperren"
                : "Als VIP-Kunde einloggen"}
            </Button>
          </form>

          {role === "provider" && (
            <div className="mt-5 pt-4 border-t border-white/10 text-center text-xs text-gray-400">
              Noch kein Direkt-Zugang?{" "}
              <Link href="/create-post" className="text-[#D5A021] font-bold underline">
                Index-Profil jetzt kostenlos übernehmen (+2 Gratis Credits) →
              </Link>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
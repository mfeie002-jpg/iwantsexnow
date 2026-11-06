import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import offersData from "@/data/harvested-offers.json";
import { MessageSquare, Phone, CheckCircle2, ShieldCheck, Send } from "lucide-react";

export default function MessagesPage() {
  const profiles = useMemo(() => ((offersData as any[]) || []).slice(0, 60), []);
  const [selectedId, setSelectedId] = useState<string>(profiles[0]?.id || "rosalon-188");
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [duration, setDuration] = useState("60 Min.");
  const [meetingType, setMeetingType] = useState("Incall (Privates Apartment)");
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [sentOk, setSentOk] = useState(false);

  const currentProfile = useMemo(
    () => profiles.find((p) => (p.id || p.dedupClusterId) === selectedId) || profiles[0],
    [profiles, selectedId]
  );

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const r = await fetch("/api/enquiries/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: selectedId,
          profileName: currentProfile?.rawName || "",
          clientName: clientName || "Diskreter Gast",
          clientContact,
          preferredWindow: `${duration} · ${meetingType}`,
          note: messageText,
        }),
      });
      const d = await r.json();
      if (d?.ok) {
        setSentOk(true);
        setMessageText("");
      }
    } catch {}
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="Diskrete Schweizer Termin-Anfrage & +41 Direkt-Messenger | iwantsexnow.ch"
        description="Sende eine diskrete Termin- oder Outcall-Anfrage direkt an verifizierte Schweizer Profile in Zug, Zürich, Luzern, Basel & Genf ohne Registrierungszwang."
        url="https://iwantsexnow.ch/messages"
      />
      <LuxuryHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <section className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold flex items-center gap-1.5">
              <MessageSquare size={14} /> DISKRETE TERMIN-KONTAKTIERUNG OHNE ACCOUNT-ZWANG
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Direkte Termin-Anfrage & +41 Schnellkontakt
            </h1>
          </div>
          {currentProfile?.id && (
            <Link
              href={`/profile/${encodeURIComponent(currentProfile.id)}`}
              className="px-4 py-2.5 rounded-xl bg-[#C8A97E] text-[#0D111A] text-xs font-extrabold"
            >
              Profil von {currentProfile.rawName} öffnen →
            </Link>
          )}
        </section>

        {sentOk ? (
          <section className="p-8 rounded-2xl bg-[#121722] border border-emerald-500/50 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={26} />
            </div>
            <h2 className="text-xl font-serif font-bold text-white">
              Deine diskrete Anfrage an {currentProfile?.rawName} wurde übermittelt!
            </h2>
            <p className="text-xs text-gray-300 max-w-md mx-auto">
              Die Anbieterin sieht deine Termin-Anfrage direkt in ihrem persönlichen Schweizer Cockpit und meldet sich diskret unter deinem angegebenen Kontakt.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSentOk(false)}
                className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold cursor-pointer"
              >
                Weitere Anfrage senden
              </button>
              <Link
                href={`/profile/${encodeURIComponent(currentProfile?.id || "")}`}
                className="px-5 py-2.5 rounded-xl bg-[#C8A97E] text-[#0D111A] text-xs font-extrabold"
              >
                Zum Profil & +41 Nummer →
              </Link>
            </div>
          </section>
        ) : (
          <form onSubmit={handleSend} className="p-6 sm:p-8 rounded-2xl bg-[#121722] border border-white/10 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Gewünschtes Schweizer Profil wählen *</label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-xs text-white font-bold"
                >
                  {profiles.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.rawName} — {p.city} ({p.canton}) · CHF {p.advertisedBaseChf || 350}.–
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Deine Rückruf- / WhatsApp-Nummer *</label>
                <input
                  type="text"
                  required
                  value={clientContact}
                  onChange={(e) => setClientContact(e.target.value)}
                  placeholder="+41 79 ... oder Telegram-Handle"
                  className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Dein Vorname / Alias</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="z.B. Marc (Diskret)"
                  className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Gewünschte Dauer</label>
                <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-xs text-white">
                  <option>30 Min. Express-Date</option>
                  <option>60 Min. Klassisches Date</option>
                  <option>90 Min. Genuss-Session</option>
                  <option>2 Std. Dinner- oder Hotel-Begleitung</option>
                  <option>Overnight / VIP-Begleitung</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Treffpunkt (Incall / Outcall)</label>
                <select value={meetingType} onChange={(e) => setMeetingType(e.target.value)} className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-xs text-white">
                  <option>Incall (Privates Apartment / Studio)</option>
                  <option>Outcall (Mein Hotel / Privatadresse)</option>
                  <option>1:1 Live-Video-Call vorab</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Gewünschte Uhrzeit & kurze Nachricht *</label>
              <textarea
                rows={3}
                required
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="z.B. Heute ab 19:00 Uhr für 60 Min. in Zug verfügbar? Bitte um kurze Bestätigung per WhatsApp..."
                className="w-full rounded-xl bg-[#0D111A] border border-white/15 p-3.5 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-4 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] font-extrabold text-xs uppercase tracking-wider cursor-pointer"
            >
              {sending ? "Wird verschlüsselt übermittelt..." : `📨 Diskrete Termin-Anfrage an ${currentProfile?.rawName || "Anbieterin"} senden →`}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
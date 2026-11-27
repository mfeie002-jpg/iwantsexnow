import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SEO from "@/components/SEO";
import { submitProviderReport, WorkspaceError } from "@/lib/marketplace/provider-workspace-client";
const reasons = ["Falsche Angabe", "Eigenes Bild oder Profil", "Entfernung beantragen", "Unpassender Inhalt", "Anderer Hinweis"];
const inputStyle = { width: "100%", padding: "14px 16px", borderRadius: 10, border: "1px solid var(--night-border, #55404e)", background: "var(--night-panel, #20171f)", color: "inherit", minHeight: 48 };
export default function ReportPage() {
  const router = useRouter();
  const [profileId, setProfileId] = useState(""); const [sourceUrl, setSourceUrl] = useState("");
  const [reason, setReason] = useState(reasons[0]); const [details, setDetails] = useState(""); const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [caseId, setCaseId] = useState("");
  useEffect(() => { if (!router.isReady) return; const raw = router.query.id || router.query.profileId; if (typeof raw === "string") setProfileId(raw.slice(0,150)); const url = router.query.sourceUrl; if (typeof url === "string") setSourceUrl(url.slice(0,500)); }, [router.isReady, router.query.id, router.query.profileId, router.query.sourceUrl]);
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setCaseId("");
    try { setCaseId(await submitProviderReport({ profileId, sourceUrl, reason: reason + (details.trim() ? ": " + details.trim() : ""), contact })); }
    catch (cause) { setError(cause instanceof WorkspaceError && cause.status === 400 ? "Bitte gib das betroffene Profil oder eine Quellenadresse an." : "Deine Meldung wurde nicht als gespeichert bestätigt. Der vertrauliche Meldeweg ist möglicherweise vorübergehend nicht verfügbar. Bitte versuche es erneut oder nutze die Kontaktseite."); }
    finally { setBusy(false); }
  }
  return <main id="main" className="night-page"><SEO title="Vertrauliche Meldung | iwantsexnow.ch" description="Fehler, Bildrechte oder Entfernung eines Eintrags nachvollziehbar melden." noindex /><div className="night-container">
    <section className="night-section"><p className="night-kicker">Korrektur · Bildrechte · Kontrolle</p><h1 className="night-title">Etwas stimmt nicht?<br />Sag uns, wo.</h1><p className="night-lead">Wähle einen Grund und die betroffene Stelle. Teile nur die Informationen, die zur Prüfung nötig sind.</p></section>
    <section className="night-section night-grid night-grid-2" style={{ alignItems: "start" }}><div className="night-panel"><h2>Ein klarer Meldeweg.</h2><p className="night-muted">Eine Meldung wird vertraulich zur Prüfung gespeichert, sofern der Dienst verfügbar ist. Der Eingang bestätigt weder eine Entfernung noch die Inhaberschaft eines Profils.</p><p className="night-muted">Keine Ausweiskopie, Bankangaben oder besonders privaten Zusatzinformationen in dieses Formular eingeben.</p><Link className="night-button-secondary" href="/contact">Kontaktinformationen</Link><Link className="night-button-secondary" href="/safety">Umgang mit Vertrauen</Link></div>
      <form className="night-panel night-form" onSubmit={submit} aria-label="Vertrauliche Meldung einreichen"><fieldset disabled={busy || Boolean(caseId)} style={{ border: 0, padding: 0 }}><legend><h2>Vertrauliche Meldung einreichen</h2></legend><div role="group" aria-label="Meldegrund" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{reasons.map(value => <button key={value} className={reason === value ? "night-button" : "night-button-secondary"} type="button" aria-pressed={reason === value} onClick={() => setReason(value)}>{value}</button>)}</div>
        <label>Betroffene Profil-ID<input style={inputStyle} value={profileId} maxLength={150} onChange={event => setProfileId(event.target.value)} /></label><label>Oder Link zur betroffenen Seite<input style={inputStyle} type="url" value={sourceUrl} maxLength={500} placeholder="https://…" onChange={event => setSourceUrl(event.target.value)} /></label>
        <label>Kurze Erläuterung, falls nötig<textarea style={inputStyle} value={details} maxLength={400} rows={5} onChange={event => setDetails(event.target.value)} /></label><label>Rückkontakt, freiwillig<input style={inputStyle} value={contact} maxLength={120} autoComplete="off" onChange={event => setContact(event.target.value)} /></label>
        <p className="night-muted">Die Meldung wird erst mit dem folgenden Button übermittelt. Kein Konto nötig.</p><button className="night-button" type="submit">{busy ? "Meldung wird übermittelt …" : "Vertrauliche Meldung einreichen"}</button></fieldset>
        {error && <p className="night-help" role="alert">{error}</p>}{caseId && <div className="night-help" role="status"><h3>Meldung gespeichert.</h3><p>Fallnummer: <span style={{ overflowWrap: "anywhere" }}>{caseId}</span></p><p>Der Eingang ist bestätigt. Eine Entfernung oder andere Massnahme wurde damit noch nicht bestätigt.</p></div>}
      </form></section></div></main>;
}

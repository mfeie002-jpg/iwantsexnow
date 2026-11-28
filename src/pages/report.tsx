import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SEO from "@/components/SEO";
import { checkProviderReportReceipt, submitProviderReport, WorkspaceError } from "@/lib/marketplace/provider-workspace-client";
import { validateReportInput } from "@/lib/marketplace/report-input";
import { clearReportSubmissionKey, ensureReportSubmissionKey, readReportSubmissionKey, ReportSessionError } from "@/lib/marketplace/report-session";

const reasons = ["Falsche Angabe", "Eigenes Bild oder Profil", "Profilübernahme anfragen", "Entfernung beantragen", "Unpassender Inhalt", "Anderer Hinweis"];
const inputStyle = { width: "100%", padding: "14px 16px", borderRadius: 10, border: "1px solid var(--night-border, #55404e)", background: "var(--night-panel, #20171f)", color: "inherit", minHeight: 48 };
type ReportError = { message: string; field?: "profileId" | "sourceUrl" | "reason" | "contact" | "form" };
const fieldIds = { profileId: "report-profile", sourceUrl: "report-source", reason: "report-details", contact: "report-contact", form: "report-profile" };
function referenceFromQuery(query: { id?: string | string[]; profileId?: string | string[]; sourceUrl?: string | string[]; request?: string | string[] }) {
  const raw = query.id || query.profileId;
  const reason = query.request === "removal" ? "Entfernung beantragen" : query.request === "claim" ? "Profilübernahme anfragen" : reasons[0];
  return { reason, profileId: typeof raw === "string" ? raw : "", sourceUrl: typeof query.sourceUrl === "string" ? query.sourceUrl : "" };
}

export default function ReportPage() {
  const router = useRouter();
  const [profileId, setProfileId] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [reason, setReason] = useState(reasons[0]);
  const [details, setDetails] = useState("");
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);
  const [submissionKey, setSubmissionKey] = useState<string | null>(null);
  const [error, setError] = useState<ReportError | null>(null);
  const [caseId, setCaseId] = useState("");
  const [recoveredReceipt, setRecoveredReceipt] = useState(false);
  const inFlight = useRef(false);
  const fieldsEdited = useRef(false);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try { setSubmissionKey(readReportSubmissionKey(window.sessionStorage)); }
    catch { setError({ message: "Dein Browser kann die Kennung dieser Meldung nicht sicher speichern oder lesen. Bei diesem Aufruf wurde nichts übermittelt. Eine frühere Übermittlung bleibt davon unberührt. Bitte nutze die Kontaktseite, falls der Browserspeicher weiterhin nicht verfügbar ist." }); }
  }, []);

  useEffect(() => {
    if (!router.isReady || fieldsEdited.current || inFlight.current || submissionKey || caseId) return;
    // The restore effect may not have rendered its state yet on the initial mount.
    try { if (readReportSubmissionKey(window.sessionStorage)) return; } catch { return; }
    const reference = referenceFromQuery(router.query);
    setReason(reference.reason);
    setProfileId(reference.profileId);
    setSourceUrl(reference.sourceUrl);
  }, [router.isReady, router.query, submissionKey, caseId]);

  useEffect(() => {
    const feedback = error ? feedbackRef.current : busy || caseId ? statusRef.current : null;
    if (!feedback) return;
    feedback.focus({ preventScroll: true });
    feedback.scrollIntoView({ block: "center", behavior: "instant" });
  }, [error, busy, caseId]);

  const invalid = (field: ReportError["field"]) => Boolean(error?.field === field || (error?.field === "form" && (field === "profileId" || field === "sourceUrl")));
  const describedBy = (field: ReportError["field"], hint?: string) => [hint, invalid(field) ? "report-error" : ""].filter(Boolean).join(" ") || undefined;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (inFlight.current || caseId) return;
    if (reason === "Profilübernahme anfragen" && !contact.trim()) {
      setError({ field: "contact", message: "Gib bitte einen Rückkontakt für die Prüfung deiner Anfrage an." });
      return;
    }
    const checked = validateReportInput({ profileId, sourceUrl, reason: reason + (details.trim() ? ": " + details.trim() : ""), contact });
    if (checked.ok === false) {
      setError({ message: checked.message, field: checked.field });
      return;
    }
    inFlight.current = true;
    setBusy(true);
    setError(null);
    try {
      const key = ensureReportSubmissionKey(window.sessionStorage, submissionKey);
      setSubmissionKey(key);
      const confirmed = await submitProviderReport({ ...checked.value, submissionKey: key });
      setRecoveredReceipt(false);
      setCaseId(confirmed);
    } catch (cause) {
      setError({ message: reportErrorMessage(cause) });
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  function reportErrorMessage(cause: unknown): string {
    if (cause instanceof ReportSessionError || !(cause instanceof WorkspaceError)) {
      return "Die Meldekennung konnte im Browser nicht sicher gespeichert oder gelesen werden. Dieser Versuch wurde nicht gesendet. Eine frühere Übermittlung bleibt davon unberührt. Bitte nutze bei Bedarf die Kontaktseite.";
    }
    if (cause.status === 400) return "Bitte prüfe die Profil-ID, Quellenadresse und Länge deiner Angaben. Die Meldung wurde nicht als gespeichert bestätigt.";
    if (cause.status === 409) return "Unter dieser Meldekennung wurde bereits eine Meldung mit anderen Angaben gespeichert. Es wurde keine zweite Meldung angelegt und nichts überschrieben. Prüfe den bisherigen Eingang über den Button unten.";
    if (cause.status === 404) return "Der bisherige Eingang ist noch nicht bestätigt. Eine frühere Übermittlung könnte noch abgeschlossen werden. Du kannst mit denselben Angaben erneut absenden; die Meldekennung bleibt erhalten.";
    return "Der Eingang deiner Meldung konnte nicht bestätigt werden. Deine Angaben und die Meldekennung bleiben erhalten. Prüfe den Eingang erneut oder sende dieselben Angaben nochmals ab; daraus entsteht kein zweiter Fall unter dieser Kennung.";
  }

  async function checkReceipt() {
    if (inFlight.current || caseId || !submissionKey) return;
    inFlight.current = true;
    setChecking(true);
    setBusy(true);
    setError(null);
    try {
      const key = ensureReportSubmissionKey(window.sessionStorage, submissionKey);
      const confirmed = await checkProviderReportReceipt(key);
      setRecoveredReceipt(true);
      setCaseId(confirmed);
    } catch (cause) { setError({ message: reportErrorMessage(cause) }); }
    finally { inFlight.current = false; setBusy(false); setChecking(false); }
  }

  function beginNewReport() {
    if (inFlight.current || !caseId || !submissionKey) return;
    try {
      clearReportSubmissionKey(window.sessionStorage, submissionKey);
      const reference = referenceFromQuery(router.isReady ? router.query : {});
      fieldsEdited.current = false;
      setSubmissionKey(null);
      setCaseId("");
      setRecoveredReceipt(false);
      setProfileId(reference.profileId);
      setSourceUrl(reference.sourceUrl);
      setReason(reference.reason);
      setDetails("");
      setContact("");
      setError(null);
      // Wait for the receipt panel to be replaced by the editable form.
      requestAnimationFrame(() => profileRef.current?.focus());
    } catch {
      setError({ message: "Die bisherige Meldekennung konnte nicht sicher zurückgesetzt werden. Die bestätigte Meldung bleibt bestehen; eine neue Meldung wurde nicht begonnen." });
    }
  }

  return <main id="main" tabIndex={-1} className="night-page">
    <SEO title="Vertrauliche Meldung | iwantsexnow.ch" description="Fehler, Bildrechte oder Entfernung eines Eintrags nachvollziehbar melden." noindex />
    <div className="night-container">
      <section className="night-section"><p className="night-kicker">Korrektur · Bildrechte · Kontrolle</p><h1 className="night-title">Etwas stimmt nicht?<br />Sag uns, wo.</h1><p className="night-lead">Wähle einen Grund und die betroffene Stelle. Teile nur die Informationen, die zur Prüfung nötig sind.</p></section>
      <section className="night-section night-grid night-grid-2" style={{ alignItems: "start" }}>
        <div className="night-panel"><h2>Ein klarer Meldeweg.</h2><p className="night-muted">Eine Meldung wird vertraulich zur Prüfung gespeichert, sofern der Dienst verfügbar ist. Der Eingang bestätigt weder eine Entfernung noch die Inhaberschaft eines Profils.</p><p id="report-data-help" className="night-muted">Keine Ausweiskopie, Bankangaben oder besonders privaten Zusatzinformationen in dieses Formular eingeben.</p><Link className="night-button-secondary" href="/contact">Kontaktinformationen</Link><Link className="night-button-secondary" href="/safety">Umgang mit Vertrauen</Link></div>
        <form className="night-panel night-form" onSubmit={submit} noValidate aria-label="Vertrauliche Meldung einreichen" aria-describedby="report-data-help">
          {error && <div id="report-error" ref={feedbackRef} tabIndex={-1} className="night-help" role="alert"><h3>Bitte prüfe deine Meldung.</h3><p>{error.message}</p>{error.field ? <a href={`#${fieldIds[error.field]}`}>Zur betroffenen Angabe</a> : <Link href="/contact">Kontaktinformationen ansehen</Link>}</div>}
          {submissionKey && !caseId && <div className="night-help"><p>In diesem Tab ist bereits eine Meldekennung hinterlegt. Du kannst den bisherigen Eingang prüfen, auch nach dem Neuladen. Formularinhalte werden dafür nicht im Browserspeicher abgelegt.</p><button type="button" className="night-button-secondary" disabled={busy} onClick={checkReceipt}>Eingang erneut prüfen</button></div>}
          {!caseId && <fieldset disabled={busy} style={{ border: 0, padding: 0 }}>
            <legend><h2>Vertrauliche Meldung einreichen</h2></legend>
            <div role="group" aria-label="Meldegrund" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{reasons.map(value => <button key={value} className={reason === value ? "night-button" : "night-button-secondary"} type="button" aria-pressed={reason === value} onClick={() => { fieldsEdited.current = true; setReason(value); setError(null); }}>{value}</button>)}</div>
            <p id="report-reference-help" className="night-help">Mindestens eine Angabe ist nötig: Profil-ID oder vollständiger Link mit https:// oder http://. Links dürfen keine Zugangsdaten enthalten.</p>
            {reason === "Profilübernahme anfragen" && <p className="night-note">Gib einen Rückkontakt für die Prüfung an. Die Bearbeitung deines Profils wird erst nach einem Nachweis deiner Berechtigung freigeschaltet. Lade hier keine Ausweisdokumente hoch.</p>}
            <label htmlFor="report-profile">Betroffene Profil-ID<input id="report-profile" ref={profileRef} style={inputStyle} value={profileId} maxLength={150} autoComplete="off" aria-invalid={invalid("profileId")} aria-describedby={describedBy("profileId", "report-reference-help")} onChange={event => { fieldsEdited.current = true; setProfileId(event.target.value); setError(null); }} /></label>
            <label htmlFor="report-source">Oder Link zur betroffenen Seite<input id="report-source" style={inputStyle} type="url" value={sourceUrl} maxLength={500} autoComplete="off" placeholder="https://…" aria-invalid={invalid("sourceUrl")} aria-describedby={describedBy("sourceUrl", "report-reference-help")} onChange={event => { fieldsEdited.current = true; setSourceUrl(event.target.value); setError(null); }} /></label>
            <label htmlFor="report-details">Kurze Erläuterung, falls nötig<textarea id="report-details" style={inputStyle} value={details} maxLength={400} rows={5} aria-invalid={invalid("reason")} aria-describedby={describedBy("reason")} onChange={event => { fieldsEdited.current = true; setDetails(event.target.value); setError(null); }} /></label>
            <label htmlFor="report-contact">{reason === "Profilübernahme anfragen" ? "Rückkontakt für die Übernahmeprüfung" : "Rückkontakt, freiwillig"}<input id="report-contact" style={inputStyle} value={contact} maxLength={120} autoComplete="off" aria-invalid={invalid("contact")} aria-describedby={describedBy("contact")} onChange={event => { fieldsEdited.current = true; setContact(event.target.value); setError(null); }} /></label>
            <p className="night-muted">Die Meldung wird erst mit dem folgenden Button übermittelt. Kein Konto nötig. Für sichere Wiederholungen bleibt eine zufällige Kennung in diesem Tab gespeichert, auch nach einer Bestätigung.</p>
            <button className="night-button" type="submit">{busy ? checking ? "Eingang wird geprüft …" : "Meldung wird übermittelt …" : "Vertrauliche Meldung einreichen"}</button>
          </fieldset>}
          {(busy || caseId) && <div ref={statusRef} tabIndex={-1} className="night-help" role="status" aria-live="polite" aria-atomic="true">{caseId ? <><h3>{recoveredReceipt ? "Früherer Eingang bestätigt." : "Meldung gespeichert."}</h3><p>Fallnummer: <span style={{ overflowWrap: "anywhere" }}>{caseId}</span></p>{recoveredReceipt && <p>Diese Fallnummer bestätigt den früheren Eingang. Nachträgliche Änderungen im Formular sind damit nicht gespeichert.</p>}<p>Der ursprüngliche Eingang ist bestätigt. Dies ist kein aktueller Bearbeitungsstatus und keine Bestätigung einer Entfernung oder anderen Massnahme.</p></> : <><h3>{checking ? "Eingang wird geprüft." : "Übermittlung läuft."}</h3><p>Die Bestätigung des Meldeeingangs steht noch aus.</p></>}</div>}
          {caseId && <button type="button" className="night-button-secondary" onClick={beginNewReport}>Neue Meldung beginnen</button>}
        </form>
      </section>
    </div>
  </main>;
}

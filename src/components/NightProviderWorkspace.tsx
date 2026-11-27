import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import SEO from "@/components/SEO";
import type { DraftFields, PrivateDraft } from "@/lib/marketplace/drafts";
import { createProviderWorkspaceClient, emptyDraft, LOCAL_DRAFT_KEY, safeDraftFields, WorkspaceError, workspaceErrorMessage } from "@/lib/marketplace/provider-workspace-client";

const client = createProviderWorkspaceClient();
const inputStyle = { width: "100%", padding: "14px 16px", borderRadius: 10, border: "1px solid var(--night-border, #55404e)", background: "var(--night-panel, #20171f)", color: "inherit", minHeight: 48 };
function storedId(user: string, id?: string) {
  try { const key = "private-provider-draft:" + user; if (id === "") sessionStorage.removeItem(key); else if (id) sessionStorage.setItem(key, id); return sessionStorage.getItem(key) || ""; } catch { return ""; }
}
export default function NightProviderWorkspace({ mode }: { mode: "login" | "dashboard" | "editor" }) {
  const [fields, setFields] = useState<DraftFields>(emptyDraft);
  const [user, setUser] = useState("");
  const [id, setId] = useState("");
  const [openId, setOpenId] = useState("");
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState("");
  const [failure, setFailure] = useState(false);
  const [available, setAvailable] = useState(true);
  const [localPresent, setLocalPresent] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [logoutUncertain, setLogoutUncertain] = useState(false);
  function accept(draft: PrivateDraft, owner: string) {
    setFields({ displayAlias: draft.displayAlias, city: draft.city, description: draft.description, photoRightsConfirmed: draft.photoRightsConfirmed });
    setId(draft.id); setOpenId(draft.id); storedId(owner, draft.id); setDirty(false);
  }
  function failed(error: unknown) {
    setFailure(true); setMessage(workspaceErrorMessage(error));
    if (error instanceof WorkspaceError && error.status === 401) { setUser(""); setId(""); }
  }
  useEffect(() => {
    let active = true;
    let local: DraftFields | null = null;
    try { local = safeDraftFields(JSON.parse(localStorage.getItem(LOCAL_DRAFT_KEY) || "null")); } catch {}
    if (local) { setFields(local); setLocalPresent(true); }
    (async () => {
      try {
        const owner = await client.session(); if (!active) return; setUser(owner);
        const remembered = storedId(owner);
        if (remembered) { const draft = await client.open(owner, remembered); if (active) accept(draft, owner); }
      } catch (error) {
        if (!active) return;
        if (error instanceof WorkspaceError && error.status === 404) setAvailable(false);
        else if (!(error instanceof WorkspaceError) || error.status !== 401) failed(error);
      } finally { if (active) setBusy(false); }
    })();
    return () => { active = false; };
    // One session check; all later storage changes require an explicit action.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function change(next: Partial<DraftFields>) { setFields(previous => ({ ...previous, ...next })); setDirty(true); }
  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget, data = new FormData(form); setBusy(true); setMessage(""); setFailure(false);
    try {
      const owner = await client.signIn(String(data.get("email") || ""), String(data.get("password") || ""));
      setUser(owner); setId(""); setAvailable(true); setLogoutUncertain(false); setFields(emptyDraft());
      const previous = storedId(owner); if (previous) accept(await client.open(owner, previous), owner);
      setMessage("Angemeldet. Dein Arbeitsbereich speichert ausschliesslich private Entwürfe.");
    } catch (error) { failed(error); } finally { form.reset(); setBusy(false); }
  }
  async function signOut() {
    if (dirty && !window.confirm("Ungespeicherte Änderungen verwerfen und abmelden?")) return;
    setBusy(true); setFailure(false);
    try { await client.signOut(); setLogoutUncertain(false); setMessage("Abgemeldet. Dein privater Entwurf bleibt unveröffentlicht."); }
    catch { setLogoutUncertain(true); setFailure(true); setMessage("Abmeldung nicht vollständig bestätigt. Bitte erneut versuchen."); }
    finally { storedId(user, ""); setUser(""); setId(""); setOpenId(""); setFields(emptyDraft()); setDirty(false); setBusy(false); }
  }
  async function save(event: FormEvent) {
    event.preventDefault(); if (!user) return saveLocal(); setBusy(true); setMessage(""); setFailure(false);
    try { accept(await client.save(user, fields, id || undefined), user); setMessage("Privater Entwurf gespeichert. Nicht veröffentlicht und nicht zur Prüfung eingereicht."); }
    catch (error) { failed(error); } finally { setBusy(false); }
  }
  function saveLocal() {
    setFailure(false);
    try { localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(fields)); setLocalPresent(true); setDirty(false); setMessage("Entwurf in diesem Browser gespeichert. Kein Konto erstellt und nichts veröffentlicht. Andere Personen mit Zugriff auf diesen Browser können ihn sehen."); }
    catch { setFailure(true); setMessage("Lokales Speichern nicht möglich. Deine Angaben bleiben nur in diesem geöffneten Formular."); }
  }
  async function open(event: FormEvent) {
    event.preventDefault(); if (dirty && !window.confirm("Ungespeicherte Änderungen verwerfen und Entwurf öffnen?")) return;
    setBusy(true); setFailure(false); try { accept(await client.open(user, openId), user); setMessage("Deinen privaten Entwurf geladen."); }
    catch (error) { failed(error); } finally { setBusy(false); }
  }
  function clearLocal() {
    try { localStorage.removeItem(LOCAL_DRAFT_KEY); setLocalPresent(false); if (!user) { setFields(emptyDraft()); setDirty(false); } setMessage("Lokale Kopie gelöscht. Private Server-Entwürfe sind davon unberührt."); setFailure(false); }
    catch { setFailure(true); setMessage("Lokale Kopie konnte nicht gelöscht werden."); }
  }
  const title = mode === "login" ? "Zurück zu deinem Auftritt." : mode === "editor" ? "Gestalte deinen Auftritt." : "Dein Auftritt. Dein Arbeitsbereich.";
  return <main id="main" className="night-page"><SEO title={title + " | iwantsexnow.ch"} description="Eigene Angaben vorbereiten und kontrollierte private Entwürfe bearbeiten." noindex />
    <div className="night-container">
      <section className="night-section"><p className="night-kicker">Dein Auftritt · Deine Entscheidung</p><h1 className="night-title">{title}</h1>
        <p className="night-lead">Eigene Inhalte, klare Schritte und eine Vorschau vor jeder weiteren Entscheidung.</p>
        <nav aria-label="Anbieterbereich" style={{ display: "flex", flexWrap: "wrap", gap: 12 }}><Link className="night-button-secondary" href="/creator-dashboard">Übersicht</Link><Link className="night-button-secondary" href="/create-post">Entwurf bearbeiten</Link><Link className="night-button-secondary" href="/report">Hilfe & Meldung</Link></nav>
      </section>
      {message && <p className="night-panel" role={failure ? "alert" : "status"}>{message}</p>}
      {busy && <p role="status">Verbindung wird geprüft …</p>}
      {logoutUncertain && <button className="night-button-secondary" disabled={busy} onClick={signOut}>Abmeldung erneut versuchen</button>}
      <section className="night-section night-grid night-grid-2" style={{ alignItems: "start" }}>
        <div className="night-panel"><p className="night-kicker">{user ? "Private Sitzung bestätigt" : "Ohne Anmeldung vorbereiten"}</p><h2>{user ? "Dein privater Entwurf." : "Ein guter Anfang braucht Ruhe."}</h2>
          <p className="night-muted">{user ? "Deine Sitzung wurde vom Server geprüft. Entwürfe sind an dieses Konto gebunden. Das bestätigt keine Inhaberschaft eines bestehenden öffentlichen Profils." : "Du kannst einen eigenen Text lokal vorbereiten. Er bleibt in diesem Browser. Eine Anmeldung oder Profilübernahme entsteht dadurch nicht."}</p>
          {!available && <p className="night-help">Der private Kontozugang ist derzeit nicht freigeschaltet. Du kannst lokal weiterarbeiten; es wird kein Konto angelegt.</p>}
          <p className="night-muted">Die private Speicherung steht aktuell nur freigegebenen Konten zur Verfügung. Veröffentlichung, Bild-Upload und die Übernahme bestehender Einträge bleiben gesondert gesperrt.</p>
          <img className="night-art" src="/images/brand/v2/anbieter.webp" alt="Illustratives Türmotiv mit rotem Anhänger" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 14 }} />
          {user ? <button className="night-button-secondary" disabled={busy} onClick={signOut}>Abmelden</button> : mode !== "login" && <Link className="night-button-secondary" href="/login">Bestehendes Konto anmelden</Link>}
          {localPresent && <button className="night-button-secondary" disabled={busy} onClick={clearLocal}>Lokale Kopie löschen</button>}
        </div>
        {mode === "login" && !user ? <form className="night-panel night-form" onSubmit={signIn} aria-label="Bestehendes Konto anmelden"><fieldset disabled={busy || !available} style={{ border: 0, padding: 0 }}><legend><h2>Willkommen zurück.</h2></legend><p className="night-muted">Für bestehende, freigegebene Konten. Die Sitzung endet nach spätestens 30 Minuten.</p>
          <label>E-Mail<input style={inputStyle} name="email" type="email" autoComplete="username" required maxLength={254} /></label>
          <label>Passwort<input style={inputStyle} name="password" type="password" autoComplete="current-password" required maxLength={1024} /></label>
          <button className="night-button" type="submit">Privat anmelden</button></fieldset><Link className="night-button-secondary" href="/create-post">Ohne Konto einen Entwurf vorbereiten</Link></form> : mode === "editor" ? <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}><button className={preview ? "night-button-secondary" : "night-button"} onClick={() => setPreview(false)} aria-pressed={!preview}>Bearbeiten</button><button className={preview ? "night-button" : "night-button-secondary"} onClick={() => setPreview(true)} aria-pressed={preview}>Vorschau</button></div>
          {preview ? <article className="night-panel"><p className="night-kicker">Eigene Vorschau · Nicht öffentlich</p><h2>{fields.displayAlias || "Dein Anzeigename"}</h2><p>{fields.city || "Ort noch offen"}</p><p style={{ whiteSpace: "pre-wrap" }}>{fields.description || "Hier steht später deine eigene Beschreibung."}</p><p className="night-help">Keine Verifizierung und kein veröffentlichtes Angebot. Es wurden keine Leistungen oder Preise ergänzt.</p></article> : <form className="night-panel night-form" onSubmit={save} aria-label="Eigenen Entwurf bearbeiten"><fieldset disabled={busy} style={{ border: 0, padding: 0 }}><legend><h2>Deine Angaben.</h2></legend>
            <label>Anzeigename<input style={inputStyle} name="displayAlias" value={fields.displayAlias} maxLength={80} required onChange={event => change({ displayAlias: event.target.value })} /></label>
            <label>Ort<input style={inputStyle} name="city" value={fields.city} maxLength={100} required onChange={event => change({ city: event.target.value })} /></label>
            <label>Eigene Beschreibung<textarea style={inputStyle} name="description" value={fields.description} maxLength={1000} rows={7} onChange={event => change({ description: event.target.value })} /></label>
            <div className="night-help"><strong>Aus Stichworten wird ein klarer Text.</strong><p>Diese Schreibhilfe ordnet Zeilen und Abstände. Sie ergänzt keine Angaben und verwendet kein Sprachmodell.</p><button type="button" className="night-button-secondary" onClick={() => setSuggestion(fields.description.split(/\r?\n/).map(line => line.trim()).filter(Boolean).join("\n\n").slice(0,1000))}>Text ordnen</button>
              {suggestion && <><p style={{ whiteSpace: "pre-wrap" }}>{suggestion}</p><button type="button" className="night-button-secondary" onClick={() => { change({ description: suggestion }); setSuggestion(""); }}>Vorschlag übernehmen</button><button type="button" className="night-button-secondary" onClick={() => setSuggestion("")}>Verwerfen</button></>}</div>
            <label style={{ display: "flex", gap: 12, alignItems: "start" }}><input name="photoRightsConfirmed" type="checkbox" checked={fields.photoRightsConfirmed} onChange={event => change({ photoRightsConfirmed: event.target.checked })} />Ich bestätige die Rechte an künftig verwendeten Bildern. Das ersetzt keine Einwilligungs-, Alters- oder Profilprüfung.</label>
            <p className="night-muted">Hier werden keine Fotos hochgeladen. Die Bestätigung kann für einen unvollständigen Entwurf leer bleiben.</p>
            <button className="night-button" type="submit">{user ? "Privaten Entwurf speichern" : "In diesem Browser speichern"}</button>
            <p className="night-help">Die Veröffentlichung ist noch nicht freigeschaltet. Speichern veröffentlicht nichts.</p>
          </fieldset></form>}
        </div> : <div className="night-panel"><p className="night-kicker">Dein tatsächlicher Stand</p><h2>{id ? "Privater Entwurf geladen." : localPresent ? "Lokaler Entwurf vorhanden." : "Platz für deinen ersten Entwurf."}</h2><p>{fields.displayAlias || "Noch kein Anzeigename gespeichert"}</p><p className="night-muted">{fields.city || "Ort noch offen"}</p><div className="night-help"><p>Öffentliches Profil: nicht durch diesen Arbeitsbereich freigegeben.</p><p>Aufrufe und Anfragen: keine bestätigten Kennzahlen vorhanden.</p></div><Link className="night-button" href="/create-post">Entwurf bearbeiten</Link>{id && <p className="night-muted">Private Entwurfs-ID: <span style={{ overflowWrap: "anywhere" }}>{id}</span></p>}</div>}
      </section>
      {user && <section className="night-section"><form className="night-panel night-form" onSubmit={open}><h2>Vorhandenen eigenen Entwurf öffnen.</h2><p className="night-muted">Der Server prüft die Zuordnung zu deinem Konto.</p><label>Entwurfs-ID<input style={inputStyle} value={openId} onChange={event => setOpenId(event.target.value)} maxLength={36} required /></label><button className="night-button-secondary" disabled={busy} type="submit">Entwurf öffnen</button></form></section>}
    </div>
  </main>;
}

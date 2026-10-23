import { useEffect, useRef, useState, type FormEvent } from "react";
import type { GetServerSideProps } from "next";
import type { DraftFields, PrivateDraft } from "@/lib/marketplace/drafts";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const { privateDraftConfig, privateHeaders } = await import("@/lib/marketplace/private-draft-http");
  privateHeaders(res);
  return privateDraftConfig() ? { props: {} } : { notFound: true };
};
const empty: DraftFields = { displayAlias: "", city: "", description: "", photoRightsConfirmed: false };
const sessionUrl = "/api/private/provider-session";
const draftUrl = "/api/private/provider-drafts";
class RequestError extends Error { constructor(public status: number) { super("REQUEST_FAILED"); } }
async function request(url: string, method = "GET", body?: unknown) {
  const response = await fetch(url, { method, credentials: "same-origin", cache: "no-store",
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new RequestError(response.status);
  return response.json();
}
function remember(user: string, id?: string) {
  try {
    const key = "private-provider-draft:" + user;
    if (id === "") { sessionStorage.removeItem(key); return ""; }
    if (id) sessionStorage.setItem(key, id);
    return sessionStorage.getItem(key) || "";
  } catch { return ""; }
}
export default function ProviderDraftPage() {
  const [user, setUser] = useState("");
  const [fields, setFields] = useState<DraftFields>({ ...empty });
  const [id, setId] = useState("");
  const [openId, setOpenId] = useState("");
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState("");
  const [failure, setFailure] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [logoutUncertain, setLogoutUncertain] = useState(false);
  const epoch = useRef(0);
  function reset() { setFields({ ...empty }); setId(""); setOpenId(""); setDirty(false); }
  function accept(draft: PrivateDraft, owner: string) {
    setFields({ displayAlias: draft.displayAlias, city: draft.city, description: draft.description,
      photoRightsConfirmed: draft.photoRightsConfirmed });
    setId(draft.id); setOpenId(draft.id); setDirty(false); remember(owner, draft.id);
  }
  function failed(error: unknown) {
    setFailure(true);
    if (error instanceof RequestError && error.status === 401) {
      setUser(""); reset();
      setMessage("Sitzung abgelaufen oder nicht zugelassen. Bitte erneut anmelden. Ungespeicherte Felder wurden geleert.");
    } else if (error instanceof RequestError && error.status === 404) {
      setMessage("Entwurf nicht verfügbar. Er kann fehlen, gesperrt sein oder einem anderen Konto gehören.");
    } else if (error instanceof RequestError && error.status === 429) {
      setMessage("Zu viele Versuche. Bitte später erneut versuchen.");
    } else setMessage("Vorgang fehlgeschlagen. Es wurde kein erfolgreicher Speicherstatus bestätigt. Bitte erneut prüfen.");
  }
  useEffect(() => {
    const current = ++epoch.current;
    (async () => {
      try {
        const session = await request(sessionUrl);
        if (current !== epoch.current) return;
        setUser(session.userId);
        const previous = remember(session.userId);
        if (previous) {
          try {
            const data = await request(draftUrl + "?id=" + encodeURIComponent(previous));
            if (current === epoch.current) accept(data.draft, session.userId);
          } catch (error) { if (current === epoch.current) failed(error); }
        }
      } catch (error) {
        if (current === epoch.current && (!(error instanceof RequestError) || error.status !== 401)) failed(error);
      } finally { if (current === epoch.current) setBusy(false); }
    })();
    return () => { ++epoch.current; };
    // Session bootstrap runs once; all later operations are explicit user actions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    function warn(event: BeforeUnloadEvent) { if (dirty) { event.preventDefault(); event.returnValue = ""; } }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget;
    const values = new FormData(form); setBusy(true); setMessage(""); setFailure(false);
    try {
      const data = await request(sessionUrl, "POST", { email: values.get("email"), password: values.get("password") });
      reset(); setUser(data.userId); setLogoutUncertain(false);
      setMessage("Angemeldet. Ein Entwurf ist privat und wird nicht veröffentlicht.");
      const previous = remember(data.userId);
      if (previous) accept((await request(draftUrl + "?id=" + encodeURIComponent(previous))).draft, data.userId);
    } catch (error) { failed(error); }
    finally { form.reset(); setBusy(false); }
  }
  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage(""); setFailure(false);
    try {
      const data = await request(draftUrl, id ? "PUT" : "POST", id ? { id, fields } : fields);
      accept(data.draft, user); setMessage("Privater Entwurf gespeichert. Nicht veröffentlicht und nicht zur Prüfung eingereicht.");
    } catch (error) { failed(error); } finally { setBusy(false); }
  }
  async function open(event: FormEvent) {
    event.preventDefault();
    if (dirty && !window.confirm("Ungespeicherte Änderungen verwerfen und Entwurf öffnen?")) return;
    setBusy(true); setMessage(""); setFailure(false);
    try { accept((await request(draftUrl + "?id=" + encodeURIComponent(openId))).draft, user); setMessage("Privaten Entwurf geladen."); }
    catch (error) { failed(error); } finally { setBusy(false); }
  }
  async function signOut() {
    if (dirty && !window.confirm("Ungespeicherte Änderungen verwerfen und abmelden?")) return;
    setBusy(true); setMessage(""); setFailure(false);
    try { await request(sessionUrl, "DELETE"); setLogoutUncertain(false); setMessage("Abgemeldet."); }
    catch { setLogoutUncertain(true); setFailure(true); setMessage("Abmeldung nicht vollständig bestätigt. Die Sitzung ist möglicherweise noch aktiv. Bitte erneut versuchen."); }
    finally { remember(user, ""); setUser(""); reset(); setBusy(false); }
  }
  const inputClass = "w-full rounded border border-slate-500 bg-slate-950 p-3 text-white";
  return <main className="min-h-screen bg-slate-950 px-5 py-12 text-white">
    <div className="mx-auto max-w-2xl space-y-6">
      <p className="text-sm font-bold uppercase tracking-wide text-amber-300">Privater Funktionstest / 18+</p>
      <h1 className="text-3xl font-bold">Privater Anbieter-Entwurf</h1>
      <p>Nur für freigegebene Testkonten und synthetische Angaben. Keine echten Personen-, Kontakt- oder Identitätsdaten eingeben.
        Entwürfe werden weder veröffentlicht noch als verifizierte Profile freigegeben.</p>
      <p>Die Testsitzung endet spätestens nach 30 Minuten. Nicht gespeicherte Angaben bleiben nur in diesem geöffneten Formular.</p>
      {message && <p role={failure ? "alert" : "status"} className="rounded border border-amber-300 p-3">{message}</p>}
      {busy && <p role="status">Vorgang läuft …</p>}
      {logoutUncertain && <button disabled={busy} className="rounded border p-3" onClick={signOut}>Abmeldung erneut versuchen</button>}
      {!user ? <form onSubmit={signIn} className="space-y-4" aria-label="Privater Testzugang">
        <fieldset disabled={busy} className="space-y-4">
          <legend className="mb-3 font-semibold">Bestehendes Testkonto anmelden</legend>
          <label className="block">E-Mail<input className={inputClass} name="email" type="email" autoComplete="username" required maxLength={254} /></label>
          <label className="block">Passwort<input className={inputClass} name="password" type="password" autoComplete="current-password" required maxLength={1024} /></label>
          <button className="rounded bg-amber-400 px-5 py-3 font-bold text-black" type="submit">Privat anmelden</button>
        </fieldset>
      </form> : <>
        <button className="rounded border p-3" disabled={busy} onClick={signOut}>Abmelden</button>
        <form onSubmit={open} className="space-y-2" aria-label="Eigenen Entwurf öffnen">
          <label className="block">Eigene Entwurfs-ID<input className={inputClass} value={openId} onChange={e => setOpenId(e.target.value)} required maxLength={36} disabled={busy} /></label>
          <button type="submit" className="rounded border p-3" disabled={busy}>Entwurf öffnen</button>
        </form>
        <form onSubmit={save} aria-label="Privaten Entwurf bearbeiten">
          <fieldset disabled={busy} className="space-y-4">
            <legend className="mb-4 font-semibold">{id ? "Privater Entwurf: " + id : "Neuer privater Entwurf"}</legend>
            <label className="block">Anzeigename<input className={inputClass} value={fields.displayAlias} maxLength={80} required onChange={e => { setFields({ ...fields, displayAlias: e.target.value }); setDirty(true); }} /></label>
            <label className="block">Stadt<input className={inputClass} value={fields.city} maxLength={100} required onChange={e => { setFields({ ...fields, city: e.target.value }); setDirty(true); }} /></label>
            <label className="block">Beschreibung<textarea className={inputClass} value={fields.description} maxLength={1000} rows={6} onChange={e => { setFields({ ...fields, description: e.target.value }); setDirty(true); }} /></label>
            <label className="flex gap-3"><input type="checkbox" checked={fields.photoRightsConfirmed} onChange={e => { setFields({ ...fields, photoRightsConfirmed: e.target.checked }); setDirty(true); }} />Ich bestätige die Rechte an künftig verwendeten Bildern. Dies ersetzt keine Einwilligungs-, Alters- oder Profilprüfung.</label>
            <p>Hier werden keine Fotos hochgeladen. Die Bestätigung darf für einen unvollständigen Entwurf leer bleiben.</p>
            <button type="submit" className="rounded bg-amber-400 px-5 py-3 font-bold text-black">Privat speichern</button>
          </fieldset>
        </form>
        <button disabled={busy} className="rounded border p-3" onClick={() => {
          if (!dirty || window.confirm("Ungespeicherte Änderungen verwerfen?")) { remember(user, ""); reset(); setMessage(""); }
        }}>Neuen Entwurf beginnen</button>
      </>}
    </div>
  </main>;
}

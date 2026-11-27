import React, { useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";

const OBSERVED_AT = "27.11.2026";
const ART = "/images/brand/v2/";
type Portal = {
  name: string;
  domain: string;
  url?: string;
  status: string;
  readable: boolean;
  discovery: string;
  evidence: string;
};

export const COMPARISON_PORTALS: readonly Portal[] = [
  { name: "and6", domain: "and6.com", url: "https://www.and6.com/de", status: "Startseite gelesen", readable: true, discovery: "Regionen, Kategorien, Filter und Sortierung sind sichtbar.", evidence: "Der Betreiber beschreibt eine redaktionelle Prüfung. Deren Durchführung haben wir nicht unabhängig untersucht." },
  { name: "6navi", domain: "6navi.ch", url: "https://6navi.ch/", status: "Startseite gelesen", readable: true, discovery: "Region, Rubrik und weitere Filter strukturieren den Einstieg.", evidence: "Mehrere Verifizierungsstufen werden angezeigt. Der jeweilige Prüfprozess bleibt in dieser Sicht offen." },
  { name: "sex.ch", domain: "sex.ch", url: "https://sex.ch/", status: "Nicht auswertbar", readable: false, discovery: "Beim dokumentierten Abruf erhielten wir keine belastbar auswertbare Oberfläche.", evidence: "Das ist keine Aussage über die generelle Erreichbarkeit, Qualität oder Nutzung der Website." },
  { name: "ladies.ch", domain: "ladies.ch", url: "https://ladies.ch/", status: "Nicht auswertbar", readable: false, discovery: "Beim dokumentierten Abruf erhielten wir keine belastbar auswertbare Oberfläche.", evidence: "Aussagen zu Prüfverfahren, Bedienung oder aktuellen Inseraten bleiben offen." },
  { name: "Choice", domain: "saferchoice.ch", url: "https://saferchoice.ch/", status: "Dokumente gelesen", readable: true, discovery: "Die Startseite war im Textabruf nicht auswertbar. Ausgewertet wurden öffentliche Erklär- und Datenschutztexte.", evidence: "Ein Betreibertext beschreibt eine Identitätsprüfung mit Ausweis und Selfie. Dies ist eine Selbstauskunft, keine unabhängige Bestätigung." },
  { name: "Lolla", domain: "lolla.ch", url: "https://www.lolla.ch/", status: "Nur Einstieg gelesen", readable: false, discovery: "Ein Erwachsenenhinweis mit Eintritt war sichtbar.", evidence: "Filter, Datenschutzabläufe und Prüfverfahren hinter diesem Einstieg wurden nicht beurteilt." },
  { name: "Megaescort", domain: "megaescort.ch", url: "https://megaescort.ch/", status: "Nicht auswertbar", readable: false, discovery: "Die Primärseite konnte bei diesem Abruf nicht ausgewertet werden.", evidence: "Ältere Beschreibungen Dritter ersetzen keine Beobachtung der aktuellen Oberfläche." },
  { name: "Target Escorts", domain: "target-escort.ch", status: "Domain unbestätigt", readable: false, discovery: "Die Zuordnung von Markenname, Domain und Betreiber ist nicht bestätigt.", evidence: "target-escort.ch bleibt ein unbestätigter Rechercheansatz. Deshalb wird die Domain hier nicht als bestätigte Portalquelle verlinkt." },
  { name: "La Dama", domain: "ladama-escort.ch", url: "https://ladama-escort.ch/", status: "Startseite gelesen", readable: true, discovery: "Eigenständige Bereiche für Orte, Preise und Magazin sowie ein klassisches Anfrageformular sind sichtbar.", evidence: "Ein Identitätsprüfverfahren ist in unserer Quellenbasis nicht belegt. Daraus folgt keine Aussage, dass keines existiert." },
  { name: "Girls Deluxe", domain: "girls-deluxe.ch", url: "https://girls-deluxe.ch/", status: "Startseite gelesen", readable: true, discovery: "Die Navigation gliedert sich unter anderem nach Orten, Preisen und Ambiente.", evidence: "Datenschutzlink und Einwilligungsfeld waren sichtbar. Die technische Umsetzung wurde nicht geprüft." },
];

const LEGACY_REPORTS: Record<string, { name: string; domain: string }> = {
  "xdate-review": { name: "xdate.ch", domain: "xdate.ch" },
  "fgirl-review": { name: "fgirl.ch", domain: "fgirl.ch" },
  "rosalon-review": { name: "rosalon.ch", domain: "rosalon.ch" },
  "kaufmich-review": { name: "kaufmich.com", domain: "kaufmich.com" },
};

export function resolvePortalReport(slug: string): string | null {
  if (slug === "and6" || slug === "and6-review") return "and6-review";
  return Object.prototype.hasOwnProperty.call(LEGACY_REPORTS, slug) ? slug : null;
}

export const PORTAL_REPORT_SLUGS = ["and6", "and6-review", ...Object.keys(LEGACY_REPORTS)];

function Page({ title, description, path, children }: { title: string; description: string; path: string; children: React.ReactNode }) {
  return <main id="main" className="night-page">
    <SEO title={`${title} | iwantsexnow.ch`} description={description} url={`https://iwantsexnow.ch${path}`} />
    <div className="night-container">{children}</div>
  </main>;
}

function Art({ file, alt, caption }: { file: string; alt: string; caption?: string }) {
  return <figure className="night-art"><img src={`${ART}${file}`} alt={alt} loading="lazy" width={960} height={640} />{caption && <figcaption className="night-muted">{caption}</figcaption>}</figure>;
}

function Actions({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-3 mt-6">{children}</div>;
}

function Source({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{children}<span className="sr-only"> (externe Quelle, neuer Tab)</span> ↗</a>;
}

function MethodHelp() {
  return <details className="night-help">
    <summary>Wie lese ich die Quellenangaben?</summary>
    <div className="night-grid night-grid-3 mt-5">
      <div><h3>Beobachtet</h3><p>Eine Navigation, ein Feld oder ein Text war im dokumentierten Abruf sichtbar. Das sagt noch nichts über die Funktion dahinter aus.</p></div>
      <div><h3>Vom Betreiber beschrieben</h3><p>Eine Website erklärt einen eigenen Ablauf. Ohne unabhängige Prüfung übernehmen wir daraus kein Gütesiegel.</p></div>
      <div><h3>Offen</h3><p>Ein Beleg fehlt oder die Seite liess sich nicht auswerten. Offen bedeutet weder schlecht noch widerlegt.</p></div>
    </div>
  </details>;
}

export function PortalComparisonPage() {
  const [filter, setFilter] = useState<"all" | "readable" | "open">("all");
  const visible = COMPARISON_PORTALS.filter(portal => filter === "all" || (filter === "readable" ? portal.readable : !portal.readable));
  return <Page title="Schweizer Portalvergleich mit Quellen" description="Zehn ausgewählte Websites nach denselben Fragen betrachtet: Orientierung, Transparenz und belegbare Aussagen. Quellenstand 27.11.2026." path="/reviews">
    <section className="night-section night-grid night-grid-2">
      <div><p className="night-kicker">Der offene Vergleich · Stand {OBSERVED_AT}</p><h1 className="night-title">Weniger Versprechen.<br />Mehr Durchblick.</h1><p className="night-lead">Zehn ausgewählte Websites. Dieselben Fragen. Und ein klares «offen», wenn ein Beleg fehlt.</p><Actions><Link className="night-button" href="/reviews/and6">and6-Analyse lesen</Link><a className="night-button-secondary" href="#portalvergleich">Alle zehn ansehen</a></Actions></div>
      <Art file="compare-night-v2.png" alt="Illustration eines Fernglases vor einer Schweizer Berglandschaft im Abendlicht" caption="Illustrative Markenwelt · Die Auswahl ist kein Markt-, Qualitäts- oder Traffic-Ranking." />
    </section>
    <section className="night-section night-grid night-grid-3" aria-label="Vergleichskriterien">
      <article className="night-panel"><p className="night-kicker">01 / Orientierung</p><h2>Wie beginnt die Suche?</h2><p className="night-muted">Sichtbare Ortswahl, Kategorien und Filter zeigen, wie ein Einstieg ohne lange Texteingabe möglich wird.</p></article>
      <article className="night-panel"><p className="night-kicker">02 / Transparenz</p><h2>Was ist nachvollziehbar?</h2><p className="night-muted">Preisstruktur, Herkunft und verständliche Datenschutzinformationen helfen, Angaben einzuordnen.</p></article>
      <article className="night-panel"><p className="night-kicker">03 / Belege</p><h2>Was bleibt offen?</h2><p className="night-muted">Ein Prüfzeichen ist nur so aussagekräftig wie sein erklärter Umfang. Wir trennen Werbeversprechen von Beobachtung.</p></article>
    </section>
    <section className="night-section" id="portalvergleich">
      <p className="night-kicker">Zehn Websites aus der Projektauswahl</p><h2>Eine Übersicht mit sichtbaren Grenzen.</h2>
      <p className="night-muted">Öffentliche Seiten und Dokumente wurden am {OBSERVED_AT} gelesen. Es gab keine Kontotests, Kontaktanfragen, technische Datenschutzprüfung oder repräsentative Nutzungsstudie.</p>
      <div className="flex flex-wrap gap-3 my-6" role="group" aria-label="Quellenstatus filtern">
        {([{ value: "all", label: "Alle zehn" }, { value: "readable", label: "Auswertbare Quellen" }, { value: "open", label: "Offene Quellenlage" }] as const).map(item => <button type="button" key={item.value} className={filter === item.value ? "night-button" : "night-button-secondary"} aria-pressed={filter === item.value} onClick={() => setFilter(item.value)}>{item.label}</button>)}
      </div>
      <p role="status" aria-live="polite" className="night-muted mb-5">{visible.length} von 10 Websites angezeigt</p>
      <div className="night-grid night-grid-2">{visible.map(portal => <article className="night-panel" key={portal.name}>
        <p className="night-kicker">{portal.status}</p><h3>{portal.name}</h3><p>{portal.discovery}</p><p className="night-muted mt-3">{portal.evidence}</p>
        {portal.name === "Choice" && <p className="night-muted mt-3"><Source href="https://saferchoice.ch/learn/inclusivity/exploring-bdsm-and-sex-positive-coaching-with-choice-a-safe-introduction-to-kink-for-the-curious">Erklärtext des Betreibers</Source> · <Source href="https://saferchoice.ch/privacy-policy">Datenschutzerklärung</Source></p>}
        <div className="flex flex-wrap gap-4 mt-5">{portal.url ? <Source href={portal.url}>Quelle: {portal.domain}</Source> : <span className="night-muted">Recherchekandidat: {portal.domain} · unbestätigt</span>}{portal.name === "and6" && <Link href="/reviews/and6-review" className="underline underline-offset-4">Analyse lesen</Link>}</div>
      </article>)}</div>
    </section>
    <section className="night-section"><MethodHelp /></section>
    <section className="night-section night-panel"><details><summary>Frühere Berichtsseiten weiterhin aufrufen</summary><p className="night-muted mt-4">Diese vorhandenen Adressen bleiben erreichbar. Ihre frühere Bewertung wird mangels dokumentierter aktueller Belege nicht übernommen; sie gehören nicht zur oben genannten Zehnerauswahl.</p><div className="flex flex-wrap gap-4 mt-4">{Object.entries(LEGACY_REPORTS).map(([slug, report]) => <Link key={slug} href={`/reviews/${slug}`} className="underline underline-offset-4">{report.name} · Quellenstand offen</Link>)}</div></details></section>
    <section className="night-section night-panel"><p className="night-kicker">Unser eigenes Interesse bleibt sichtbar</p><h2>Auch wir müssen uns erklären.</h2><p className="night-muted">Diese Übersicht erscheint auf iwantsexnow.ch. Wir betreiben selbst ein Verzeichnis und vergeben uns deshalb weder eine Vergleichsnote noch einen eigenen Testsieg. Die Reihenfolge der zehn Websites drückt keine Empfehlung aus.</p><Actions><Link href="/report" className="night-button-secondary">Eine Quellenangabe korrigieren</Link><Link href="/safety" className="night-button-secondary">Vertrauen verstehen</Link></Actions></section>
  </Page>;
}

export function PortalReportPage({ reportKey }: { reportKey: string }) {
  const isAnd6 = reportKey === "and6-review";
  const legacy = LEGACY_REPORTS[reportKey];
  if (!isAnd6 && !legacy) return null;
  const name = isAnd6 ? "and6.com" : legacy.name;
  return <Page title={`${name}: Quellenstand und offene Fragen`} description={`Nachvollziehbarer Quellenstand zu ${name}: beobachtete Funktionen, Betreiberangaben und offene Fragen, ohne unbelegte Rangliste oder Bewertung.`} path={`/reviews/${reportKey}`}>
    <section className="night-section">
      <Link href="/reviews" className="night-muted underline underline-offset-4">← Zum Portalvergleich</Link>
      <div className="night-grid night-grid-2 mt-8"><div><p className="night-kicker">Quellenstand · {OBSERVED_AT}</p><h1 className="night-title">{name}<br />klar eingeordnet.</h1><p className="night-lead">{isAnd6 ? "Was die sichtbare Oberfläche zeigt. Was der Betreiber beschreibt. Und was damit noch nicht bestätigt ist." : "Diese Berichtseite bleibt erreichbar. Ihre bisherigen Wertungen werden nur mit nachvollziehbaren Belegen weitergeführt."}</p></div><Art file="guide-vergleichen.webp" alt="Illustratives Motiv zum sorgfältigen Vergleichen von Informationen" caption="Illustration · Keine Bewertung einer realen Person" /></div>
    </section>
    {isAnd6 ? <>
      <section className="night-section night-grid night-grid-3">
        <article className="night-panel"><p className="night-kicker">Beobachtet</p><h2>Mehrere Wege hinein</h2><p className="night-muted">Regionen, Kategorien, Filter und Sortierung sind auf der gelesenen Startseite erkennbar. Sie bieten sichtbare Auswahlmöglichkeiten.</p><p className="mt-4"><Source href="https://www.and6.com/de">Startseite von and6</Source></p></article>
        <article className="night-panel"><p className="night-kicker">Betreiberangabe</p><h2>Redaktionelle Prüfung</h2><p className="night-muted">and6 beschreibt eine redaktionelle Prüfung von Bildern und Texten. Umfang und Durchführung wurden von uns nicht unabhängig kontrolliert.</p><p className="mt-4"><Source href="https://www.and6.com/de">Eigendarstellung auf and6</Source></p></article>
        <article className="night-panel"><p className="night-kicker">Nicht geprüft</p><h2>Wirkung im Alltag</h2><p className="night-muted">Keine Aussage zu Reaktionszeiten, tatsächlicher Verfügbarkeit, Identität einzelner Personen oder Qualität einer Dienstleistung.</p></article>
      </section>
      <section className="night-section night-grid night-grid-2"><article className="night-panel"><h2>Was der Einstieg erkennen lässt</h2><p>Die sichtbaren Kategorien und Ortsbereiche ermöglichen eine erste Eingrenzung. Weitere Filter können die Auswahl präzisieren.</p><p className="night-muted mt-4">Wie schnell Menschen damit ans Ziel kommen, wurde nicht mit Nutzertests gemessen. Aus einer sichtbaren Funktion folgt kein nachgewiesener Bedienungsvorteil.</p></article><article className="night-panel"><h2>Welche Fragen offenbleiben</h2><ul className="list-disc pl-5 space-y-3"><li>Wie werden Prüfzeichen erklärt und regelmässig erneuert?</li><li>Welche Angaben sind aktuell, und woran lässt sich das erkennen?</li><li>Wie funktionieren Korrektur, Löschung und Datenkontrolle im eingeloggten Bereich?</li><li>Wie vollständig sind Kosten vor einer verbindlichen Entscheidung erklärt?</li></ul></article></section>
    </> : <section className="night-section night-panel"><p className="night-kicker">Beleglage offen</p><h2>Keine Note ohne nachvollziehbare Grundlage.</h2><p className="night-muted">Für {name} liegt in dieser Überarbeitung keine ausreichend dokumentierte aktuelle Prüfung vor. Frühere Zahlen zu Reichweite, Inseraten, Marktstellung und Bewertungen werden deshalb hier nicht als Fakten ausgegeben.</p><p className="night-muted mt-4">Die bestehende Adresse bleibt als Quellenstand erreichbar. Der aktuelle Vergleich umfasst zehn separat benannte Websites und dokumentiert für jede, was gelesen werden konnte.</p><Actions><Link href="/reviews" className="night-button">Zum dokumentierten Vergleich</Link><Link href="/report" className="night-button-secondary">Hinweis zur Quelle melden</Link></Actions></section>}
    <section className="night-section"><MethodHelp /></section>
    <section className="night-section night-help"><h2>Aus einer Beobachtung wird kein Gütesiegel.</h2><p>Ein Vergleich erklärt Funktionen und Informationslücken. Er ersetzt keine individuelle Prüfung und bewertet keine reale Person.</p><Actions><Link href="/pricing" className="night-button-secondary">Preisangaben einordnen</Link><Link href="/safety" className="night-button-secondary">Prüfliste öffnen</Link></Actions></section>
  </Page>;
}

const PRICE_FIELDS = [
  { id: "amount", title: "Der Betrag ist genannt.", text: "Ich kenne Währung und konkreten Betrag, nicht nur eine unklare «ab»-Angabe." },
  { id: "scope", title: "Der Umfang ist klar.", text: "Ich erkenne, worauf sich die Angabe bezieht und was enthalten ist." },
  { id: "duration", title: "Die Dauer ist verständlich.", text: "Die Zeitbasis oder Laufzeit ist ausdrücklich beschrieben." },
  { id: "extras", title: "Zusatzkosten sind geklärt.", text: "Ich weiss, ob weitere Kosten anfallen oder ausdrücklich keine vorgesehen sind." },
] as const;

const SAFETY_FIELDS = [
  { id: "source", title: "Die Herkunft ist nachvollziehbar.", text: "Ich erkenne, wer eine Angabe veröffentlicht hat und welche Informationen offen sind." },
  { id: "claims", title: "Ich verstehe vorhandene Prüfzeichen.", text: "Identität, Bildzuordnung und Aktualität sind unterschiedliche Aussagen." },
  { id: "privacy", title: "Ich teile nur, was nötig ist.", text: "Ich prüfe, welche persönlichen Daten verlangt werden und wofür." },
  { id: "boundaries", title: "Meine Grenzen bleiben meine Grenzen.", text: "Ein Nein oder eine Änderung muss jederzeit möglich bleiben." },
  { id: "report", title: "Ich kenne den Meldeweg.", text: "Wenn etwas falsch oder unpassend ist, weiss ich, wie ich es melden kann." },
] as const;

type CheckField = { id: string; title: string; text: string };
export function missingChecklistFields(fields: readonly CheckField[], selected: readonly string[]) {
  return fields.filter(field => !selected.includes(field.id));
}

function TouchChecklist({ kind }: { kind: "price" | "safety" }) {
  const fields = kind === "price" ? PRICE_FIELDS : SAFETY_FIELDS;
  const [selected, setSelected] = useState<string[]>([]);
  const missing = missingChecklistFields(fields, selected);
  function toggle(id: string) { setSelected(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id]); }
  return <div className="night-grid night-grid-2">
    <div className="space-y-3" role="group" aria-label={kind === "price" ? "Preisangaben prüfen" : "Persönliche Prüfliste"}>{fields.map(field => <button type="button" key={field.id} aria-pressed={selected.includes(field.id)} onClick={() => toggle(field.id)} className="night-panel w-full text-left flex gap-4 items-start" style={{ borderColor: selected.includes(field.id) ? "#ee3a86" : undefined }}>
      <span aria-hidden="true" className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full border border-current">{selected.includes(field.id) ? "✓" : "+"}</span><span><strong className="block">{field.title}</strong><span className="night-muted block mt-2">{field.text}</span></span>
    </button>)}</div>
    <div className="night-help"><p className="night-kicker">Dein Überblick</p><div role="status" aria-live="polite" aria-atomic="true"><h3>{selected.length} von {fields.length} {kind === "price" ? "Angaben geklärt" : "Punkten geprüft"}</h3>{missing.length ? <><p className="night-muted">{kind === "price" ? "Diese Fragen bleiben für dich offen:" : "Hier kannst du noch genauer hinsehen:"}</p><ul className="list-disc pl-5 space-y-2 mt-4">{missing.map(field => <li key={field.id}>{field.title}</li>)}</ul></> : <p className="night-muted">{kind === "price" ? "Du hast alle vier Punkte für dich geklärt. Das bestätigt weder die Richtigkeit der Angaben noch ein Angebot." : "Du hast alle Punkte durchgesehen. Das ist eine Orientierung, keine Sicherheitsfreigabe."}</p>}</div><p className="night-muted mt-6">Deine Auswahl bleibt nur während dieser geöffneten Seite erhalten. Die Prüfliste verschickt nichts.</p><button type="button" onClick={() => setSelected([])} className="night-button-secondary mt-5" disabled={!selected.length}>Prüfliste zurücksetzen</button></div>
  </div>;
}

export function PricingInfoPage() {
  return <Page title="Preisangaben verstehen und vollständig prüfen" description="Betrag, Umfang, Dauer und Zusatzkosten verständlich einordnen. Eine freiwillige Prüfliste ohne erfundene Marktpreise." path="/pricing">
    <section className="night-section night-grid night-grid-2"><div><p className="night-kicker">Preis-Klarheit</p><h1 className="night-title">Eine Zahl ist<br />noch kein Überblick.</h1><p className="night-lead">Was ist enthalten? Für welche Dauer? Und kommen Kosten dazu? Vier klare Fragen helfen mehr als ein geschätzter Marktpreis.</p><Actions><a href="#preischeck" className="night-button">Angaben prüfen</a><Link href="/reviews" className="night-button-secondary">Quellen vergleichen</Link></Actions></div><Art file="guide-vergleichen.webp" alt="Illustration zur Einordnung verschiedener Preisangaben" caption="Illustrative Markenwelt · Keine Tariftabelle" /></section>
    <section className="night-section" id="preischeck"><p className="night-kicker">Vier Berührungen statt langer Texte</p><h2>Was ist bereits geklärt?</h2><p className="night-muted mb-6">Markiere nur, was aus der jeweiligen Quelle tatsächlich hervorgeht. Die Hilfe zeigt fehlende Angaben; sie ergänzt keine Preise.</p><TouchChecklist kind="price" /></section>
    <section className="night-section night-grid night-grid-3"><article className="night-panel"><h2>«Ab» braucht Kontext.</h2><p className="night-muted">Ein Einstiegspreis erklärt nicht automatisch den Gesamtbetrag. Prüfe die Voraussetzungen und den beschriebenen Umfang.</p></article><article className="night-panel"><h2>Gleiche Basis vergleichen.</h2><p className="night-muted">Unterschiedliche Dauer, Anfahrt oder enthaltene Leistungen können ähnliche Zahlen unvergleichbar machen.</p></article><article className="night-panel"><h2>Fehlend bleibt fehlend.</h2><p className="night-muted">Eine Assistenz kann eine Rückfrage vorbereiten. Einen nicht veröffentlichten Preis kann sie nicht bestätigen.</p></article></section>
    <section className="night-section night-grid night-grid-2"><div><p className="night-kicker">Nur ein Rechenbeispiel</p><h2>Der Gesamtbetrag<br />muss verständlich sein.</h2><p className="night-muted">Die Zahlen daneben sind frei gewählt und erklären ausschliesslich eine Addition. Sie sind weder Marktwerte noch ein echtes Angebot.</p></div><div className="night-panel"><dl className="space-y-4"><div className="flex justify-between gap-4"><dt>Fiktiver Grundbetrag</dt><dd>CHF 100</dd></div><div className="flex justify-between gap-4"><dt>Fiktiver Zuschlag</dt><dd>CHF 20</dd></div><div className="flex justify-between gap-4 border-t border-white/20 pt-4 font-bold"><dt>Rechnerische Summe</dt><dd>CHF 120</dd></div></dl><p className="night-muted mt-5">Kein Tarif, keine Preisschätzung, keine Buchung.</p></div></section>
    <section className="night-section night-help"><details><summary>Welche Rückfrage hilft bei unvollständigen Angaben?</summary><p className="mt-4">«Auf welche Dauer und welchen Umfang bezieht sich der genannte Betrag, und welche zusätzlichen Kosten können entstehen?»</p><p className="night-muted mt-3">Die Formulierung ist eine Orientierung. Es wird keine Nachricht erstellt oder versendet.</p></details></section>
  </Page>;
}

export function SafetyInfoPage() {
  return <Page title="Vertrauen verstehen und Angaben prüfen" description="Herkunft, Identität, Aktualität und Zustimmung auseinanderhalten. Eine freiwillige Prüfliste und klare Wege für Korrekturen und Meldungen." path="/safety">
    <section className="night-section night-grid night-grid-2"><div><p className="night-kicker">Vertrauen braucht Bedeutung</p><h1 className="night-title">Ein gutes Gefühl.<br />Klare Fragen dazu.</h1><p className="night-lead">Ein Profil, ein Bild und ein Prüfzeichen sagen nicht dasselbe. Nimm dir den Raum, Angaben einzuordnen und deine eigenen Grenzen zu setzen.</p><Actions><a href="#pruefliste" className="night-button">Meine Prüfliste öffnen</a><Link href="/report" className="night-button-secondary">Etwas melden</Link></Actions></div><Art file="guide-kontakt.webp" alt="Illustration zum bewussten Umgang mit persönlichen Angaben" caption="Illustrative Markenwelt · Kein Sicherheitsnachweis" /></section>
    <section className="night-section night-grid night-grid-2"><article className="night-panel"><h2>Wer ist die Person?</h2><p className="night-muted">Eine Identitätsprüfung betrifft einen bestimmten Nachweis und Zeitpunkt. Sie bestätigt nicht automatisch jede Profilangabe.</p></article><article className="night-panel"><h2>Wem gehört das Bild?</h2><p className="night-muted">Eine Bildzuordnung ist keine pauschale Freigabe für andere Verwendungen. Auch eine Illustration darf keine reale Person vortäuschen.</p></article><article className="night-panel"><h2>Wie aktuell ist die Angabe?</h2><p className="night-muted">Ein öffentliches Profil allein belegt weder Anwesenheit noch Erreichbarkeit oder aktuelle Verfügbarkeit.</p></article><article className="night-panel"><h2>Wozu wurde zugestimmt?</h2><p className="night-muted">Eine Zustimmung zu einem Profil ist keine allgemeine Zustimmung zu KI-Abbildern, Audio oder anderen Verwendungen.</p></article></section>
    <section className="night-section" id="pruefliste"><p className="night-kicker">Deine persönliche Orientierung</p><h2>Ruhig prüfen. Bewusst entscheiden.</h2><p className="night-muted mb-6">Fünf freiwillige Punkte. Du kannst deine Auswahl jederzeit ändern oder den Ablauf beenden.</p><TouchChecklist kind="safety" /></section>
    <section className="night-section night-grid night-grid-3"><article className="night-panel"><h2>Eine Angabe stimmt nicht?</h2><p className="night-muted">Nenne die betroffene Seite und den konkreten Fehler. Teile nur die Informationen, die zur Prüfung nötig sind.</p><Actions><Link href="/report" className="night-button-secondary">Fehler melden</Link></Actions></article><article className="night-panel"><h2>Dein Profil oder dein Bild?</h2><p className="night-muted">Nutze den Meldeweg für eine Korrektur oder einen Entfernungswunsch. Eine Meldung ist noch keine bestätigte Entfernung.</p><Actions><Link href="/report" className="night-button-secondary">Korrektur anfragen</Link></Actions></article><article className="night-panel"><h2>Was wird gespeichert?</h2><p className="night-muted">Lies die Angaben zu Zwecken, Empfängern und Möglichkeiten zur Kontrolle deiner Daten.</p><Actions><Link href="/privacy" className="night-button-secondary">Datenschutz ansehen</Link></Actions></article></section>
    <section className="night-section night-help"><h2>Hilfe mit klaren Grenzen.</h2><p>Die Auswahlhilfe erklärt Begriffe und macht offene Fragen sichtbar. Sie bestätigt keine Identität, verspricht keine Sicherheit und spricht nicht im Namen einer realen Person.</p></section>
  </Page>;
}

const DISCOVERY_STEPS = [
  { title: "Orientieren", art: "step-discover-v2.png", body: "Wähle einen Ort und eine Kategorie. Sichtbare Optionen bringen dich zur Übersicht, ohne dass du eine Suchanfrage formulieren musst.", detail: "Der Ort wird von dir ausgewählt. Für diesen Einstieg ist keine automatische Standortfreigabe nötig. Du kannst deine Auswahl ändern oder direkt stöbern.", href: "/search", action: "Zur Übersicht" },
  { title: "Einordnen", art: "step-compare-v2.png", body: "Prüfe Herkunft, Preisangaben und offene Fragen. Eine ähnliche Darstellung bedeutet noch keine identische oder geprüfte Information.", detail: "Achte darauf, aus welcher Quelle eine Angabe stammt. Fehlende Preise, unbestätigte Statusangaben und nicht geprüfte Aussagen bleiben als solche erkennbar.", href: "/reviews", action: "Vergleich verstehen" },
  { title: "Bewusst entscheiden", art: "step-decide-v2.png", body: "Behalte die Punkte im Blick, die dir wichtig sind. Du kannst zurückgehen, deine Auswahl ändern oder jederzeit aufhören.", detail: "Die freiwillige Prüfliste hilft beim Sortieren offener Fragen. Sie gibt keine Sicherheitsfreigabe und nimmt dir keine Entscheidung ab.", href: "/safety", action: "Prüfliste ansehen" },
] as const;

export function HowItWorksPage() {
  return <Page title="So funktioniert die geführte Suche" description="Mit sichtbarer Orts- und Kategorieauswahl starten, Informationen einordnen und selbst entscheiden. Die freiwillige Führung funktioniert per Touch." path="/how-it-works">
    <section className="night-section night-grid night-grid-2"><div><p className="night-kicker">Berühren statt formulieren</p><h1 className="night-title">Dein Einstieg passt<br />auf einen Bildschirm.</h1><p className="night-lead">Beginne mit einer sichtbaren Auswahl. Verfeinere in deinem Tempo. Und behalte bei jedem Schritt den Überblick.</p><Actions><Link href="/search" className="night-button">Orientierung starten</Link><a href="#drei-schritte" className="night-button-secondary">Die drei Schritte</a></Actions></div><Art file="city-zuerich.webp" alt="Illustrative Zürcher Stadtszene bei Abendlicht" caption="Eine Stadt als Einstieg · Kein Standortzugriff erforderlich" /></section>
    <section className="night-section" id="drei-schritte"><p className="night-kicker">Ein verständlicher Ablauf</p><h2>Drei Schritte. Jeder bleibt deine Wahl.</h2><div className="night-grid night-grid-3 mt-6">{DISCOVERY_STEPS.map((step, index) => <article className="night-panel" key={step.title}><img src={`${ART}${step.art}`} alt="" width={360} height={300} loading="lazy" className="w-full h-44 object-contain mb-4" /><p className="night-kicker">0{index + 1}</p><h3>{step.title}</h3><p className="night-muted">{step.body}</p><details className="mt-5"><summary>Schritt genauer erklärt</summary><p className="night-muted mt-3">{step.detail}</p></details><Actions><Link href={step.href} className="night-button-secondary">{step.action}</Link></Actions></article>)}</div></section>
    <section className="night-section night-grid night-grid-2"><Art file="category-tantra.webp" alt="Illustrative ruhige Raumgestaltung mit warmen Materialien" caption="Illustration · Kein realer Betrieb" /><div><p className="night-kicker">Hilfe, wenn sie hilft</p><h2>Eine klare nächste Auswahl.</h2><p className="night-lead">Die freiwillige Begleitung verlangt keinen Aufsatz.</p><p className="night-muted">Bei der Suche hilft sie bei sichtbaren Optionen. Beim Einordnen erklären die Hilfen Begriffe und Informationslücken. Die Antworten folgen den vorhandenen Auswahlmöglichkeiten; sie ersetzen keine Recherche oder individuelle Beratung.</p><p className="night-muted mt-4">Eine digitale Begleitung ist keine reale Anbieterin und macht keine Zusagen im Namen anderer.</p></div></section>
    <section className="night-section night-help"><h2>Du bestimmst das Tempo.</h2><div className="night-grid night-grid-3 mt-5"><div><h3>Zurückgehen</h3><p>Du kannst Optionen erneut wählen und die Suche anpassen.</p></div><div><h3>Direkt stöbern</h3><p>Die Übersicht bleibt neben der geführten Auswahl erreichbar.</p></div><div><h3>Aufhören</h3><p>Eine Auswahl verpflichtet dich zu nichts. Kein Countdown drängt dich weiter.</p></div></div></section>
    <section className="night-section space-y-4"><h2>Vor dem Start kurz erklärt.</h2><details className="night-panel"><summary>Muss ich meinen Standort freigeben?</summary><p className="night-muted mt-4">Nein. Für den geführten Einstieg kannst du einen Ort selbst auswählen.</p></details><details className="night-panel"><summary>Was passiert, wenn Informationen fehlen?</summary><p className="night-muted mt-4">Eine fehlende Angabe bleibt offen. Die Auswahlhilfe darf weder einen Preis noch einen Status oder einen Nachweis erfinden.</p></details><details className="night-panel"><summary>Wo kann ich Preisangaben prüfen?</summary><p className="night-muted mt-4">Die freiwillige Preis-Prüfliste ordnet Betrag, Umfang, Dauer und Zusatzkosten. Sie schätzt keine Marktpreise.</p><Actions><Link href="/pricing" className="night-button-secondary">Preis-Prüfliste öffnen</Link></Actions></details><details className="night-panel"><summary>Sind die Markenbilder echte Profile?</summary><p className="night-muted mt-4">Die illustrierten Städte, Räume und Markenmotive sind gestalterische Bilder. Sie bestätigen weder die Existenz einer Person noch einen Betrieb oder einen aktuellen Status.</p></details></section>
    <section className="night-section"><Actions><Link href="/search" className="night-button">Zur Übersicht</Link><Link href="/safety" className="night-button-secondary">Erst Vertrauen verstehen</Link></Actions></section>
  </Page>;
}

export function AdvertiseInfoPage() {
  const [kind, setKind] = useState<"individual" | "studio">("individual");
  return <Page title="Für Anbieterinnen und Studios" description="Informationen zum privaten Profilentwurf, zu eigenen Inhalten und zum Korrekturweg für bestehende Einträge. Keine automatische Veröffentlichung." path="/advertise">
    <section className="night-section night-grid night-grid-2"><div><p className="night-kicker">Für selbstständige Anbieterinnen & Studios</p><h1 className="night-title">Dein Auftritt.<br />Deine Angaben.</h1><p className="night-lead">Ein verständlicher Auftritt beginnt mit Inhalten, über die du verfügen darfst. Prüfe Texte, Bilder und Angaben in Ruhe, bevor etwas öffentlich werden soll.</p><Actions><Link href="/register" className="night-button">Zugang und Ablauf ansehen</Link><Link href="/report" className="night-button-secondary">Bestehenden Eintrag korrigieren</Link></Actions><p className="night-muted mt-5">Der Entwurfsbereich ist zugangsbeschränkt. Eine Anmeldung oder ein Entwurf veröffentlicht noch kein Profil.</p></div><Art file="anbieter.webp" alt="Illustratives Türmotiv mit rotem Anhänger im warmen Abendlicht" caption="Illustrative Markenwelt · Platz für Persönlichkeit" /></section>
    <section className="night-section night-grid night-grid-3"><article className="night-panel"><p className="night-kicker">01 / Deine Inhalte</p><h2>Nachvollziehbar beginnen.</h2><p className="night-muted">Verwende eigene oder für diesen Zweck freigegebene Bilder. Beschreibe nur, was du tatsächlich anbieten und belegen kannst.</p></article><article className="night-panel"><p className="night-kicker">02 / Dein Entwurf</p><h2>Erst gestalten, dann prüfen.</h2><p className="night-muted">Der private Entwurf dient zur Vorbereitung. Seine Speicherung ist keine öffentliche Freigabe und keine Bestätigung einer Identität.</p></article><article className="night-panel"><p className="night-kicker">03 / Deine Entscheidung</p><h2>Hilfe ohne Autopilot.</h2><p className="night-muted">Eine Formulierungshilfe kann Angaben ordnen. Sie darf keine Leistungen, Preise, Verfügbarkeit oder Nachweise ergänzen, die du nicht angegeben hast.</p></article></section>
    <section className="night-section night-grid night-grid-2"><div><p className="night-kicker">Was möchtest du vorbereiten?</p><h2>Persönlich oder<br />für ein Studio.</h2><p className="night-muted">Die Auswahl zeigt dir die passenden Prüfpunkte. Sie erstellt kein Konto und verschickt keine Daten.</p></div><div className="night-panel"><div className="flex flex-wrap gap-3" role="group" aria-label="Art des Auftritts"><button type="button" aria-pressed={kind === "individual"} onClick={() => setKind("individual")} className={kind === "individual" ? "night-button" : "night-button-secondary"}>Einzelprofil</button><button type="button" aria-pressed={kind === "studio"} onClick={() => setKind("studio")} className={kind === "studio" ? "night-button" : "night-button-secondary"}>Studio</button></div><div role="status" aria-live="polite" className="mt-6"><h3>{kind === "individual" ? "Für deinen eigenen Auftritt" : "Für einen gemeinsamen Ort"}</h3><ul className="list-disc pl-5 mt-4 space-y-2">{(kind === "individual" ? ["Anzeigename und passende Region", "Eigene Beschreibung und freigegebene Bilder", "Bewusst ausgewählte öffentliche Angaben"] : ["Studio-Beschreibung und Region", "Rechte an Bildern der Räume und beteiligten Personen", "Klare Zuständigkeit für Angaben und Korrekturen"]).map(item => <li key={item}>{item}</li>)}</ul></div><Actions><Link href="/register" className="night-button-secondary">Zugangsvoraussetzungen ansehen</Link></Actions></div></section>
    <section className="night-section night-help"><h2>Dein bestehender Eintrag braucht eine Korrektur?</h2><p>Du musst keinen neuen öffentlichen Auftritt vorbereiten, um auf falsche Angaben, unerlaubte Bilder oder einen Entfernungswunsch hinzuweisen.</p><Actions><Link href="/report" className="night-button">Zum Meldebereich</Link></Actions></section>
    <section className="night-section space-y-4"><h2>Vor dem ersten Entwurf.</h2><details className="night-panel" open><summary>Kann ich sofort selbst veröffentlichen?</summary><p className="night-muted mt-4">Der derzeitige Ablauf ist auf einen zugangsbeschränkten privaten Entwurf ausgerichtet. Er ist keine öffentliche Selbstveröffentlichung. Im Zugangsbereich werden die verfügbaren nächsten Schritte erklärt.</p></details><details className="night-panel"><summary>Welche Kosten fallen an?</summary><p className="night-muted mt-4">Hier wird kein kostenpflichtiges Paket angeboten oder abgeschlossen. Aus dieser Seite lässt sich kein Tarif für eine spätere Veröffentlichung ableiten.</p></details><details className="night-panel"><summary>Wird ein ausgefüllter Entwurf als verifiziert markiert?</summary><p className="night-muted mt-4">Nein. Eine ausgefüllte Angabe ist kein geprüfter Nachweis. Entwurf, Herkunft und bestätigte Prüfung sind unterschiedliche Zustände.</p></details></section>
  </Page>;
}

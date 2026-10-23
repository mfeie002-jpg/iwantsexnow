import type { GetServerSideProps } from "next";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { CatalogueHeader } from "@/components/catalogue/CatalogueHeader";
import { catalogueCities, catalogueCategories, parseCatalogueFilters, filterCatalogue,
  cityLabel, categoryLabel, catalogueHref, type CatalogueFilters } from "@/lib/marketplace/catalogue";

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.setHeader("Cache-Control", "private, no-store");
  return { props: { filters: parseCatalogueFilters(query) } };
};

export default function Catalogue({ filters }: { filters: CatalogueFilters }) {
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    // History restoration can keep unsent form edits from before the GET request.
    // Restore the defaults rendered for this URL so controls agree with results.
    const restore = () => form.current?.reset();
    window.addEventListener("pageshow", restore);
    return () => window.removeEventListener("pageshow", restore);
  }, []);
  const listings = filterCatalogue(filters);
  const resetHref = filters.view === "approved" ? "/search?view=approved" : "/search";
  const inputClass = "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-base text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-700";
  return <div className="min-h-screen bg-[#f7f5f1] pb-32 text-slate-950">
    <CatalogueHeader />
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-16">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Schweizer Inserate · Katalog-Vorschau · 18+</p>
      <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">Erotik Inserate nach Stadt und Kategorie entdecken</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">Teste den Katalog mit klar gekennzeichneten Beispielen. Hier sind noch keine realen Anbieter oder freigegebenen Inserate gelistet.</p>
      <aside aria-label="Demodaten-Hinweis" className="my-7 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950">
        <strong>Nur fiktive Demo-Inserate.</strong> Keine realen Personen, geprüften Profile oder Verfügbarkeiten. Private Anfragen, Registrierung und Veröffentlichung sind noch nicht aktiv.
      </aside>
      <form ref={form} key={catalogueHref(filters)} action="/search" method="get" aria-label="Katalog filtern" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm font-semibold">Stadt
            <select name="city" defaultValue={filters.city} className={inputClass}>
              <option value="">Alle Städte</option>{catalogueCities.map(city => <option key={city.id} value={city.id}>{city.label}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">Kategorie
            <select name="category" defaultValue={filters.category} className={inputClass}>
              <option value="">Alle Kategorien</option>{catalogueCategories.map(category => <option key={category.id} value={category.id}>{category.label}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">Suchbegriff
            <input name="q" type="search" maxLength={100} defaultValue={filters.q} placeholder="z. B. Zürich oder Begleitung" className={inputClass} />
          </label>
          <label className="text-sm font-semibold">Ansicht
            <select name="view" defaultValue={filters.view} className={inputClass}>
              <option value="demo">Demo-Inserate</option>
              <option value="approved">Ohne Demodaten (leer)</option>
            </select>
          </label>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-5">
          <button type="submit" className="rounded-lg bg-slate-950 px-6 py-3 font-semibold text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700">Filter anwenden</button>
          <Link href={resetHref} className="text-sm font-semibold underline underline-offset-4">Filter zurücksetzen</Link>
          <p className="text-xs text-slate-500">Filter lassen sich per Link teilen. Keine persönlichen Angaben eingeben.</p>
        </div>
      </form>
      <section aria-labelledby="results-heading" className="mt-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div><h2 id="results-heading" className="text-2xl font-bold">{filters.view === "demo" ? "Beispielinserate" : "Katalog ohne Demodaten"}</h2>
            <p role="status" className="mt-2 text-sm text-slate-600">{listings.length} {filters.view === "demo" ? (listings.length === 1 ? "Demo-Inserat" : "Demo-Inserate") : "freigegebene Inserate"}{filters.city ? " · " + cityLabel(filters.city) : ""}{filters.category ? " · " + categoryLabel(filters.category) : ""}</p>
          </div><span className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium">Vorschau · keine echten Anfragen</span>
        </div>
        {filters.invalid && <p role="alert" className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4">Der Filter-Link enthält ungültige oder mehrfache Werte. Bitte wähle gültige Filter und wende sie erneut an.</p>}
        {listings.length ? <ul aria-label="Katalogergebnisse" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map(item => <li key={item.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex h-28 items-center justify-center rounded-xl bg-[#eee9df]" aria-hidden="true"><span className="text-xs font-bold tracking-[0.25em] text-slate-500">DEMO · KEIN FOTO</span></div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-amber-800">Fiktives Demo-Inserat</p>
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className="mt-2 text-sm font-medium text-slate-600">{cityLabel(item.city)} · {categoryLabel(item.category)}</p>
            <p className="my-4 flex-1 text-sm leading-relaxed text-slate-600">{item.description}</p>
            <Link href={{ pathname: "/catalogue/" + item.id, query: { ...(filters.city ? { city: filters.city } : {}), ...(filters.category ? { category: filters.category } : {}), ...(filters.q ? { q: filters.q } : {}) } }} className="rounded-lg border border-slate-300 px-4 py-3 text-center text-sm font-semibold hover:bg-slate-50">Demo-Inserat ansehen<span className="sr-only">: {item.title}</span></Link>
          </li>)}
        </ul> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 md:p-12">
          <h3 className="text-xl font-bold">{filters.invalid ? "Keine Ergebnisse für diesen Filter-Link" : filters.view === "approved" ? "Noch keine freigegebenen Inserate" : "Keine passenden Demo-Inserate"}</h3>
          <p className="mt-3 max-w-xl leading-relaxed text-slate-600">{filters.view === "approved" ? "Diese Ansicht bleibt leer, bis echte Inserate separat geprüft und für den öffentlichen Katalog freigegeben wurden. Private Entwürfe erscheinen hier nie." : "Für diese Kombination gibt es in den Beispieldaten keinen Eintrag. Das ist keine Aussage über reale Anbieter in dieser Stadt."}</p>
          <Link href={resetHref} className="mt-5 inline-block font-semibold underline underline-offset-4">Filter zurücksetzen</Link>
          {filters.view === "approved" && <Link href="/search" className="ml-5 mt-5 inline-block font-semibold underline underline-offset-4">Demo-Katalog ansehen</Link>}
        </div>}
      </section>
      <footer className="mt-12 border-t border-slate-300 pt-6 text-sm leading-relaxed text-slate-600">Kategorien und Orte dienen dem Test des Katalogs. Keine echten Buchungen. <Link href="/verify" className="underline">Profilprüfung – noch nicht aktiv</Link> · <Link href="/imprint" className="underline">Betreiberangaben in Vorbereitung</Link></footer>
    </main>
  </div>;
}

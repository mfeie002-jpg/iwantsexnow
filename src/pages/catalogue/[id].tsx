import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { CatalogueHeader } from "@/components/catalogue/CatalogueHeader";
import { demoListings, cityLabel, categoryLabel, catalogueHref, parseCatalogueFilters, type DemoListing } from "@/lib/marketplace/catalogue";

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: demoListings.map(item => ({ params: { id: item.id } })), fallback: false,
});
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const listing = demoListings.find(item => item.id === params?.id);
  return listing ? { props: { listing } } : { notFound: true };
};
export default function DemoListingDetail({ listing }: { listing: DemoListing }) {
  const router = useRouter();
  const filters = parseCatalogueFilters(router.isReady ? router.query : {});
  const back = filters.invalid ? "/search" : catalogueHref(filters);
  return <div className="min-h-screen bg-[#f7f5f1] pb-32 text-slate-950">
    <CatalogueHeader />
    <main className="mx-auto max-w-3xl px-5 py-10 md:py-16">
      <Link href={back} className="text-sm font-semibold underline underline-offset-4">Zurück zum Katalog</Link>
      <article className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-800">Fiktives Demo-Inserat · keine reale Person</p>
        <h1 className="mt-4 text-4xl font-bold">{listing.title}</h1>
        <p className="mt-4 text-lg text-slate-600">{cityLabel(listing.city)} · {categoryLabel(listing.category)}</p>
        <div className="my-7 flex h-48 items-center justify-center rounded-xl bg-[#eee9df]" aria-hidden="true"><span className="text-sm font-bold tracking-widest text-slate-500">DEMO · KEIN FOTO</span></div>
        <h2 className="text-xl font-bold">Über dieses Beispiel</h2>
        <p className="mt-3 leading-relaxed text-slate-600">{listing.description}</p>
        <p className="mt-3 leading-relaxed text-slate-600">Dieses Beispiel dient ausschliesslich dem Test von Katalog, Filtern und Detailansicht. Es gibt keine Kontaktperson, Preise, Bewertungen oder buchbare Verfügbarkeit.</p>
        <aside className="mt-7 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950">
          <strong>Private Anfrage – noch nicht aktiv.</strong> Es werden keine Nachrichten oder Buchungen versendet. Auch Registrierung und Veröffentlichung bleiben gesperrt.
        </aside>
        <button disabled className="mt-5 w-full cursor-not-allowed rounded-lg bg-slate-200 px-5 py-3 font-semibold text-slate-600">Anfragen noch nicht möglich</button>
        <p className="mt-5 text-sm"><Link href="/safety" className="underline">Sicherheit und Vorschau-Status</Link></p>
      </article>
    </main>
  </div>;
}

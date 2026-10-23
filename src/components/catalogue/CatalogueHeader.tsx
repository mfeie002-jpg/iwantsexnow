import Link from "next/link";
export function CatalogueHeader() {
  return <header className="border-b border-slate-200 bg-white">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5">
      <Link href="/" className="text-xl font-bold tracking-tight text-slate-950">iWant<span className="text-amber-700">Sex</span>Now.ch</Link>
      <nav aria-label="Katalog-Navigation" className="flex flex-wrap gap-5 text-sm font-semibold">
        <Link href="/search" className="hover:underline">Inserate-Katalog</Link>
        <Link href="/safety" className="hover:underline">Sicherheit</Link>
        <Link href="/about" className="hover:underline">Über die Vorschau</Link>
      </nav>
    </div>
  </header>;
}

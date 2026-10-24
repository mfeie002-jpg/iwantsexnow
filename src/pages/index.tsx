import Link from "next/link";

const information = [
  { number: "01", title: "Fragen & Antworten", text: "Was ist bereits verfügbar? Was wird vorbereitet? Hier findest du Antworten zum aktuellen Stand.", href: "/faq", label: "Häufige Fragen lesen" },
  { number: "02", title: "Persönliche Daten", text: "Lies nach, welche Datenschutzinformationen vorliegen und welche Angaben noch ergänzt werden müssen.", href: "/privacy", label: "Datenschutzinformationen ansehen" },
  { number: "03", title: "Kontakt & Verantwortung", text: "Informiere dich über den Kontaktstatus und die noch ausstehenden Betreiberangaben.", href: "/contact", label: "Kontaktstatus ansehen" },
] as const;
const overview = [
  { href: "/privacy", label: "Datenschutzinformationen" },
  { href: "/terms", label: "Nutzungsbedingungen" },
  { href: "/imprint", label: "Betreiberangaben" },
] as const;

export default function Home() {
  return <div id="top" className="min-h-screen bg-[#f7f5f1] text-slate-950">
    <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:p-4">Zum Inhalt</a>
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-5 py-5">
      <Link href="/" aria-label="iWantSexNow.ch Startseite" className="text-xl font-bold tracking-tight">iWant<span className="text-amber-800">Sex</span>Now.ch</Link>
      <nav aria-label="Hauptnavigation" className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold">
        <a href="#orientierung" className="hover:underline">Orientierung</a><Link href="/privacy" className="hover:underline">Datenschutz</Link><Link href="/faq" className="hover:underline">Häufige Fragen</Link><Link href="/contact" className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-50">Kontaktstatus</Link>
      </nav>
    </div></header>
    <main id="main">
      <section className="relative overflow-hidden bg-[#111d27] px-5 py-20 text-white md:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-10 h-[32rem] w-[32rem] rounded-full border-[60px] border-[#d7b484]/10" />
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d7b484]">Informationen · Schweiz · 18+</p>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-7xl">Mehr Klarheit.<br />Für deine<br /><span className="text-[#d7b484]">Entscheidungen.</span></h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-slate-300">Ein klarer Einstieg: Antworten auf häufige Fragen, Hinweise zum Umgang mit persönlichen Daten und transparente Informationen zum aktuellen Stand.</p>
            <div className="mt-8 flex flex-wrap items-center gap-5"><a href="#orientierung" className="rounded-lg bg-[#d7b484] px-7 py-4 font-bold text-slate-950 hover:bg-amber-100">Informationen ansehen <span aria-hidden="true">→</span></a><Link href="/faq" className="font-semibold text-white underline underline-offset-4">Zu den Antworten</Link></div>
          </div>
          <aside aria-labelledby="overview-heading" className="self-center rounded-2xl border border-white/15 bg-white/5 p-7 md:p-9">
            <p className="text-xs font-bold uppercase tracking-widest text-[#d7b484]">Auf einen Blick</p><h2 id="overview-heading" className="mt-4 text-3xl font-bold">Ein guter Anfang:<br />Klarheit.</h2><p className="mt-4 leading-relaxed text-slate-300">Die wichtigsten Informationen direkt erreichen.</p>
            <ul className="mt-7 space-y-3">{overview.map(item=><li key={item.href}><Link href={item.href} className="flex items-center justify-between gap-3 rounded-lg border border-white/20 px-4 py-4 font-semibold hover:bg-white/10"><span>{item.label}</span><span aria-hidden="true">↗</span></Link></li>)}</ul>
          </aside>
        </div>
      </section>
      <section id="orientierung" aria-labelledby="information-heading" className="mx-auto max-w-6xl scroll-mt-8 px-5 py-16 md:py-20">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-800">Gut zu wissen</p><h2 id="information-heading" className="mt-3 max-w-2xl text-3xl font-bold md:text-4xl">Die Informationen, die jetzt zählen.</h2>
        <div className="mt-9 grid gap-5 md:grid-cols-3">{information.map(item=><article key={item.href} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 md:p-8"><p aria-hidden="true" className="text-sm font-semibold text-amber-800">{item.number}</p><h3 className="mt-8 text-2xl font-bold">{item.title}</h3><p className="mb-7 mt-4 flex-1 leading-relaxed text-slate-600">{item.text}</p><Link href={item.href} className="font-semibold underline decoration-slate-300 underline-offset-4 hover:decoration-slate-950">{item.label} <span aria-hidden="true">↗</span></Link></article>)}</div>
      </section>
      <section aria-labelledby="approach-heading" className="border-y border-slate-200 bg-white px-5 py-16 md:py-20"><div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
        <div><p className="text-xs font-bold uppercase tracking-widest text-amber-800">In deinem Tempo</p><h2 id="approach-heading" className="mt-4 text-4xl font-bold">Erst informieren.<br />Dann einordnen.</h2></div>
        <ol className="space-y-7 text-slate-600"><li><span className="mb-2 block text-lg font-bold text-slate-950">01 · Antworten finden</span>Die häufigen Fragen erklären, welche Funktionen aktuell zur Verfügung stehen.</li><li><span className="mb-2 block text-lg font-bold text-slate-950">02 · Hinweise lesen</span>Datenschutz- und Sicherheitshinweise geben dir Orientierung zum Umgang mit persönlichen Angaben.</li><li><span className="mb-2 block text-lg font-bold text-slate-950">03 · Den Stand prüfen</span>Kontaktstatus und Betreiberangaben benennen, welche Informationen noch ausstehen.</li></ol>
      </div></section>
      <section aria-labelledby="status-heading" className="mx-auto max-w-6xl px-5 py-16"><div className="rounded-2xl border border-[#d7b484]/40 bg-[#eae4d9] p-7 md:p-10">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-900">Aktueller Funktionsstatus</p><h2 id="status-heading" className="mt-4 text-3xl font-bold">Informationen sind zugänglich.<br />Persönliche Funktionen bleiben geschlossen.</h2>
        <p className="mt-5 max-w-3xl leading-relaxed text-slate-700">Konten, Anfragen, Buchungen und Zahlungen sind noch nicht freigeschaltet. Hier werden keine persönlichen Angaben übermittelt. Es gibt keine veröffentlichten Profile oder Bewertungen.</p>
        <Link href="/faq" className="mt-6 inline-block rounded-lg bg-[#111d27] px-6 py-3 font-semibold text-white hover:bg-slate-800">Mehr zum aktuellen Stand</Link>
      </div></section>
    </main>
    <footer className="border-t border-slate-200 bg-white px-5 py-8"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 text-sm text-slate-600">
      <span className="font-bold text-slate-950">iWantSexNow.ch</span><nav aria-label="Weitere Informationen" className="flex flex-wrap gap-x-5 gap-y-3"><Link href="/safety" className="hover:underline">Sicherheit</Link><Link href="/contact" className="hover:underline">Kontaktstatus</Link><Link href="/imprint" className="hover:underline">Impressum</Link><Link href="/privacy" className="hover:underline">Datenschutz</Link><Link href="/terms" className="hover:underline">Nutzungsbedingungen</Link></nav><a href="#top" className="font-semibold hover:underline">Nach oben <span aria-hidden="true">↑</span></a>
    </div></footer>
  </div>;
}

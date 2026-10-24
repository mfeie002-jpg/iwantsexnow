import Link from "next/link";

const information = [
  { title: "Fragen", text: "Antworten zum aktuellen Stand", href: "/faq" },
  { title: "Datenschutz", text: "Hinweise zu persönlichen Daten", href: "/privacy" },
  { title: "Kontaktstatus", text: "Kontakt und Betreiberangaben", href: "/contact" },
] as const;
const overview = [
  { href: "/faq", label: "Fragen" },
  { href: "/privacy", label: "Datenschutz" },
  { href: "/safety", label: "Sicherheit" },
  { href: "/contact", label: "Kontakt" },
  { href: "/imprint", label: "Impressum" },
  { href: "/terms", label: "Bedingungen" },
] as const;
const topics = [
  { href: "/faq", label: "Häufige Fragen" },
  { href: "/privacy", label: "Datenschutz" },
  { href: "/safety", label: "Sicherheit" },
  { href: "/contact", label: "Kontaktstatus" },
  { href: "/imprint", label: "Betreiberangaben" },
  { href: "/terms", label: "Nutzungsbedingungen" },
  { href: "/faq", label: "Funktionsstatus" },
  { href: "/privacy", label: "Persönliche Daten" },
  { href: "/about", label: "Projektstand" },
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
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-10 h-[32rem] w-[32rem] rounded-full border-[60px] border-amber-200/5" />
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d7b484]">Informationen · Schweiz · 18+</p>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-7xl">Mehr Klarheit.<br />Für deine<br /><span className="text-[#d7b484]">Entscheidungen.</span></h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-slate-300">Ein klarer Einstieg: Antworten auf häufige Fragen, Hinweise zum Umgang mit persönlichen Daten und transparente Informationen zum aktuellen Stand.</p>
            <a href="#orientierung" className="mt-8 inline-block rounded-lg bg-[#d7b484] px-7 py-4 font-bold text-slate-950 hover:bg-amber-100">Informationen ansehen <span aria-hidden="true">→</span></a>
          </div>
          <aside aria-labelledby="overview-heading" className="self-center rounded-2xl border border-white/15 bg-white/5 p-7 md:p-9">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-200">Was möchtest du wissen?</p><h2 id="overview-heading" className="mt-4 text-3xl font-bold">Deine Fragen. Dein Überblick.</h2><p className="mt-4 leading-relaxed text-slate-300">Direkt zu den Informationen deiner Wahl.</p>
            <nav aria-label="Schnellzugriff" className="mt-7 grid grid-cols-2 gap-3">{overview.map(item=><Link key={item.href} href={item.href} className="rounded-lg border border-white/20 px-1 py-3 text-sm font-semibold min-[375px]:px-2 sm:px-4 sm:text-base hover:bg-white/10">{item.label} <span aria-hidden="true" className="hidden sm:inline">↗</span></Link>)}</nav><a href="#themen" className="mt-6 inline-block text-sm font-semibold text-amber-200 underline underline-offset-4">Alle Themen ansehen</a>
          </aside>
        </div>
      </section>
      <section id="orientierung" aria-labelledby="information-heading" className="mx-auto max-w-6xl scroll-mt-8 px-5 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-amber-800">Was möchtest du wissen?</p><h2 id="information-heading" className="mt-3 text-3xl font-bold">Einfach die passende Information wählen.</h2></div><a href="#themen" className="font-semibold underline underline-offset-4">Zu allen Themen <span aria-hidden="true">→</span></a></div>
        <ul aria-label="Informationsbereiche" className="mt-8 grid gap-5 md:grid-cols-3">{information.map((item,index)=><li key={item.href}><Link href={item.href} className="block h-full rounded-2xl border border-slate-200 bg-white p-8 hover:border-amber-700"><span aria-hidden="true" className="text-sm font-semibold text-amber-800">0{index+1}</span><h3 className="mt-8 text-3xl font-bold">{item.title}</h3><p className="mt-5 text-sm text-slate-600">{item.text} <span aria-hidden="true">↗</span></p></Link></li>)}</ul>
      </section>
      <section aria-labelledby="approach-heading" className="border-y border-slate-200 bg-white px-5 py-16"><div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
        <div><p className="text-xs font-bold uppercase tracking-widest text-amber-800">In deinem Tempo</p><h2 id="approach-heading" className="mt-4 text-4xl font-bold">Erst informieren.<br />Dann einordnen.</h2></div>
        <ol className="space-y-6 text-slate-600"><li><span className="mb-2 block text-lg font-bold text-slate-950">01 · Antworten finden</span>Die häufigen Fragen erklären, welche Funktionen aktuell zur Verfügung stehen.</li><li><span className="mb-2 block text-lg font-bold text-slate-950">02 · Hinweise lesen</span>Datenschutz- und Sicherheitshinweise geben dir Orientierung zum Umgang mit persönlichen Angaben.</li><li><span className="mb-2 block text-lg font-bold text-slate-950">03 · Den Stand prüfen</span>Kontaktstatus und Betreiberangaben benennen, welche Informationen noch ausstehen.</li></ol>
      </div></section>
      <section id="themen" aria-labelledby="topics-heading" className="mx-auto max-w-6xl scroll-mt-8 px-5 py-16"><h2 id="topics-heading" className="text-3xl font-bold">Entdecke die Themen im Überblick.</h2><nav aria-label="Alle Themen" className="mt-7 flex flex-wrap gap-3">{topics.map(item=><Link key={item.label} href={item.href} className="rounded-full border border-slate-300 bg-white px-5 py-3 font-medium hover:border-amber-700">{item.label}</Link>)}</nav></section>
      <section aria-labelledby="status-heading" className="mx-5 mb-16 max-w-6xl rounded-2xl bg-[#e9e2d6] p-8 md:p-12 xl:mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-900">Aktueller Funktionsstatus</p><h2 id="status-heading" className="mt-4 text-3xl font-bold">Persönliche Funktionen bleiben geschlossen.</h2>
        <p className="mt-4 max-w-xl leading-relaxed text-slate-700">Konten, Anfragen, Buchungen und Zahlungen sind noch nicht freigeschaltet. Hier werden keine persönlichen Angaben übermittelt. Es gibt keine veröffentlichten Profile oder Bewertungen.</p>
        <Link href="/faq" className="mt-6 inline-block rounded-lg bg-slate-950 px-6 py-3 font-semibold text-white">Mehr zum aktuellen Stand <span aria-hidden="true">→</span></Link>
      </section>
    </main>
    <footer className="border-t border-slate-200 px-5 py-8"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 text-sm text-slate-600">
      <span className="font-bold text-slate-950">iWantSexNow.ch</span><nav aria-label="Weitere Informationen" className="flex flex-wrap gap-x-5 gap-y-3"><Link href="/about" className="hover:underline">Über das Projekt</Link><Link href="/safety" className="hover:underline">Sicherheit</Link><Link href="/contact" className="hover:underline">Kontaktstatus</Link><Link href="/imprint" className="hover:underline">Impressum</Link><Link href="/privacy" className="hover:underline">Datenschutz</Link><Link href="/terms" className="hover:underline">Nutzungsbedingungen</Link></nav>
    </div></footer>
  </div>;
}

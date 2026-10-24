import Link from "next/link";
import { catalogueCategories } from "@/lib/marketplace/catalogue";

export function ServiceCategories() {
  return <section id="services" className="bg-black/20 py-16">
    <div className="container mx-auto px-4">
      <div className="mx-auto mb-8 max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">Kategorien im Demo-Katalog</h2>
        <p className="mt-4 text-gray-300">Filtere fiktive Beispiele nach Kategorie und Stadt. Keine buchbaren Leistungen und keine geprüften Anbieter.</p>
      </div>
      <ul className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
        {catalogueCategories.map(category => <li key={category.id}>
          <Link href={"/search?category=" + category.id} className="block rounded-xl border border-white/20 bg-white/5 p-7 text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">Demo-Kategorie</span>
            <h3 className="mt-4 text-2xl font-bold">{category.label}</h3>
            <p className="mt-5 text-sm text-gray-200">Beispielinserate ansehen →</p>
          </Link>
        </li>)}
      </ul>
    </div>
  </section>;
}

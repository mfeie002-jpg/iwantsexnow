import Link from "next/link";
export function CatalogueHeader() {
  return (
    <header className="site-header">
      <div className="site-header-bar">
        <Link href="/" className="wordmark">
          iwantsexnow<span>.ch</span>
        </Link>
        <nav className="site-nav" aria-label="Katalog-Navigation" style={{ display: "flex" }}>
          <Link href="/search">Suche</Link>
          <Link href="/safety">Sicherheit</Link>
          <Link href="/about">Über uns</Link>
        </nav>
      </div>
    </header>
  );
}

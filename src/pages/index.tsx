import {formatSwissCount} from '@/lib/format-swiss-count';
import React from 'react';
import Link from 'next/link';
import {ArrowDown, ArrowRight, ArrowUpRight, Heart, MapPin, Scale, Sparkles} from 'lucide-react';
import {SEO} from '@/components/SEO';
import {brandAsset,CATEGORIES,REGIONS,searchHref} from '@/lib/night-catalogue';
import {useCatalogue} from '@/components/night/CatalogueContext';
import {GuideButton,TouchSearch} from '@/components/night/NightShell';
import {ProfileGrid,RegionCards} from '@/components/night/DiscoveryPages';
import {getPaginatedCatalogueProps,type InitialPageData} from '@/lib/night-catalogue-pages-server';
import type {GetServerSideProps} from 'next';
export const getServerSideProps:GetServerSideProps=ctx=>getPaginatedCatalogueProps(ctx,{},4);
export default function Home({cataloguePage}:{cataloguePage?:InitialPageData}){
 const {visibleOffers,error,favorites,compareIds}=useCatalogue();
 return <main id="main" className="night-home-2027">
 <SEO title="Eine Suche für die ganze Schweiz. | iwantsexnow.ch" description="Entdecke Schweizer Profile, Regionen und Quellen. Ein klarer Überblick für deine persönliche Wahl." image="https://iwantsexnow.ch/images/brand/v2/hero-night-v2.png"/>
 <section className="night-hero">
  <img className="night-hero-art" src={brandAsset('hero-night-v2.png')} alt="Illustrative Abendstimmung in Zürich mit einer fiktiven Person im roten Abendkleid" loading="eager"/>
  <div className="night-hero-orbit" aria-hidden="true"/>
  <div className="night-container night-hero-content">
   <div className="night-hero-edition"><span className="night-kicker">Die Schweiz. Nach deinem Gefühl.</span><span className="night-edition-tag">SWISS AFTER HOURS</span></div>
   <h1>Dein Moment.<br/><em>Deine Wahl.</em></h1>
   <p className="night-lead">Escort, Massage, Clubs & Studios in der ganzen Schweiz. Du entscheidest, wo es beginnt.</p>
   <div className="night-hero-actions"><GuideButton>Meinen Moment finden</GuideButton><a href="#profile-entdecken" className="night-hero-browse">Direkt entdecken <ArrowDown size={17}/></a></div>
   <div className="night-hero-search"><span className="night-micro-label">Oder wähle direkt</span><TouchSearch/></div>
  </div>
  <div className="night-hero-caption"><MapPin size={14}/><span>Zürich · Blaue Stunde</span><span>Titelmotiv: KI-Illustration · kein Anbieterprofil</span></div>
 </section>
 <section className="night-container night-launch-section" aria-label="Dein Einstieg">
  <div className="night-launch-grid">
   <div className="night-launch-card night-launch-main"><span className="night-orb-icon" aria-hidden="true"><Sparkles size={25}/></span><div><p className="night-kicker">Weniger suchen. Mehr entdecken.</p><h2>Ein paar Berührungen.<br/>Dein eigener Weg.</h2><p>Region, Bereich, Rahmen. Alles lässt sich ändern.</p></div><GuideButton>Auswahl starten</GuideButton></div>
   <Link className="night-launch-card night-launch-small" href="/favorites"><Heart size={22}/><span className="night-launch-count">{favorites.length.toString().padStart(2,'0')}</span><div><h2>Deine Merkliste</h2><p>Behalten, was dich anspricht.</p></div><ArrowUpRight className="night-corner-arrow" size={22}/></Link>
   <Link className="night-launch-card night-launch-small" href="/compare-escorts"><Scale size={22}/><span className="night-launch-count">{compareIds.length}<small> / 3</small></span><div><h2>Auf einen Blick</h2><p>Deine Auswahl vergleichen.</p></div><ArrowUpRight className="night-corner-arrow" size={22}/></Link>
  </div>
  <nav className="night-city-shortcuts" aria-label="Direkt in eine Region"><span>Wo beginnt’s?</span>{REGIONS.slice(0,5).map(r=><Link key={r.canton} href={r.href}>{r.name}<ArrowUpRight size={13}/></Link>)}<a href="#regionen">Alle Regionen <ArrowDown size={13}/></a></nav>
 </section>
 <section className="night-container night-section" id="profile-entdecken">
  <div className="night-section-title"><div><p className="night-kicker"><span className="night-section-number">01 /</span> Entdecken</p><h2>Menschen. Möglichkeiten.</h2><p>{formatSwissCount(cataloguePage?.total ?? visibleOffers.length)} vorhandene Einträge. Quellen und Fotohinweise direkt am Profil.</p></div><Link className="night-section-link" href="/search">Alle Profile <ArrowUpRight size={18}/></Link></div>
  {error&&<p className="night-note" role="status">{error}</p>}<ProfileGrid offers={visibleOffers.slice(0,8)} limit={4}/>
  <div className="night-load-more"><Link className="night-button-secondary" href="/search">Deine Auswahl verfeinern <ArrowRight size={17}/></Link></div>
 </section>
 <section className="night-container night-section" id="regionen"><div className="night-section-title"><div><p className="night-kicker"><span className="night-section-number">02 /</span> Die Schweiz entdecken</p><h2>Andere Stadt. Neues Gefühl.</h2><p>Von der Limmat bis zum Lago. Dein nächster Einstieg.</p></div><Link className="night-section-link" href="/search">Alle Regionen <ArrowUpRight size={18}/></Link></div><RegionCards/></section>
 <section className="night-band"><div className="night-container night-section"><div className="night-section-title"><div><p className="night-kicker"><span className="night-section-number">03 /</span> Dein Bereich</p><h2>Was spricht dich an?</h2><p>Ein Bild als Einstieg. Du bestimmst den Rahmen.</p></div></div><div className="night-category-grid">{[...CATEGORIES.filter(c=>c.id!=='all'),{id:'clubs',label:'Clubs & Studios',image:'category-clubs.webp'}].map((c,i)=><Link className="night-category-card" key={c.id} href={c.id==='clubs'?'/clubs':searchHref({category:c.id})}><img src={brandAsset(c.image)} alt="" loading="lazy"/><b className="night-category-number" aria-hidden="true">0{i+1}</b><span>{c.label} <ArrowUpRight size={18}/></span></Link>)}</div><p className="night-note" style={{marginTop:12}}>Kategorie- und Regionalmotive sind Illustrationen.</p></div></section>
 <section className="night-container night-section"><div className="night-compare-banner"><img src={brandAsset('compare-night-v2.png')} alt="Illustratives Fernglas vor einer Schweizer Berglandschaft" loading="lazy"/><p className="night-kicker">Perspektive statt Versprechen</p><h2>Ein klarer Blick.<br/><em>Über die Portale hinweg.</em></h2><p>Zehn Portale, ihre Funktionen und die Quellen dazu. Damit du selbst entscheiden kannst.</p><div className="night-row">{['and6.com','6navi.ch','sex.ch','ladies.ch','+ 6 weitere'].map(n=><span className="night-pill" key={n}>{n}</span>)}</div><div><Link className="night-button-secondary" href="/reviews">Portale vergleichen <ArrowUpRight size={17}/></Link></div></div></section>
 <section className="night-container night-section"><div className="night-steps"><div><p className="night-kicker" style={{color:'#b71c50'}}>Dein Weg</p><h2>So einfach<br/>geht’s.</h2><Link className="night-text-button" style={{color:'#a41b49'}} href="/how-it-works">Mehr erfahren →</Link></div>{[
 ['step-discover-v2.png','Entdecken','Region und Bereich berühren. Deine Auswahl beginnt sofort.'],
 ['step-compare-v2.png','Vergleichen','Bis zu drei Profile mit Quellen und bekannten Angaben nebeneinander.'],
 ['step-decide-v2.png','Selbst entscheiden','Details prüfen und selbst zum angegebenen Kontakt oder zur Quelle wechseln.'],
 ].map(([img,title,body],i)=><div className="night-step" key={title}><img src={brandAsset(img)} alt="" loading="lazy"/><h3><b>{i+1}</b>{title}</h3><p>{body}</p></div>)}</div></section>
 <section className="night-container night-section"><div className="night-provider-banner"><img src={brandAsset('anbieter.webp')} alt="Illustratives Türmotiv mit rotem Anhänger" loading="lazy"/><div><p className="night-kicker">Für Anbieterinnen und Anbieter</p><h2>Dein Profil.<br/>Deine Entscheidung.</h2><p>Bereite deinen Auftritt vor und prüfe deine Angaben. Die Veröffentlichung setzt die nötigen Nachweise voraus.</p><Link className="night-button" href="/advertise">Deinen Auftritt vorbereiten <ArrowUpRight size={17}/></Link></div></div></section>
 </main>;
}

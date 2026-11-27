import {formatSwissCount} from '@/lib/format-swiss-count';
import React from 'react';
import Link from 'next/link';
import {ArrowRight, ArrowUpRight, BookOpen, FileSearch, Layers, MapPin, ShieldCheck, Sparkles, Scale, UserRound, Globe2, Heart} from 'lucide-react';
import {SEO} from '@/components/SEO';
import {brandAsset} from '@/lib/night-catalogue';
import {useCatalogue} from '@/components/night/CatalogueContext';
import {ProfileGrid,RegionCards} from '@/components/night/DiscoveryPages';
import {getPaginatedCatalogueProps,type InitialPageData} from '@/lib/night-catalogue-pages-server';
import type {GetServerSideProps} from 'next';
export const getServerSideProps:GetServerSideProps=ctx=>getPaginatedCatalogueProps(ctx,{},4);

const entryCards = [
 {href:'#profile-entdecken', title:'Einträge', text:'Angaben, Quellen und Fotohinweise.', icon:UserRound, art:'guide-suchen.webp'},
 {href:'#regionen', title:'Regionen', text:'Die Schweiz im Überblick.', icon:MapPin, art:'city-zuerich.webp'},
 {href:'/reviews', title:'Portalvergleich', text:'Funktionen und Quellen im Vergleich.', icon:Layers, art:'compare-night-v2.png'},
 {href:'/guides', title:'Gut zu wissen', text:'Ratgeber, Rechte und Hintergründe.', icon:BookOpen, art:'guide-vergleichen.webp'},
];

const knowledge = [
 {href:'/safety',title:'Sicherheit & Diskretion',icon:ShieldCheck},
 {href:'/guides',title:'Recht & Grundlagen',icon:Scale},
 {href:'/privacy',title:'Privatsphäre',icon:Heart},
];

export default function Home({cataloguePage}:{cataloguePage?:InitialPageData}){
 const {visibleOffers,error}=useCatalogue();
 return <main id="main" className="night-home-2027 night-reference-home">
 <SEO title="Dein Moment. Deine Wahl. | iwantsexnow.ch" description="Schweizer Informationen, Regionen und Quellen. Ein klarer Überblick für deine persönliche Orientierung." image="https://iwantsexnow.ch/images/brand/v2/hero-night-v2.png"/>
 <section className="night-hero" aria-labelledby="reference-home-title">
  <img className="night-hero-art" src={brandAsset('hero-night-v2.png')} alt="Illustrative Abendstimmung in Zürich mit einer fiktiven Person" loading="eager"/>
  <div className="night-hero-orbit" aria-hidden="true"/>
  <div className="night-container night-hero-content">
   <div className="night-hero-edition"><span className="night-kicker">Die Schweiz. Nach deinem Gefühl.</span><span className="night-edition-tag">Swiss After Hours</span></div>
   <h1 id="reference-home-title">Dein Moment.<br/><em>Deine Wahl.</em></h1>
   <p className="night-lead">Schweizer Informationen, Regionen und Quellen. Ein klarer Überblick, damit du selbst informiert entscheiden kannst.</p>
   <div className="reference-hero-principles"><span><ShieldCheck/> Privatsphäre</span><span><FileSearch/> Quellenhinweise</span><span><Layers/> Transparenter Vergleich</span></div>
   <div className="night-hero-actions"><Link href="/guides" className="night-button reference-primary">Wissen entdecken <ArrowRight size={18}/></Link><Link href="/how-it-works" className="night-button-secondary reference-outline">So funktioniert’s <ArrowRight size={16}/></Link></div>
  </div>
  <Link className="reference-xenia" href="/how-it-works"><span className="reference-xenia-mark" aria-hidden="true"><Sparkles size={25}/></span><span><strong>Hallo, ich bin Xenia <Sparkles size={14}/></strong><small>Deine digitale Orientierungshilfe. Erfahre, wie ich dich unterstütze.</small></span><ArrowUpRight size={17}/></Link>
  <div className="reference-art-credit">Titelmotiv: KI-Illustration · keine reale Anbieterperson</div>
 </section>
 <section className="night-container reference-entry-section" aria-label="Orientierung">
  <div className="reference-entry-grid">{entryCards.map(({href,title,text,icon:Icon,art})=><Link key={href} href={href} className="reference-entry-card"><img src={brandAsset(art)} alt="" loading="lazy"/><div><Icon size={24}/><h2>{title}</h2><p>{text}</p><ArrowRight size={17}/></div></Link>)}</div>
 </section>
 <section className="night-container night-section" id="profile-entdecken">
  <div className="night-section-title"><div><p className="night-kicker"><span className="night-section-number">01 /</span> Entdecken</p><h2>Menschen. Möglichkeiten.</h2><p>{formatSwissCount(cataloguePage?.total ?? visibleOffers.length)} vorhandene Einträge. Quellen und Fotohinweise direkt am Profil.</p></div><Link className="night-section-link" href="/search">Alle Profile <ArrowUpRight size={18}/></Link></div>
  {error&&<p className="night-note" role="status">{error}</p>}<ProfileGrid offers={visibleOffers.slice(0,8)} limit={4}/>
  <div className="night-load-more"><Link className="night-button-secondary" href="/search">Deine Auswahl verfeinern <ArrowRight size={17}/></Link></div>
 </section>
 <section className="night-container night-section" id="regionen"><div className="night-section-title"><div><p className="night-kicker"><span className="night-section-number">02 /</span> Die Schweiz entdecken</p><h2>Andere Stadt. Neues Gefühl.</h2><p>Von der Limmat bis zum Lago. Dein nächster Einstieg.</p></div><Link className="night-section-link" href="/search">Alle Regionen <ArrowUpRight size={18}/></Link></div><RegionCards/></section>

 <section className="night-container reference-editorial-grid" aria-label="Vergleich und Wissen">
  <article className="reference-portal-panel"><img src={brandAsset('compare-night-v2.png')} alt="Illustration zum Portalvergleich" loading="lazy"/><div><h2>Schweizer Portale im Vergleich</h2><p>Funktionen, Methodik und Quellen nachvollziehbar aufbereitet.</p><div className="night-row">{['and6.com','6navi.ch','sex.ch','ladies.ch','+ weitere'].map(n=><span className="night-pill" key={n}>{n}</span>)}</div><Link className="night-button" href="/reviews">Zum Portalvergleich <ArrowRight size={16}/></Link></div></article>
  <article className="reference-knowledge-panel"><div className="reference-editorial-heading"><BookOpen size={25}/><div><h2>Gut zu wissen</h2><p>Ratgeber und Orientierung zu wichtigen Fragen.</p></div></div><div className="reference-knowledge-links">{knowledge.map(({href,title,icon:Icon})=><Link href={href} key={href}><Icon size={26}/><strong>{title}</strong><ArrowRight size={15}/></Link>)}</div></article>
 </section>
 <section className="night-container reference-principles" aria-label="Unsere Grundsätze">
  {[{icon:ShieldCheck,title:'Diskret & selbstbestimmt',body:'Deine Daten und Entscheidungen.'},{icon:FileSearch,title:'Nachvollziehbare Angaben',body:'Unbekanntes bleibt unbekannt.'},{icon:Scale,title:'Transparent & fair',body:'Quellen und Methodik sichtbar.'},{icon:Globe2,title:'Schweizweit & lokal',body:'Schweizer Regionen im Überblick.'}].map(({icon:Icon,title,body})=><div key={title}><Icon size={28}/><span><strong>{title}</strong><small>{body}</small></span></div>)}
 </section>
 <section className="night-container reference-end-banner"><img src={brandAsset('footer.webp')} alt="" loading="lazy"/><div><h2>Dein Moment. <em>Deine Entscheidung.</em></h2><p>Informiert, selbstbestimmt und mit nachvollziehbaren Quellen.</p></div><Link className="night-button" href="/how-it-works">Mehr erfahren <ArrowRight size={17}/></Link></section>
 </main>;
}

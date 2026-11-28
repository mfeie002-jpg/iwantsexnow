import React from 'react';
import {formatSwissCount} from '@/lib/format-swiss-count';
import Link from 'next/link';
import type {GetServerSideProps} from 'next';
import {ArrowRight,ArrowUpRight} from 'lucide-react';
import {SEO} from '@/components/SEO';
import {brandAsset,CATEGORIES,REGIONS,searchHref} from '@/lib/night-catalogue';
import {useCatalogue} from '@/components/night/CatalogueContext';
import {CityTileArt,ProfileGrid} from '@/components/night/DiscoveryPages';
import {useQuickXenia} from '@/components/XeniaThumbBar';
import {XENIA_BUDGETS} from '@/lib/xenia-guide';
import {getHomeCatalogueProps,type CatalogueFactsProps,type InitialPageData} from '@/lib/night-catalogue-pages-server';


export const getServerSideProps:GetServerSideProps=ctx=>getHomeCatalogueProps(ctx);

const categories=[
 {title:'Escort & Begleitung',description:'Verzeichnis & Quellen',image:'category-escort.webp',href:searchHref({category:'female'})},
 {title:'Massage',description:'Angebote sachlich einordnen',image:'category-tantra.webp',href:'/massage'},
 {title:'Tantra',description:'Herkunft und Bedingungen',image:'category-tantra.webp',href:'/tantra'},
 {title:'Clubs & Studios',description:'Orte und Informationen',image:'category-clubs.webp',href:'/studios'},
 {title:'Domina & BDSM',description:'Beschreibung und Grenzen',image:'category-bdsm.webp',href:searchHref({category:'bdsm'})},
 {title:'High-Class',description:'Angaben statt Werbeversprechen',image:'category-vip.webp',href:'/high-class'}
];

export default function Home({cataloguePage,catalogueFacts}:{cataloguePage?:InitialPageData;catalogueFacts?:CatalogueFactsProps['catalogueFacts']}){
 const {choice,openStep}=useQuickXenia();
 const {visibleOffers,error}=useCatalogue();
 const count=cataloguePage?.total??visibleOffers.length;
 return <main id="main" className="flagship-home">
  <SEO title="Finde, was zu dir passt | iwantsexnow.ch" description="Entdecke Schweizer Regionen, Escort- und Massage-Angebote, Clubs und Studios. Xenia führt dich freiwillig mit wenigen Berührungen zu Quellen und Einträgen." image="https://iwantsexnow.ch/images/brand/v2/hero-night-v2.png"/>
  <section className="flagship-hero discovery-hero">
   <img className="flagship-hero-photo" src={brandAsset('hero-night-v2.png')} alt="Illustrative Schweizer Abendstadt mit einer fiktiven Person im Abendkleid" loading="eager"/>
   <div className="flagship-hero-shade" aria-hidden="true"/>
   <div className="night-container flagship-hero-inner">
    <p className="flagship-eyebrow">SCHWEIZER ESCORT-, MASSAGE- & STUDIO-VERZEICHNIS · 18+</p>
    <h1>Finde, was <em>zu dir<br className="flagship-desktop-break"/> passt.</em></h1>
    <p className="discovery-kicker">Mit Xenia filtern</p>
    <div className="flagship-hero-choices" role="group" aria-label="Mit Xenia filtern">
     {[
       ['Ort', REGIONS.find(r=>r.canton===choice.canton)?.name || 'Ganze Schweiz'],
       ['Kategorie', CATEGORIES.find(c=>c.id===choice.category)?.label || 'Alle Bereiche'],
       ['Budget', XENIA_BUDGETS.find(b=>b.id===choice.budget)?.label || 'Budget offen']
     ].map(([label,value],i)=><button type="button" key={label} onClick={()=>openStep(i)} aria-haspopup="dialog"><strong>{label}</strong><small>{value}</small></button>)}
    </div>
    <Link className="discovery-manual" href="/search">Zur normalen Suche <ArrowRight size={16}/></Link>
   </div>
  </section>

  <section className="night-container flagship-section">
   <div className="flagship-section-head"><div><h2>Profile entdecken</h2><p>{formatSwissCount(count)} Einträge{catalogueFacts?.standLabel && ` · Datenstand ${catalogueFacts.standLabel}`}</p></div><Link href="/search">Alle Einträge <ArrowRight size={17}/></Link></div>
   {error&&<p role="status" className="flagship-caption">{error}</p>}
   <ProfileGrid offers={visibleOffers.slice(0,4)} limit={4}/>
   <div className="flagship-centered"><Link className="flagship-primary" href="/suche">Ergebnisse filtern <ArrowRight size={16}/></Link></div>
  </section>

  <section className="night-container flagship-section" id="regionen"><div className="flagship-section-head"><div><span className="flagship-eyebrow">SCHWEIZ ENTDECKEN</span><h2>Beliebte Regionen in der Schweiz</h2><p>Einfach nach Ort einsteigen und lokale Angebote einordnen.</p></div><Link href="/regionen">Alle Orte entdecken <ArrowRight size={17}/></Link></div>
   <div className="flagship-region-tiles">{REGIONS.slice(0,5).map(region=>{const local=region.canton==='GE'||region.canton==='BE'?cataloguePage?.cityTiles?.[region.canton]:null;return <Link key={region.canton} href={region.href} className="flagship-region-tile"><CityTileArt canton={region.canton} image={region.image} localSrc={local}/><span>{region.name}</span><ArrowUpRight size={18}/></Link>;})}</div>
   <nav className="regional-links" aria-label="Regionale Verzeichnisse"><Link href="/zuerich/escort-gfe">Girlfriend Experience im Kanton Zürich</Link><Link href="/fr/geneve/escort" hrefLang="fr-CH" lang="fr-CH">Escortes à Genève</Link></nav>
   <p className="flagship-caption">Stadtmotive: KI-Illustrationen. Keine Personen- oder Verfügbarkeitsnachweise.</p>
  </section>

  <section className="flagship-soft-section"><div className="night-container flagship-section">
   <div className="flagship-section-head"><div><span className="flagship-eyebrow">THEMEN ENTDECKEN</span><h2>Welches Erlebnis passt heute?</h2><p>{formatSwissCount(categories.length)} mögliche Einstiege, mit nachvollziehbaren Angaben.</p></div><Link href="/kategorien">Alle Kategorien <ArrowRight size={17}/></Link></div>
   <div className="flagship-category-tiles">{categories.map(c=><Link key={c.title} href={c.href} className="flagship-category-tile"><img src={brandAsset(c.image)} alt="" loading="lazy"/><span><strong>{c.title}</strong><small>{c.description}</small></span></Link>)}</div>
  </div></section>



  <section className="flagship-soft-section"><div className="night-container flagship-section">
   <div className="flagship-section-head"><div><span className="flagship-eyebrow">DEIN WEG</span><h2>Entdecken. Vergleichen. Selbst entscheiden.</h2><p>Einfach orientieren, ohne die Verantwortung für deine Wahl abzugeben.</p></div></div>
   <div className="flagship-how-grid">{[
     ['guide-suchen.webp','01','Entdecken','Region und Bereich in wenigen Berührungen auswählen.'],
     ['guide-vergleichen.webp','02','Vergleichen','Quellen und bestätigte Angaben nebeneinander prüfen.'],
     ['guide-kontakt.webp','03','Selbst entscheiden','Details ansehen und eigenständig zur Originalquelle wechseln.']
   ].map(([img,n,title,text])=><div key={title} className="flagship-how-card"><img src={brandAsset(img)} alt="" loading="lazy"/><span>{n}</span><h3>{title}</h3><p>{text}</p></div>)}</div>
   <div className="flagship-centered"><Link className="flagship-outline" href="/ratgeber">Zum Ratgeber <ArrowRight size={16}/></Link></div>
  </div></section>

  <section className="night-container flagship-section">
   <div className="flagship-comparison"><img src={brandAsset('compare-night-v2.png')} alt="" loading="lazy"/><div><span className="flagship-eyebrow">QUELLEN · METHODIK</span><h2>Portale vergleichen.<br/><em>Ohne erfundene Rankings.</em></h2><p>Unterschiede bei Herkunft, Suchfunktionen und publizierten Informationen verstehen.</p><Link className="flagship-primary" href="/portalvergleich">Zum Portalvergleich <ArrowRight size={16}/></Link></div></div>
  </section>

  <section className="flagship-soft-section"><div className="night-container flagship-section"><div className="flagship-provider"><img src={brandAsset('anbieter.webp')} alt="" loading="lazy"/><div><span className="flagship-eyebrow">FÜR ANBIETERINNEN UND ANBIETER</span><h2>Dein Eintrag.<br/>Deine Kontrolle.</h2><p>Bereite Angaben vor und kläre Rechte oder Korrekturen. Veröffentlichung erfordert die nötigen Nachweise.</p><Link className="flagship-primary" href="/anbieter">Deinen Auftritt vorbereiten <ArrowRight size={16}/></Link></div></div></div></section>
 </main>;
}

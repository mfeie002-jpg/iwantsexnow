import React from 'react';
import Link from 'next/link';
import {ArrowRight,ArrowUpRight,BookOpen,CheckCircle2,Clock3,Heart,Info,MapPin,ShieldCheck,Sparkles} from 'lucide-react';
import {SEO} from '@/components/SEO';
import {REGIONS,CATEGORIES,brandAsset,searchHref} from '@/lib/night-catalogue';
import {useNightGuide} from '@/components/night/NightShell';

export type EditorialKind='regions'|'categories'|'high-class'|'guides'|'example';
type Tile = {title:string;body:string;href:string;image?:string;tag?:string};

const topicTiles:Tile[]=[
 {title:'Escort & Begleitung',body:'Einträge mit ausgewiesener Herkunft.',href:searchHref({category:'female'}),image:'category-escort.webp'},
 {title:'Massage & Tantra',body:'Beschreibungen und Quellen prüfen.',href:'/massage',image:'category-tantra.webp'},
 {title:'Clubs & Studios',body:'Standort und publizierte Angaben.',href:'/studios',image:'category-clubs.webp'},
 {title:'Domina & BDSM',body:'Grenzen und Angebotsart verstehen.',href:searchHref({category:'bdsm'}),image:'category-bdsm.webp'},
 {title:'Männliche Begleitung',body:'Verzeichnis und Quelle einordnen.',href:searchHref({category:'callboy'}),image:'category-vip.webp'},
 {title:'High-Class',body:'Qualität nicht aus einer Bezeichnung ableiten.',href:'/high-class',image:'category-vip.webp'}
];

const guideTiles:Tile[]=[
 {title:'Privatsphäre & Diskretion',body:'Welche Daten werden benötigt und welche nicht?',href:'/privacy',image:'guide-suchen.webp',tag:'Datenschutz'},
 {title:'Honorar richtig verstehen',body:'Dauer, Zusatzleistungen und bestätigte Beträge trennen.',href:'/preise',image:'category-tantra.webp',tag:'Preise'},
 {title:'Quellen und Portaltypen',body:'Vergleiche nur Kriterien, die sich nachprüfen lassen.',href:'/portalvergleich',image:'guide-vergleichen.webp',tag:'Vergleich'},
 {title:'Einträge korrigieren',body:'Melde falsche Angaben und nutze den vertraulichen Meldeweg.',href:'/melden',image:'guide-kontakt.webp',tag:'Deine Rechte'},
 {title:'Verfügbarkeit & Status',body:'Ein aktueller Suchwunsch ist keine bestätigte Freimeldung.',href:'/jetzt-frei',image:'hero-tram.webp',tag:'Transparenz'},
 {title:'Sicherheit und Kontrolle',body:'Prüfstatus und Quellen nachvollziehbar einordnen.',href:'/sicherheit',image:'category-clubs.webp',tag:'Vertrauen'}
];

function PageHero({eyebrow,title,description,image}:{eyebrow:string;title:string;description:string;image?:string}){
 return <section className="flagship-page-hero">{image&&<img src={brandAsset(image)} alt="" loading="eager"/>}<div className="night-container"><p className="flagship-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div></section>;
}
function SectionHeader({eyebrow,title,description}:{eyebrow?:string;title:string;description:string}){
 return <div className="flagship-section-head"><div>{eyebrow&&<span className="flagship-eyebrow">{eyebrow}</span>}<h2>{title}</h2><p>{description}</p></div></div>;
}
function Tiles({items}:{items:Tile[]}){
 return <div className="flagship-editorial-grid">{items.map(item=><Link key={item.title} href={item.href} className="flagship-editorial-tile">
  {item.image&&<img src={brandAsset(item.image)} alt="" loading="lazy"/>}
  {item.tag&&<span className="flagship-tile-tag">{item.tag}</span>}
  <div><h3>{item.title}</h3><p>{item.body}</p><span>Weiterlesen <ArrowUpRight size={15} aria-hidden="true"/></span></div>
 </Link>)}</div>;
}
export function XeniaContext({question}:{question:string}){
 const {openGuide}=useNightGuide();
 return <div className="flagship-xenia-context"><div className="flagship-xenia-emblem" aria-hidden="true"><Sparkles size={22}/></div><div><strong>Xenia · Deine Auswahlhilfe</strong><p>{question}</p></div><button className="flagship-chip" type="button" onClick={()=>openGuide(0)}>Region und Bereich wählen <ArrowRight size={15} aria-hidden="true"/></button></div>;
}

export default function FlagshipEditorial({kind}:{kind:EditorialKind}){
 const {openGuide}=useNightGuide();
 if(kind==='regions')return <main id="main" className="flagship-editorial-page">
  <SEO title="Schweizer Regionen entdecken | iwantsexnow.ch" description="Entdecke Orte und Regionen im Schweizer Verzeichnis. Quellen und lokale Angaben transparent einordnen."/>
  <PageHero eyebrow="SCHWEIZ · REGIONEN" title="Die ganze Schweiz entdecken." description="Wähle zuerst den Ort. Danach deinen Bereich. Ohne voreilige Verfügbarkeits- oder Qualitätsversprechen." image="hero-tram.webp"/>
  <div className="night-container flagship-editorial-content"><XeniaContext question="Wo möchtest du dich umsehen?"/><section><SectionHeader eyebrow="REGIONALER ÜBERBLICK" title="Beliebte Schweizer Regionen" description="Ortsbilder sind illustrative Motive; Einträge und Quellen findest du auf der jeweiligen Regionalseite."/>
  <div className="flagship-region-tiles">{REGIONS.map(region=><Link key={region.canton} href={region.href} className="flagship-region-tile"><img src={brandAsset(region.image)} alt="" loading="lazy"/><span>{region.name}</span><ArrowUpRight size={18}/></Link>)}</div>
  </section><section className="flagship-guide-note"><MapPin size={24}/><div><h2>Schweizweit statt nur Zürich.</h2><p>Du kannst den Kanton im Filter ändern. Standortfreigabe ist nicht nötig.</p></div><button type="button" onClick={()=>openGuide(0)}>Mit Xenia starten <ArrowRight size={16}/></button></section></div>
 </main>;
 if(kind==='categories')return <main id="main" className="flagship-editorial-page">
  <SEO title="Kategorien und Erlebniswelten | iwantsexnow.ch" description="Massage, Tantra, Begleitung, Clubs und Studios. Wähle einen Bereich und prüfe die jeweiligen Quellen."/>
  <PageHero eyebrow="ANGEBOTE · BEREICHE" title="Welches Erlebnis passt heute?" description="Wähle die Art des Angebots. Die Ergebnisse zeigen nur, was der jeweilige Originaleintrag tatsächlich belegt." image="category-vip.webp"/>
  <div className="night-container flagship-editorial-content"><XeniaContext question="Was spricht dich an? Xenia hilft dir ohne Tippen."/><section><SectionHeader eyebrow="ENTDECKEN" title="Bereiche und Themen" description="Sechs Einstiege. Ein transparentes Schweizer Verzeichnis."/><Tiles items={topicTiles}/></section></div>
 </main>;
 if(kind==='high-class')return <main id="main" className="flagship-editorial-page">
  <SEO title="High-Class: Qualität richtig einordnen | iwantsexnow.ch" description="Premium-Begriffe, Honorar und Quellen differenziert beurteilen, ohne ungeprüfte Rankings."/>
  <PageHero eyebrow="HIGH-CLASS · EINORDNUNG" title="High-Class: Qualität ist kein Etikett." description="Eine Bezeichnung allein beweist weder Preis noch Identität oder Qualität. Wir helfen dir, Angaben differenziert zu prüfen." image="category-vip.webp"/>
  <div className="night-container flagship-editorial-content"><XeniaContext question="Was ist dir bei einem Angebot wichtig?"/><section><SectionHeader eyebrow="KRITERIEN" title="Worauf du achten kannst" description="Keine erfundenen Gütesiegel. Stattdessen konkrete Fragen an jeden Eintrag."/>
  <div className="flagship-fact-grid">
   <div><ShieldCheck/><h3>Quelle statt Werbeversprechen</h3><p>Prüfe, ob eine direkte Originalquelle vorhanden ist und welche Informationen daraus stammen.</p></div>
   <div><Info/><h3>Preis und Leistung trennen</h3><p>Honorar, Dauer und Zusatzbedingungen sind nur mit bestätigter Quelle vergleichbar.</p></div>
   <div><Heart/><h3>Qualität selbst beurteilen</h3><p>Ein Begriff wie VIP, Elite oder Premium ersetzt keine nachvollziehbare Verifizierung.</p></div>
  </div></section><section className="flagship-guide-note"><Sparkles size={24}/><div><h2>Deine persönliche Auswahl.</h2><p>Starte mit Region und Bereich und lies die Quellendetails bei passenden Einträgen.</p></div><Link href="/suche">Profile entdecken <ArrowRight size={16}/></Link></section></div>
 </main>;
 if(kind==='guides')return <main id="main" className="flagship-editorial-page">
  <SEO title="Ratgeber: gut informiert und selbstbestimmt | iwantsexnow.ch" description="Verständliche Einordnung von Preisen, Verfügbarkeit, Quellen, Privatsphäre und Eintragsrechten."/>
  <PageHero eyebrow="RATGEBER · WISSEN" title="Gut informiert. Selbstbestimmt." description="Kompaktes Wissen zu Profilen, Preisen, Quellen, Datenschutz und deinen Rechten. Ohne unbelegte Versprechen." image="guide-suchen.webp"/>
  <div className="night-container flagship-editorial-content"><XeniaContext question="Du hast eine konkrete Frage? Wähle zuerst den Themenbereich."/><section><SectionHeader eyebrow="ORIENTIERUNG" title="Was möchtest du verstehen?" description="Sechs häufige Fragen, direkt mit den passenden Bereichen verbunden."/><Tiles items={guideTiles}/></section>
  <section className="flagship-guide-note"><BookOpen size={24}/><div><h2>Du bestimmst den nächsten Schritt.</h2><p>Eine Suchanfrage ist keine Buchung. Gezeigte Profile ersetzen keine Bestätigung durch die Quelle.</p></div><Link href="/sicherheit">Sicherheitsinformationen <ArrowRight size={16}/></Link></section></div>
 </main>;
 return <main id="main" className="flagship-editorial-page">
  <SEO title="Profilangaben verstehen | iwantsexnow.ch" description="Ein erklärendes Beispiel der Profilansicht. Verifizierungsstatus, Quellen und Verfügbarkeit richtig interpretieren." noindex/>
  <PageHero eyebrow="PROFIL · ERKLÄRUNG" title="Ein Profil. Alle belegten Informationen." description="Dies ist eine Erklärung der Anzeigeelemente, kein erfundenes Anbieterprofil und keine bestätigte Verfügbarkeit."/>
  <div className="night-container flagship-editorial-content"><XeniaContext question="Woran erkennst du, welche Profilangaben überprüfbar sind?"/>
  <section className="flagship-profile-explainer"><div className="flagship-profile-placeholder"><Info size={42}/><strong>Originalfoto nicht verfügbar</strong><span>Kein erfundenes Bild einer echten Person</span></div><div><span className="flagship-eyebrow">BEISPIEL · KEIN ECHTER EINTRAG</span><h2>Transparenz vor Kontakt.</h2><p>Ein echtes Profil zeigt Name und Ort nur soweit diese in der Quelle vorliegen. Preise, Verfügbarkeit und Identität dürfen nicht aus allgemeinen Formulierungen abgeleitet werden.</p><dl><div><dt>Quelle</dt><dd>Bei echtem Eintrag verlinkt</dd></div><div><dt>Honorar</dt><dd>Nicht angegeben, solange unbestätigt</dd></div><div><dt>Verfügbarkeit</dt><dd>Unbekannt ohne gültige Bestätigung</dd></div><div><dt>Verifizierung</dt><dd>Kein Nachweis ohne Prüfprozess</dd></div></dl><Link href="/suche" className="night-button">Echte Verzeichniseinträge <ArrowRight size={17}/></Link></div></section>
  </div>
 </main>;
}

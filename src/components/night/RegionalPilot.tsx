import Link from 'next/link';
import { SEO } from '@/components/SEO';
import { ProfileImage } from './ProfileImage';
import { getProfileCity, getProfileId, getProfileName, searchHref, type Offer, type ProfileState } from '@/lib/night-catalogue';

const texts = {
  zh: {
    lang:'de-CH', title:'Girlfriend Experience im Kanton Zürich', kicker:'Region Zürich',
    description:'Einträge, deren Quellen Girlfriend Experience im Kanton Zürich nennen. Der angegebene Ort kann auch ausserhalb der Stadt Zürich liegen.',
    canonical:'/kategorie/zuerich/girlfriend-experience', heading:'Einträge aus dem Verzeichnis', source:'Quelle',
    sourceMissing:'Quelle offen', fallback:'Eintrag', unknownCity:'Ort offen', count:'Einträge im aktuellen Verzeichnis',
    empty:'Aktuell sind keine passenden Einträge erfasst.', more:'Alle Suchergebnisse öffnen', home:'Zur Startseite',
    filters:{canton:'ZH',service:'gfe'}
  },
  ge: {
    lang:'fr-CH', title:'Escortes et accompagnement dans le canton de Genève', kicker:'Région de Genève',
    description:'Consultez les annonces répertoriées dans le canton. La localité et la source sont indiquées pour chaque annonce. La disponibilité se vérifie auprès de la personne concernée.',
    canonical:'/fr/geneve/escort', heading:'Annonces du répertoire', source:'Source',
    sourceMissing:'Source non indiquée', fallback:'Annonce', unknownCity:'Localité non indiquée', count:'annonces dans le répertoire',
    empty:'Aucune annonce ne correspond actuellement à cette sélection.', more:'Voir tous les résultats (allemand)', home:"Retour à l’accueil (allemand)",
    filters:{canton:'GE',category:'female'}
  }
} as const;

export type RegionalPilotId = keyof typeof texts;
export const regionalPilotFilters = (id:RegionalPilotId) => texts[id].filters;

type Props = { pilot:RegionalPilotId; catalogue:{offers:Offer[];states:Record<string,ProfileState>}; cataloguePage:{total:number} };

export function RegionalPilot({pilot,catalogue,cataloguePage}:Props) {
  const t=texts[pilot];
  return <main id="main" className="regional-pilot" lang={t.lang}>
    <SEO title={t.title+' | iwantsexnow.ch'} description={t.description} locale={t.lang} url={'https://iwantsexnow.ch'+t.canonical}/>
    <section className="night-container">
      <Link href="/" className="regional-back">{t.home}</Link>
      <header><p className="discovery-kicker">{t.kicker}</p><h1>{t.title}</h1><p>{t.description}</p></header>
      <h2>{t.heading}</h2><p>{cataloguePage.total.toLocaleString(t.lang)} {t.count}</p>
      <div className="regional-grid">{catalogue.offers.map(offer=>{
        const id=getProfileId(offer), state=catalogue.states[id]||{};
        const name=state.displayName||offer.displayName||offer.rawName?getProfileName(offer,state):t.fallback;
        const city=state.city||offer.city?getProfileCity(offer,state):t.unknownCity;
        return <Link key={id} className="regional-card" href={'/profile/'+encodeURIComponent(id)}>
          <ProfileImage profileId={id} name={name} alt="" compact/>
          <span><strong>{name}</strong><small>{city} · {offer.sourcePortal ? t.source+' · '+offer.sourcePortal : t.sourceMissing}</small></span>
        </Link>;
      })}</div>
      {!cataloguePage.total&&<p>{t.empty}</p>}
      <Link href={searchHref(t.filters)} className="regional-more">{t.more} →</Link>
    </section>
  </main>;
}

import {DiscoveryPage} from '@/components/night/DiscoveryPages';
export {getServerSideProps} from '@/lib/night-catalogue-server';
export default function RegionPage(){return <DiscoveryPage config={{title:'Escort & mehr in Genève.',description:'Entdecke Profile und Quellen aus dem Kanton GE. Vergleiche in Ruhe und entscheide selbst.',canton:'GE',image:'city-geneve.webp'}}/>;}
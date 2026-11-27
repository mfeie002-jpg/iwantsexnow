import {DiscoveryPage} from '@/components/night/DiscoveryPages';
export {getServerSideProps} from '@/lib/night-catalogue-server';
export default function RegionPage(){return <DiscoveryPage config={{title:'Escort & mehr in Bern.',description:'Entdecke Profile und Quellen aus dem Kanton BE. Vergleiche in Ruhe und entscheide selbst.',canton:'BE',image:'city-bern.webp'}}/>;}
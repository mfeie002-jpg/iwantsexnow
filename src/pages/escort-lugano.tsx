import {DiscoveryPage} from '@/components/night/DiscoveryPages';
export {getServerSideProps} from '@/lib/night-catalogue-server';
export default function RegionPage(){return <DiscoveryPage config={{title:'Escort & mehr in Lugano.',description:'Entdecke Profile und Quellen aus dem Kanton TI. Vergleiche in Ruhe und entscheide selbst.',canton:'TI',image:'city-lugano.webp'}}/>;}
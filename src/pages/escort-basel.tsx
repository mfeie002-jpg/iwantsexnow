import {DiscoveryPage} from '@/components/night/DiscoveryPages';
export {getServerSideProps} from '@/lib/night-catalogue-server';
export default function RegionPage(){return <DiscoveryPage config={{title:'Escort & mehr in Basel.',description:'Entdecke Profile und Quellen aus dem Kanton BS. Vergleiche in Ruhe und entscheide selbst.',canton:'BS',image:'city-basel.webp'}}/>;}
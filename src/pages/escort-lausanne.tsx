import {DiscoveryPage} from '@/components/night/DiscoveryPages';
export {getServerSideProps} from '@/lib/night-catalogue-server';
export default function RegionPage(){return <DiscoveryPage config={{title:'Escort & mehr in Lausanne.',description:'Entdecke Profile und Quellen aus dem Kanton VD. Vergleiche in Ruhe und entscheide selbst.',canton:'VD',image:'city-lausanne.webp'}}/>;}
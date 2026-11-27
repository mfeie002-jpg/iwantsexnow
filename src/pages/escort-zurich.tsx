import {DiscoveryPage} from '@/components/night/DiscoveryPages';
export {getServerSideProps} from '@/lib/night-catalogue-server';
export default function RegionPage(){return <DiscoveryPage config={{title:'Escort & mehr in Zürich.',description:'Entdecke Profile und Quellen aus dem Kanton ZH. Vergleiche in Ruhe und entscheide selbst.',canton:'ZH',image:'city-zuerich.webp'}}/>;}
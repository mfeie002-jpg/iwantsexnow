import '@/styles/globals.css';
import '@/styles/swiss-night.css';
import '@/styles/night-2027.css';
import '@/styles/discovery-2027.css';
import '@/styles/profile-2027.css';
import '@/styles/shell-2027.css';
import '@/styles/favorites-2027.css';
import '@/styles/reference-home.css';
import '@/styles/flagship-v3.css';
import type {AppProps} from 'next/app';
import {AgeVerificationGate} from '@/components/AgeVerificationGate';
import {StandLabelContext} from '@/components/DataStandNote';
import {CatalogueProvider} from '@/components/night/CatalogueContext';
import {NightShell} from '@/components/night/NightShell';
export default function App({Component,pageProps}:AppProps){
 const standLabel=pageProps.catalogueFacts?.standLabel||pageProps.standLabel||'';
 return <StandLabelContext.Provider value={standLabel}><CatalogueProvider initial={pageProps.catalogue}><NightShell initialFilters={pageProps.cataloguePage?.filters}><Component {...pageProps}/><AgeVerificationGate/></NightShell></CatalogueProvider></StandLabelContext.Provider>;
}

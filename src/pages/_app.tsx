import '@/styles/globals.css';
import '@/styles/swiss-night.css';
import '@/styles/night-2027.css';
import '@/styles/discovery-2027.css';
import '@/styles/profile-2027.css';
import '@/styles/shell-2027.css';
import '@/styles/favorites-2027.css';
import type {AppProps} from 'next/app';
import {CatalogueProvider} from '@/components/night/CatalogueContext';
import {NightShell} from '@/components/night/NightShell';
export default function App({Component,pageProps}:AppProps){return <CatalogueProvider initial={pageProps.catalogue}><NightShell><Component {...pageProps}/></NightShell></CatalogueProvider>;}

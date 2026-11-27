import '@/styles/globals.css';
import '@/styles/swiss-night.css';
import type {AppProps} from 'next/app';
import {CatalogueProvider} from '@/components/night/CatalogueContext';
import {NightShell} from '@/components/night/NightShell';
export default function App({Component,pageProps}:AppProps){return <CatalogueProvider initial={pageProps.catalogue}><NightShell><Component {...pageProps}/></NightShell></CatalogueProvider>;}
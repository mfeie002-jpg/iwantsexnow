import { Toaster } from "@/components/ui/toaster";
import { SEO } from "@/components/SEO";
import { AgeVerificationGate } from "@/components/AgeVerificationGate";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
export default function App({ Component, pageProps }: AppProps) {
  return <><SEO /><AgeVerificationGate /><Component {...pageProps} /><Toaster /></>;
}

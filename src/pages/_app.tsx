import type { AppProps } from "next/app";
import "../styles/globals.css";
import { DesignWorldProvider } from "../lib/DesignWorldContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DesignWorldProvider>
      <Component {...pageProps} />
    </DesignWorldProvider>
  );
}
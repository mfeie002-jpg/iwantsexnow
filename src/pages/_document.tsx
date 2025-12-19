import { Html, Head, Main, NextScript } from "next/document";
import { SEOElements } from "@/components/SEO";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <SEOElements />
        
        {/* Favicon and App Icons - New Logo */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo_32x32.png" />
        <link rel="icon" type="image/png" sizes="128x128" href="/logo_128x128.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/logo_256x256.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo_256x256.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/logo_512x512.png" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#1a1a1a" />
        <meta name="msapplication-TileColor" content="#0a0a0a" />
        <meta name="msapplication-TileImage" content="/logo_256x256.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
import NextDocument, { Html, Head, Main, NextScript, type DocumentContext } from "next/document";
import { IMAGE_VISIBILITY_BOOTSTRAP } from "@/lib/night-image-visibility";

export default class Document extends NextDocument<{ pageLang: string }> {
  static async getInitialProps(ctx: DocumentContext) {
    const props = await NextDocument.getInitialProps(ctx);
    return { ...props, pageLang: ctx.pathname.startsWith("/fr/") ? "fr-CH" : "de-CH" };
  }
  render() {
    return (
      <Html lang={this.props.pageLang}>
        <Head>

          {/* Favicon and App Icons - New Logo Pack */}
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="icon" type="image/png" sizes="16x16" href="/logo_16x16.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/logo_32x32.png" />
          <link rel="icon" type="image/png" sizes="64x64" href="/logo_64x64.png" />
          <link rel="icon" type="image/png" sizes="128x128" href="/logo_128x128.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="/logo_256x256.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/logo_256x256.png" />
          <link rel="icon" type="image/png" sizes="512x512" href="/logo_512x512.png" />

          {/* PWA Manifest */}
          <link rel="manifest" href="/site.webmanifest" />

          {/* Theme Color */}
          <meta name="theme-color" content="#100e16" />
          <meta name="msapplication-TileColor" content="#100e16" />
          <meta name="msapplication-TileImage" content="/logo_256x256.png" />
        </Head>
        <body>
          <script dangerouslySetInnerHTML={{ __html: IMAGE_VISIBILITY_BOOTSTRAP }} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

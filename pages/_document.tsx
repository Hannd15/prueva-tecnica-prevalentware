import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Documento base de Next.js.
 *
 * Define la estructura HTML raíz que envuelve a la aplicación.
 */
const Document = () => (
  <Html lang='en'>
    <Head />
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;

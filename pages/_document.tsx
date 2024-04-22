import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link rel='manifest' href='/manifest.json' />
        <meta name='theme-color' content='#000000' />
      </Head>
      <body className={`light h-full bg-white c-sand12 !block`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

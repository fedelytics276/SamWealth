import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>MOBU - Powered by Fede Analytics</title>
        <meta name="description" content="Transparent, evidence-based investment recommendations powered by Fede Analytics AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <Component {...pageProps} />
      </div>
    </>
  )
}

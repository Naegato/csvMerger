import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import { AppContextProvider } from '@/component/context/AppContext';
import { Toaster } from 'react-hot-toast';
import React from 'react';

export default function App({ Component, pageProps }: AppProps) {
  return <AppContextProvider>
    <Toaster/>
    <Component {...pageProps} />
  </AppContextProvider>;
}

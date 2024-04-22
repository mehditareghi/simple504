import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/state/store';
import '@/styles/uno.css';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '@/components/layouts/Layout';
import '@unocss/reset/sanitize/sanitize.css';
import '@unocss/reset/tailwind.css';
import '@/styles/reset.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PersistGate>
    </Provider>
  );
}

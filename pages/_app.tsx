// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/store";
import Layout from "@/components/Layout";
import { useState } from "react";
import AppInitializer from "./AppInitializer";
import Loader from "@/components/Loader";

export default function App({ Component, pageProps }: AppProps) {
  const [isAppReady, setIsAppReady] = useState(false);

  return (
    <Provider store={store}>

      <AppInitializer onReady={() => setIsAppReady(true)} />

      {!isAppReady ? (
        <Loader message="Checking authentication..." />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </Provider>
  );
}

// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/store";
import Layout from "@/components/Layout";
import { useState } from "react";
import AppInitializer from "./AppInitializer";

export default function App({ Component, pageProps }: AppProps) {
  const [isAppReady, setIsAppReady] = useState(false);

  return (
    <Provider store={store}>

      <AppInitializer onReady={() => setIsAppReady(true)} />

      {!isAppReady ? (
        <div className="h-screen w-full flex items-center justify-center">
          <p className="text-gray-600 text-lg">Checking authentication...</p>
        </div>
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </Provider>
  );
}

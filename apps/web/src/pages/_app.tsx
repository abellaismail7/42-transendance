import type { ReactElement, ReactNode } from "react";
import type { AppProps } from "next/app";
import type { NextPage } from "next";

import { QueryClient, QueryClientProvider } from "react-query";
import { NextUIProvider } from "@nextui-org/react";
import { SocketProvider } from "./SocketContext";
import { Inter } from "next/font/google";

import "~/styles/globals.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 0,
      retry: 0,
    },
  },
});

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <div className={inter.className}>
            {getLayout(<Component {...pageProps} />)}
          </div>
        </SocketProvider>
      </QueryClientProvider>
    </NextUIProvider>
  );
}

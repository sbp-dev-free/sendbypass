"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import NextTopLoader from "nextjs-toploader";
import { Provider } from "react-redux";

import { BaseComponentProps } from "@/components/types";
import { getConfigs } from "@/configs";
import { BottomNavigation, ConsentManager, Footer, Header } from "@/layout";
import { store } from "@/store";
import { theme } from "@/theme";

import AppSnackbarProvider from "./AppSnackbarProvider";
import { RefreshTokenProvider } from "./RefreshTokenProvider";

export const Providers = ({ children }: BaseComponentProps) => {
  const isApp = getConfigs().isApp;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <AppSnackbarProvider>
          <RefreshTokenProvider>
            <main className="flex flex-col pb-80 min-h-screen md:pb-0">
              {!isApp && <Header />}
              {children}
              {!isApp && <Footer />}
            </main>

            <NextTopLoader
              color="rgb(var(--primary))"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={true}
              easing="ease"
              speed={200}
              shadow="0 0 10px rgb(var(--primary)),0 0 5px rgb(var(--primary))"
              template='<div class="bar" role="bar"><div class="peg"></div></div> 
              <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
              zIndex={1600}
              showAtBottom={false}
            />
            {!isApp && <BottomNavigation />}
          </RefreshTokenProvider>
          <ConsentManager />
        </AppSnackbarProvider>
      </Provider>
    </ThemeProvider>
  );
};

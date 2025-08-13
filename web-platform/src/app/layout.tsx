import { ReactNode } from "react";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Metadata } from "next";

import { getConfigs, robotoFont } from "@/configs";
import CookieWatcher from "@/layout/CookieWatcher";
import { ClarityScript, GoogleScripts, InterComScript } from "@/layout/scripts";
import { Providers } from "@/providers";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Sendbypass",
  icons: {
    icon: "/favicon.ico",
  },
  description: "Send your packages safely",
};

export default function RootLayout({
  children,
  auth,
}: Readonly<{
  children: ReactNode;
  auth: ReactNode;
}>) {
  const isApp = getConfigs().isApp;
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <GoogleScripts />
        <ClarityScript />
      </head>
      <body
        className={`${robotoFont.variable} antialiased bg-background overflow-x-hidden`}
      >
        <CookieWatcher />
        <AppRouterCacheProvider options={{ key: "css" }}>
          <Providers>
            {children}
            {auth}
          </Providers>
        </AppRouterCacheProvider>
        {!isApp && <InterComScript />}
      </body>
    </html>
  );
}

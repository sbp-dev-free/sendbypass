/* eslint-disable @next/next/no-before-interactive-script-outside-document */
"use client";

import Script from "next/script";

import { getConfigs } from "@/configs";

const GoogleScripts = () => {
  const { isDev, GTAG_ID: gtagId } = getConfigs();

  return (
    <>
      {!isDev && (
        <>
          <meta
            name="google-site-verification"
            content="XlQGgk4JYaCkKmQr22ydcGZ_ArAaKAA_LPPTcUHTEGg"
          />
          <Script
            async
            strategy="beforeInteractive"
            src={`https://www.googletagmanager.com/gtag/js`}
          />
          <Script id="gtag" strategy="beforeInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gtagId}', { anonymize_ip: true });

              gtag("consent", "default", {
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'ad_storage': 'denied',
                'analytics_storage': 'denied',
                'functionality_storage': 'granted',
                'wait_for_update': 500,
              });
            `}
          </Script>
        </>
      )}
    </>
  );
};

export default GoogleScripts;

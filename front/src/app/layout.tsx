import { FC, ReactNode } from 'react';
import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import clsx from 'clsx';
import NextTopLoader from 'nextjs-toploader';
import Script from 'next/script';

import './styles/globals.css';
import { ConfigProvider } from 'antd';
import { TokenLayout } from './_components/TokenLayout';

export const metadata: Metadata = {
  title: 'Send by Pass',
  description: 'Send your packages safely',
  other: {
    'google-site-verification': 'XlQGgk4JYaCkKmQr22ydcGZ_ArAaKAA_LPPTcUHTEGg',
  },
};

export interface RootLayoutProps {
  children: Readonly<ReactNode>;
}

const RootLayout: FC<RootLayoutProps> = (props) => {
  const { children } = props;

  return (
    <html className="min-h-screen" lang="en">
      {!process.env.NEXT_PUBLIC_API_URL?.includes('dev') && (
        <head>
          <Script
            async
            strategy="beforeInteractive"
            src="https://www.googletagmanager.com/gtag/js?id=G-SZFK12YHNV"
          />
          <Script id="gtag" strategy="beforeInteractive">
            {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-SZFK12YHNV');`}
          </Script>
          <Script id="clarity-script" strategy="beforeInteractive">
            {`
            (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "oyywdh1a32");
        `}
          </Script>
        </head>
      )}
      <body className={clsx('min-h-screen')}>
        <NextTopLoader
          color="#67548E"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #67548E,0 0 5px #67548E"
          template='<div class="bar" role="bar"><div class="peg"></div></div>
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
          zIndex={1600}
          showAtBottom={false}
        />
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#67548E',
                fontFamily: 'Roboto',
              },
              components: {
                Button: {
                  boxShadow: 'none !important',
                  primaryShadow: 'none !important',
                  boxShadowSecondary: 'none !important',
                  boxShadowTertiary: 'none !important',
                  defaultShadow: 'none !important',
                },
              },
            }}
          >
            <TokenLayout>{children}</TokenLayout>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
};

export default RootLayout;

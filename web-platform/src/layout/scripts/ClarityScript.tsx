/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import React from "react";

import Script from "next/script";

import { getConfigs } from "@/configs";

const ClarityScript = () => {
  const { isDev, CLARITY_ID: clarityId } = getConfigs();

  return (
    !isDev && (
      <Script id="clarity-script" strategy="beforeInteractive">
        {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${clarityId}");

        // Enable Clarity consent mode
        window.clarity = window.clarity || function() {
          (window.clarity.q = window.clarity.q || []).push(arguments);
        };
      `}
      </Script>
    )
  );
};

export default ClarityScript;

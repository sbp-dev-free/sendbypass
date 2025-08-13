"use client";

import { useEffect, useState } from "react";

import Cookies from "js-cookie";

import { getConfigs } from "@/configs";

export default function CookieWatcher() {
  const isApp = getConfigs().isApp;
  const [access, setAccess] = useState<null | undefined | string>(null);
  const [refresh, setRefresh] = useState<null | undefined | string>(null);

  useEffect(() => {
    if (!isApp) return;
    const cookieInterval = setInterval(async () => {
      const newAccess = Cookies.get("access");

      const newRefresh = Cookies.get("refresh");

      if (newAccess !== access || newRefresh !== refresh) {
        setAccess(newAccess);
        setRefresh(newRefresh);
        if (window.ReactNativeWebView) {
          if (!!newAccess && !!newRefresh) {
            const message = JSON.stringify({
              message: "HAS-TOKEN",
            });
            window.ReactNativeWebView.postMessage(message);
          } else {
            const message = JSON.stringify({
              message: "NO-TOKEN",
            });
            window.ReactNativeWebView.postMessage(message);
          }
        }
      }
    }, 1000);

    return () => clearInterval(cookieInterval);
  }, [access, refresh]);

  return null;
}

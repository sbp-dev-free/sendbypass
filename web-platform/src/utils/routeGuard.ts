"use client";

import { useEffect } from "react";

import { useRouter } from "nextjs-toploader/app";

import { getToken } from "./token";

export default function RouteGuard() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken("access");
    if (!token) {
      if (window.ReactNativeWebView) {
        const message = JSON.stringify({
          message: "SIGN_IN",
        });
        window.ReactNativeWebView.postMessage(message);
      }
      router.push("/");
    }
  }, []);

  return null;
}

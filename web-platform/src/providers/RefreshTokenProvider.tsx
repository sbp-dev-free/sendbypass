"use client";

import { ReactNode, useEffect } from "react";

import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";

import { getConfigs } from "@/configs";
import { useRefreshTokenMutation } from "@/services/auth";
import { logout } from "@/store/slices/authSlice";
import { destroyToken, getToken, setToken, tokenParser } from "@/utils/token";

const REFRESH_TOKEN_TIMEOUT =
  Number(process.env.NEXT_PUBLIC_REFRESH_TOKEN_TIMEOUT) || 5;

export const RefreshTokenProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  const [refreshToken] = useRefreshTokenMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    const refreshIfNeeded = async () => {
      const token = getToken("access");

      if (!token) return;

      const parsedToken = tokenParser(token);
      const now = Date.now();
      const expiresIn = parsedToken.exp - now - REFRESH_TOKEN_TIMEOUT;

      if (expiresIn < REFRESH_TOKEN_TIMEOUT) {
        try {
          const { access, refresh } = await refreshToken().unwrap();
          if (getConfigs().isApp) {
            if (window.ReactNativeWebView) {
              const message = JSON.stringify({
                message: "TOKEN",
                data: {
                  access,
                  refresh,
                },
              });
              window.ReactNativeWebView.postMessage(message);
            }
          } else {
            const newParsedToken = tokenParser(access);
            setToken(
              "access",
              access,
              newParsedToken.exp - now - REFRESH_TOKEN_TIMEOUT,
            );

            scheduleTokenRefresh();
          }
        } catch (error) {
          console.log("Failed to refresh token:", error);
          destroyToken();
          dispatch(logout());

          window.location.reload();
        }
      } else {
        setTimeout(refreshIfNeeded, (expiresIn - REFRESH_TOKEN_TIMEOUT) * 1000);
      }
    };

    const scheduleTokenRefresh = () => {
      const token = getToken("access");

      if (!token) return;

      const parsedToken = tokenParser(token);
      const now = Math.floor(Date.now() / 1000);
      const expiresIn = parsedToken.exp - now - REFRESH_TOKEN_TIMEOUT;

      if (expiresIn < REFRESH_TOKEN_TIMEOUT) {
        refreshIfNeeded();
      } else {
        setTimeout(refreshIfNeeded, (expiresIn - REFRESH_TOKEN_TIMEOUT) * 1000);
      }
    };

    if (getToken("refresh") && !getToken("access")) {
      const getRefreshToken = async () => {
        try {
          const { access, refresh } = await refreshToken().unwrap();
          if (getConfigs().isApp) {
            if (window.ReactNativeWebView) {
              const message = JSON.stringify({
                message: "TOKEN",
                data: {
                  access,
                  refresh,
                },
              });
              window.ReactNativeWebView.postMessage(message);
            }
          } else {
            const newParsedToken = tokenParser(access);
            setToken(
              "access",
              access,
              newParsedToken.exp -
                Math.floor(Date.now() / 1000) -
                REFRESH_TOKEN_TIMEOUT,
            );
            scheduleTokenRefresh();
          }
        } catch (error) {
          console.log("Failed to get initial refresh token:", error);
          destroyToken();
          dispatch(logout());
          window.location.reload();
        }
      };
      getRefreshToken();
    } else {
      scheduleTokenRefresh();
    }
  }, [refreshToken, pathname]);

  return children;
};

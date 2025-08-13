"use client";

import { useEffect } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import { notFound, useSearchParams } from "next/navigation";

import { getConfigs } from "@/configs";
import { AUTH_ROUTES, ROUTES } from "@/constants";
import { useGoogleRedirectMutation } from "@/services/auth";
import { setTokens } from "@/utils";
import { deepLink } from "@/utils/deepLink";

import { AuthForm } from "../AuthForm";
import { AuthFormProps } from "../types";

export const WelcomeGoogleLogin = ({ redirect }: AuthFormProps) => {
  const searchParams = useSearchParams();

  const [googleRedirect] = useGoogleRedirectMutation();

  const state = searchParams.get("state") || "";
  const code = searchParams.get("code") || "";
  const error = searchParams.get("error") || "";

  const isNotValidParam = !state || !code;

  useEffect(() => {
    if (isNotValidParam) {
      return notFound();
    }
  }, [isNotValidParam]);
  useEffect(() => {
    const handleGoogleRedirect = async () => {
      const isApp = getConfigs().isApp;
      if (code && state) {
        try {
          const { token, status } = await googleRedirect({
            state,
            code,
            error,
          }).unwrap();
          if (isApp) deepLink(token);
          else setTokens(token);

          if (status === 200 && !isApp) {
            setTimeout(() => {
              window.location.href = ROUTES.home;
            }, 1000);
          }
          if (status === 201 && !isApp) {
            setTimeout(() => {
              window.location.href = ROUTES.home;
            }, 1000);
          }
        } catch (error) {
          console.log("token error:", error);
          setTimeout(() => {
            window.location.href = ROUTES.home;
          }, 1000);
        }
      }
    };

    handleGoogleRedirect();
  }, [code, state, error, googleRedirect]);

  const handleGoToWelcomeGoogleLogin = () => {
    const redirectUrl = searchParams.get("redirect");
    redirect(`${AUTH_ROUTES.checkAuth}?redirect=${redirectUrl}`);
  };

  return (
    <AuthForm redirect={handleGoToWelcomeGoogleLogin}>
      <div className="flex flex-col justify-center items-center md:w-[352px] p-16">
        <CircularProgress className="text-primary mb-16" />
        <div className="text-title-medium text-on-surface">Just a moment!</div>
        <div className="text-label-large text-on-surface-variant">
          we&apos;re verifying your details!
        </div>
      </div>
    </AuthForm>
  );
};

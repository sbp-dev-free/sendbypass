"use client";

import { useEffect, useRef } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import { useSearchParams } from "next/navigation";

import { CheckBadge } from "@/components/icons";
import { AUTH_ROUTES, ROUTES } from "@/constants";
import { useVerifyEmailMutation } from "@/services/auth/verify-email";

import { AuthForm } from "../AuthForm";
import { AuthFormProps } from "../types";

export const ReadyToUse = ({ redirect }: AuthFormProps) => {
  const searchParams = useSearchParams();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const hasCalled = useRef(false);

  const token = searchParams.get("token");
  const user = searchParams.get("user");

  useEffect(() => {
    if (
      hasCalled.current ||
      !token ||
      !user ||
      sessionStorage.getItem("verified")
    )
      return;

    hasCalled.current = true;
    sessionStorage.setItem("verified", "true");

    verifyEmail({ token, user })
      .unwrap()
      .catch((error) => {
        console.log("Verification failed:", error);
        redirect(ROUTES.home);
      });
  }, []);

  const handleGoToWelcome = () => {
    const redirectUrl = searchParams.get("redirect");
    redirect(`${AUTH_ROUTES.welcome}?redirect=${redirectUrl}`);
  };

  return (
    <AuthForm className="flex-col lg:flex-row" redirect={handleGoToWelcome}>
      <div className="flex flex-col items-center text-center w-full md:w-[380px]">
        <CheckBadge />
        <h5 className="text-title-large text-on-surface">
          You&apos;re all set!
        </h5>
        <div className="mt-16 mb-40">
          <h6 className="text-title-medium text-on-surface">
            Your account is ready to use.
          </h6>
          <span className="text-body-medium text-on-surface-variant">
            Thanks for joining us!
          </span>
        </div>
        <div className="flex flex-col gap-12 items-center w-full lg:flex-row">
          <LoadingButton
            loading={isLoading}
            fullWidth
            onClick={handleGoToWelcome}
            variant="filled"
          >
            Get Started
          </LoadingButton>
        </div>
      </div>
    </AuthForm>
  );
};

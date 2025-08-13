"use client";

import Button from "@mui/material/Button";
import { useSearchParams } from "next/navigation";

import { CheckBadge } from "@/components/icons";
import { AUTH_ROUTES } from "@/constants";

import { AuthForm } from "../AuthForm";
import { AuthFormProps } from "../types";

export const ConfirmNewPassword = ({ redirect }: AuthFormProps) => {
  const searchParams = useSearchParams();

  const handleGoToSignIn = () => {
    const params = new URLSearchParams(searchParams.toString());

    redirect(`${AUTH_ROUTES.signin}?${params.toString()}`);
  };

  return (
    <AuthForm className="flex-col lg:flex-row" redirect={redirect}>
      <div className="text-center w-full lg:w-[516px] flex flex-col items-center">
        <CheckBadge />
        <h5 className="text-title-large text-on-surface">Congratulations!</h5>
        <div className="mt-16 mb-40">
          <h6 className="text-title-medium text-on-surface">
            Your password has been successfully reset.
          </h6>
          <span className="text-body-medium text-on-surface-variant">
            You can now log in using your new password.
          </span>
        </div>
        {searchParams.get("redirect") === "/" && (
          <Button fullWidth onClick={handleGoToSignIn}>
            Sign in
          </Button>
        )}
      </div>
    </AuthForm>
  );
};

"use client";

import { useEffect } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import { useSearchParams } from "next/navigation";
import { useCountdown } from "usehooks-ts";

import { CheckBadge } from "@/components/icons";
import {
  useGetEmailQuery,
  useSendEmailMutation,
  useStoreEmailMutation,
} from "@/services/auth";

import { AuthForm } from "../AuthForm";
import { SuccessfullEmailSentProps } from "../types";

export const SuccessfullEmailSent = ({
  redirect,
  isAfterResetPassword,
}: SuccessfullEmailSentProps) => {
  const searchParams = useSearchParams();

  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 60,
      intervalMs: 1000,
    });

  useEffect(() => {
    startCountdown();
    return () => {
      stopCountdown();
      resetCountdown();
    };
  }, []);

  const { data } = useGetEmailQuery();
  const [setEmail, { isLoading: isValidatingEmail }] = useStoreEmailMutation();
  const [sendEmailLink, { isLoading }] = useSendEmailMutation();

  const handleResend = async () => {
    try {
      if (data?.email) {
        const redirectUrl = searchParams.get("redirect");

        await setEmail({ email: data.email }).unwrap();
        if (isAfterResetPassword) {
          await sendEmailLink({
            email: data?.email,
            redirect: redirectUrl as string,
            type: "RESET_PASSWORD",
          });
        } else {
          await sendEmailLink({
            email: data?.email,
            redirect: redirectUrl as string,
            type: "VERIFY_EMAIL",
          });
        }
        resetCountdown();
        startCountdown();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthForm
      image={
        isAfterResetPassword
          ? "/images/auth/sign-in.webp"
          : "/images/auth/sign-up.webp"
      }
      redirect={redirect}
    >
      <div className="w-full md:w-[320px] lg:w-[400px] h-full flex flex-col gap-y-24">
        <div className="flex flex-col flex-1 items-center mt-40 text-center grow">
          <CheckBadge />
          <h5 className="text-title-large text-on-surface">Success!</h5>
          <div className="mt-8 space-y-16">
            <div>
              <h6 className="text-title-medium text-on-surface">
                Check your email
              </h6>
              <span className="text-body-medium text-on-surface-variant">
                We&apos;ve sent a temporary link.
              </span>
            </div>
            <div>
              <span className="text-body-medium text-on-surface-variant">
                Please check your inbox at
              </span>
              <h6 className="text-label-large-prominent text-on-surface">
                {data?.email}
              </h6>
            </div>
            <LoadingButton
              variant="text"
              onClick={handleResend}
              loading={isLoading || isValidatingEmail}
              disabled={count > 0}
            >
              Resend {isAfterResetPassword ? "link" : "email"}{" "}
              {count > 0 && `(${count})`}
            </LoadingButton>
          </div>
        </div>
        <div className="mx-auto text-body-small text-outline">
          If you haven&apos;t gotten the email yet;
          <div>
            take a look in your
            <span className="text-label-medium-prominent">spam/junk</span>
            folder.
          </div>
        </div>
      </div>
    </AuthForm>
  );
};

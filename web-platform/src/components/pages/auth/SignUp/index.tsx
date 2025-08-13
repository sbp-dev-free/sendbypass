"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useToggle } from "usehooks-ts";

import { Google } from "@/components/icons";
import { Icon } from "@/components/shared";
import { AUTH_ROUTES, ROUTES } from "@/constants";
import { useStoreEmailMutation } from "@/services/auth";
import { cn } from "@/utils";
import { EmailFormData, EmailFormSchema } from "@/validations/auth";

import { AuthForm } from "../AuthForm";
import { AuthFormProps } from "../types";

export const SignUp = ({ redirect }: AuthFormProps) => {
  const searchParams = useSearchParams();
  const [setEmail, { isLoading }] = useStoreEmailMutation();
  const [googleLoading, setGoogleLoading] = useState(false);
  const referredCode = searchParams.get("referral") || "";
  const [isExpanded, toggleExpanded] = useToggle(Boolean(referredCode));
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(EmailFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      referred: referredCode,
    },
  });

  useEffect(() => {
    if (referredCode) {
      setValue("referred", referredCode);
    }
  }, [referredCode, setValue]);

  const onSubmit = async ({ email, referred }: EmailFormData) => {
    try {
      await setEmail({ email, referred }).unwrap();
      const params = new URLSearchParams(searchParams.toString());

      redirect(`${AUTH_ROUTES.signupEmail}?${params.toString()}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoToSignIn = () => {
    const redirectUrl = searchParams.get("redirect");
    const referral = searchParams.get("referral");
    let signinUrl = `${AUTH_ROUTES.signin}?redirect=${redirectUrl}`;
    if (referral) {
      signinUrl += `&referral=${referral}`;
    }

    redirect(signinUrl);
  };

  const openGoogleLogin = async () => {
    setGoogleLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    let googleLoginUrl = `${apiUrl}/v1/google_login/`;
    if (referredCode) {
      googleLoginUrl += `?referred=${referredCode}`;
    }
    redirect(googleLoginUrl);
  };

  return (
    <AuthForm image="/images/auth/sign-up.webp" redirect={redirect}>
      <div className="lg:w-[400px] h-full flex flex-col gap-y-24">
        <div className="mx-auto lg:hidden">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={170}
            height={24}
            className="block"
          />
        </div>
        <form
          className="flex-1 space-y-[10px] grow"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-4">
            <h4 className="text-title-large text-on-surface">
              Create a new account{" "}
            </h4>
            <div>
              <span className="text-body-medium text-on-surface-variant">
                Already have an account?
              </span>
              <Button
                variant="text-plain"
                className="!px-6"
                onClick={handleGoToSignIn}
              >
                Sign in
              </Button>
            </div>
          </div>
          <div className="space-y-8">
            <LoadingButton
              variant="outlined"
              fullWidth
              startIcon={<Google />}
              onClick={openGoogleLogin}
              loading={googleLoading}
            >
              Continue with Google{" "}
            </LoadingButton>
            <Divider>
              <span className="text-label-medium text-outline">OR</span>
            </Divider>
            <TextField
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              label="Email"
              type="email"
              placeholder="Enter your email"
              fullWidth
            />
            <div
              className="text-body-small text-on-surface-variant flex cursor-pointer my-8"
              onClick={toggleExpanded}
            >
              Got referral code? (Optional)
              <Icon
                name="caret down md"
                className={cn(
                  "text-[20px] text-on-surface transition-transform duration-200",
                  { "rotate-180": isExpanded },
                )}
              />
            </div>
            {isExpanded && (
              <TextField
                {...register("referred")}
                error={!!errors.referred}
                helperText={errors.referred?.message}
                label="referral code"
                type="text"
                placeholder="Your referral code"
                fullWidth
              />
            )}
          </div>
          <LoadingButton
            loading={isLoading}
            variant="filled"
            fullWidth
            sx={{ height: "44px" }}
            type="submit"
          >
            Continue
          </LoadingButton>
        </form>
        <div className="text-body-small text-outline">
          By joining, you agree to the Sendbypass{" "}
          <Link
            href={ROUTES.termsOfService}
            className="underline underline-offset-1"
          >
            Terms & Conditions
          </Link>
          . Please read our{" "}
          <Link
            href={ROUTES.privacyPolicy}
            className="underline underline-offset-1"
          >
            Privacy Policy
          </Link>{" "}
          to learn how we use your personal data.
        </div>
      </div>
    </AuthForm>
  );
};

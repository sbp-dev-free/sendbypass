"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { Google } from "@/components/icons";
import { AUTH_ROUTES, ROUTES } from "@/constants";
import { useStoreEmailMutation } from "@/services/auth";
import { EmailFormData, EmailFormSchema } from "@/validations/auth";

import { AuthForm } from "../AuthForm";
import { AuthFormProps } from "../types";

export const SignIn = ({ redirect }: AuthFormProps) => {
  const searchParams = useSearchParams();
  const [setEmail, { isLoading }] = useStoreEmailMutation();
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<EmailFormData>({
    resolver: zodResolver(EmailFormSchema),
    mode: "onChange",
  });

  const handleGoToSignup = () => {
    const redirectUrl = searchParams.get("redirect");
    redirect(`${AUTH_ROUTES.signup}?redirect=${redirectUrl}`);
  };

  const onSubmit = async (values: EmailFormData) => {
    try {
      await setEmail({ email: values.email });
      const params = new URLSearchParams(searchParams.toString());

      redirect(`${AUTH_ROUTES.signinEmail}?${params.toString()}`);
    } catch (error) {
      console.log(error);
    }
  };

  const openGoogleLogin = async () => {
    setGoogleLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    let googleLoginUrl = `${apiUrl}/v1/google_login/`;
    redirect(googleLoginUrl);
  };

  return (
    <AuthForm image="/images/auth/sign-in.webp" redirect={redirect}>
      <div className="lg:w-[400px] h-full flex flex-col gap-y-24">
        <form
          className="flex-1 space-y-24 grow"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-4">
            <h4 className="text-title-large text-on-surface">
              Sign in to Sendbypass
            </h4>
            <div>
              <span className="text-body-medium text-on-surface-variant">
                Don’t have an account?
              </span>
              <Button
                variant="text-plain"
                className="!px-6"
                onClick={handleGoToSignup}
              >
                Sign up
              </Button>
            </div>
          </div>
          <div className="space-y-20">
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

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { AUTH_ROUTES } from "@/constants";
import { useSendEmailMutation, useStoreEmailMutation } from "@/services/auth";
import { EmailFormData, EmailFormSchema } from "@/validations/auth";

import { AuthForm } from "../AuthForm";
import { AuthFormProps } from "../types";

export const ResetPassword = ({ redirect }: AuthFormProps) => {
  const searchParams = useSearchParams();

  const [setEmail, { isLoading: isValidatingEmail }] = useStoreEmailMutation();
  const [sendEmail, { isLoading }] = useSendEmailMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(EmailFormSchema),
    mode: "onChange",
  });

  const onSubmit = async ({ email }: EmailFormData) => {
    const redirectUrl = searchParams.get("redirect");

    try {
      await setEmail({ email }).unwrap();
      await sendEmail({
        email,
        redirect: redirectUrl as string,
        type: "RESET_PASSWORD",
      });

      const params = new URLSearchParams(searchParams.toString());

      redirect(`${AUTH_ROUTES.successfullResetPassword}?${params.toString()}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthForm
      image="/images/auth/sign-in.webp"
      redirect={redirect}
      back={AUTH_ROUTES.signinEmail}
    >
      <div className="lg:w-[400px] h-full flex flex-col gap-y-24">
        <form
          className="flex-1 space-y-24 grow"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-4">
            <h4 className="text-title-large text-on-surface">Reset password</h4>
            <div>
              <span className="text-body-small text-outline">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </span>
            </div>
          </div>

          <div className="space-y-16">
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
            variant="filled"
            fullWidth
            sx={{ height: "44px" }}
            type="submit"
            loading={isLoading || isValidatingEmail}
          >
            Send link
          </LoadingButton>
        </form>
      </div>
    </AuthForm>
  );
};

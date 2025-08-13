"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useToggle } from "usehooks-ts";

import { Icon } from "@/components/shared/Icon";
import { AUTH_ROUTES } from "@/constants";
import {
  useGetEmailQuery,
  useSignInMutation,
  useStoreEmailMutation,
} from "@/services/auth";
import { PasswordFormData, PasswordSchema } from "@/validations/auth";

import { AuthForm } from "../AuthForm";
import { AuthFormProps } from "../types";

export const SignInWithEmail = ({ redirect }: AuthFormProps) => {
  const searchParams = useSearchParams();

  const [isShowPassword, toggleShowPassword] = useToggle(false);
  const { data } = useGetEmailQuery();
  const [setEmail, { isLoading: isValidatingEmail }] = useStoreEmailMutation();
  const [signIn, { isLoading }] = useSignInMutation();

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(PasswordSchema),
    mode: "onChange",
  });

  const handleGoToResetPassword = () => {
    const params = new URLSearchParams(searchParams.toString());

    redirect(`${AUTH_ROUTES.resetPassword}?${params.toString()}`);
  };

  const onSubmit = async ({ password }: PasswordFormData) => {
    const redirectUrl = searchParams.get("redirect") || "";

    try {
      if (data?.email) {
        await setEmail({ email: data.email }).unwrap();
        await signIn({
          body: {
            email: data.email,
            password,
          },
          redirectUrl,
        }).unwrap();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthForm
      image="/images/auth/sign-in.webp"
      redirect={redirect}
      back={AUTH_ROUTES.signin}
    >
      <div className="lg:w-[400px] h-full flex flex-col gap-y-24">
        <form
          className="flex-1 space-y-24 grow"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-4">
            <h4 className="text-title-large text-on-surface">
              Continue with email{" "}
            </h4>
            <div>
              <span className="text-label-large text-outline">
                {data?.email}
              </span>
            </div>
          </div>

          <div className="space-y-16">
            <TextField
              {...register("password")}
              label="Password"
              type={isShowPassword ? "text" : "password"}
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end" onClick={toggleShowPassword}>
                      <Icon
                        name={isShowPassword ? "eye" : "Hide 3"}
                        className="text-[24px] cursor-pointer"
                      />
                    </InputAdornment>
                  ),
                },
              }}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button variant="text-plain" onClick={handleGoToResetPassword}>
              Reset password
            </Button>
          </div>

          <LoadingButton
            variant="filled"
            fullWidth
            sx={{ height: "44px" }}
            type="submit"
            loading={isValidatingEmail || isLoading}
          >
            Sign in
          </LoadingButton>
        </form>
      </div>
    </AuthForm>
  );
};

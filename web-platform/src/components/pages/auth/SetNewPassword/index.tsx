"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useToggle } from "usehooks-ts";

import { Icon } from "@/components/shared/Icon";
import { AUTH_ROUTES } from "@/constants";
import { useResetPasswordMutation } from "@/services/auth";
import { checkPasswordStrength, cn } from "@/utils";
import { PasswordFormData, PasswordFormSchema } from "@/validations/auth";

import { AuthForm } from "../AuthForm";
import { AuthFormProps } from "../types";

export const SetNewPassword = ({ redirect }: AuthFormProps) => {
  const [isShowPassword, toggleShowPassword] = useToggle(false);
  const [isShowConfirmPassword, toggleShowConfirmPassword] = useToggle(false);

  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const user = searchParams.get("user");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    formState: { errors },
    register,
    handleSubmit,
    watch,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(PasswordFormSchema),
    mode: "onChange",
  });

  const onSubmit = async (values: PasswordFormData) => {
    try {
      if (token && user) {
        await resetPassword({
          type: "RESET_PASSWORD",
          token,
          user,
          ...values,
        }).unwrap();
        const redirectUrl = searchParams.get("redirect");
        redirect(`${AUTH_ROUTES.confirmNewPassword}?redirect=${redirectUrl}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const password = watch("password");
  const isWeak = checkPasswordStrength(password) === "Weak";
  const isModerate = checkPasswordStrength(password) === "Moderate";
  const isStrong = checkPasswordStrength(password) === "Strong";
  const isVeryStrong = checkPasswordStrength(password) === "Very Strong";

  return (
    <AuthForm image="/images/auth/sign-in.webp" redirect={redirect}>
      <div className="lg:w-[400px] flex flex-col">
        <form className="flex-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <h4 className="text-title-large text-on-surface">
              Set new password
            </h4>
            <div>
              <span className="text-label-large text-outline">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </span>
            </div>
          </div>
          <div className="mb-20 space-y-16">
            <TextField
              {...register("password")}
              error={!!errors.password}
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
            />
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="text-label-medium-prominent text-on-surface">
                  Your password must have:
                </div>
                <ul className="space-y-2">
                  <li
                    className={cn("flex gap-4 items-center", {
                      "text-positive": password?.length >= 8,
                      "text-on-surface-variant": password?.length < 8,
                    })}
                  >
                    <Icon
                      name={password?.length >= 8 ? "Check circle" : "Circle"}
                    />
                    <span className="text-label-small">
                      At least 8 characters long
                    </span>
                  </li>
                  <li
                    className={cn("flex gap-4 items-center", {
                      "text-positive": isVeryStrong,
                      "text-on-surface-variant": !isVeryStrong,
                    })}
                  >
                    <Icon name={isVeryStrong ? "Check circle" : "Circle"} />
                    <span className="text-label-small">
                      Better strength (optional)
                    </span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <div className="text-label-medium-prominent text-on-surface">
                  Password Strength:
                  <span
                    className={cn("", {
                      "text-error": isWeak,
                      "text-warning-70": isModerate,
                      "text-positive-70": isStrong || isVeryStrong,
                      "text-positive": isVeryStrong,
                      hidden: !password?.length,
                    })}
                  >
                    {checkPasswordStrength(password)}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <div
                    className={cn("w-full h-[3px] rounded-full", {
                      "bg-error": isWeak,
                      "bg-warning-70": isModerate,
                      "bg-positive-70": isStrong || isVeryStrong,
                      "bg-positive": isVeryStrong,
                      "bg-outline-variant": !password?.length,
                    })}
                  />

                  <div
                    className={cn("w-full h-[3px] rounded-full", {
                      "bg-warning-70": isModerate,
                      "bg-positive-70": isStrong || isVeryStrong,
                      "bg-positive": isVeryStrong,
                      "bg-outline-variant": !(
                        isModerate ||
                        isStrong ||
                        isVeryStrong
                      ),
                    })}
                  />

                  <div
                    className={cn("w-full h-[3px] rounded-full", {
                      "bg-positive-70": isStrong || isVeryStrong,
                      "bg-positive": isVeryStrong,
                      "bg-outline-variant": !(isStrong || isVeryStrong),
                    })}
                  />

                  <div
                    className={cn("w-full h-[3px] rounded-full", {
                      "bg-positive": isVeryStrong,
                      "bg-outline-variant": !isVeryStrong,
                    })}
                  />
                </div>
                <span className="text-outline text-body-small">
                  Create a strong password by avoiding personal information,
                  calendar dates, and repetitive characters.
                </span>
              </div>
            </div>
            <TextField
              {...register("confirm_password")}
              error={!!errors.confirm_password}
              label="Confirm Password"
              type={isShowConfirmPassword ? "text" : "password"}
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={toggleShowConfirmPassword}
                    >
                      <Icon
                        name={isShowConfirmPassword ? "eye" : "Hide 3"}
                        className="text-[24px] cursor-pointer"
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
          <LoadingButton
            loading={isLoading}
            variant="filled"
            fullWidth
            sx={{ height: "44px" }}
            type="submit"
          >
            Reset password
          </LoadingButton>
        </form>
      </div>
    </AuthForm>
  );
};

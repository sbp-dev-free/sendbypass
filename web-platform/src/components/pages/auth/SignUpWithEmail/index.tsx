"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useForm } from "react-hook-form";
import { useToggle } from "usehooks-ts";

import { Icon } from "@/components/shared";
import { AUTH_ROUTES } from "@/constants";
import { useGetEmailQuery, useSignUpMutation } from "@/services/auth";
import { cn } from "@/utils";
import { checkPasswordStrength } from "@/utils/checkPasswordStrength";
import { PasswordFormData, PasswordFormSchema } from "@/validations/auth";

import { AuthForm } from "../AuthForm";
import { AuthFormProps } from "../types";

export const SignUpWithEmail = ({ redirect }: AuthFormProps) => {
  const [isShowPassword, toggleShowPassword] = useToggle(false);
  const [isShowConfirmPassword, toggleShowConfirmPassword] = useToggle(false);

  const { push } = useRouter();
  const searchParams = useSearchParams();

  const { data } = useGetEmailQuery();
  const [signup, { isLoading }] = useSignUpMutation();

  const {
    formState: { errors },
    register,
    handleSubmit,
    watch,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(PasswordFormSchema),
    mode: "onChange",
  });

  const onSubmit = async ({ password }: PasswordFormData) => {
    try {
      if (data?.email) {
        await signup({
          email: data?.email,
          password,
          referred: data?.referred ? data?.referred : "",
        }).unwrap();
        const params = new URLSearchParams(searchParams.toString());

        push(`${AUTH_ROUTES.successfullEmailSent}?${params.toString()}`);
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
    <AuthForm
      image="/images/auth/sign-up.webp"
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
                  Password Strength:{" "}
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
              helperText={errors.confirm_password?.message}
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
            <LoadingButton
              variant="filled"
              fullWidth
              sx={{ height: "44px" }}
              type="submit"
              className="mt-20"
              loading={isLoading}
            >
              Continue
            </LoadingButton>
          </div>
        </form>
      </div>
    </AuthForm>
  );
};

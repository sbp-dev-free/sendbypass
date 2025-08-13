"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";

import { useSubscribeMutation } from "@/services/subscribe";
import { SubscribeFormData, subscribeSchema } from "@/validations/about-us";

export const NeverMissUpdate = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SubscribeFormData>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      email: "",
      agree: false,
    },
  });

  const [subscribe, { isLoading }] = useSubscribeMutation();

  const onSubmit = async ({ email }: SubscribeFormData) => {
    try {
      await subscribe(email).unwrap();
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-16 lg:space-y-8">
      <Image
        src="/images/static-pages/about-us/dots.svg"
        width={30}
        height={30}
        alt="dots"
        className="pt-8"
      />
      <div className="flex flex-col gap-16 lg:px-40 lg:gap-0 lg:flex-row lg:items-center lg:justify-between">
        <div className="lg:w-[440px]">
          <p className="text-title-large text-on-surface">
            Never miss an update
          </p>
          <p className="text-body-medium text-on-surface">
            Receive the latest Sendbypass news, blog posts, and product updates
            in your inbox. We’ll rarely send more than one email a month.
          </p>
        </div>
        <div className="lg:w-[420px] space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-8 items-center">
              <TextField
                label="Email address"
                fullWidth
                autoComplete="off"
                {...register("email")}
                error={!!errors.email}
              />
              <LoadingButton
                variant="filled"
                type="submit"
                className="h-[56px]"
                disabled={!!errors.agree || !!errors.email}
                loading={isLoading}
              >
                Register
              </LoadingButton>
            </div>
            <label htmlFor="agree" className="flex items-center">
              <Controller
                name="agree"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="agree"
                    {...field}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
              <span className="text-body-small text-on-surface">
                I agree to receive marketing emails from Sendbypass.
              </span>
            </label>
          </form>
        </div>
      </div>
    </div>
  );
};

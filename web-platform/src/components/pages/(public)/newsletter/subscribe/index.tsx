"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";

import { useSubscribeMutation } from "@/services/subscribe";
import { SubscribeFormData, subscribeSchema } from "@/validations/about-us";
export const Subscribe = () => {
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
    <div className="bg-surface-container-lowest rounded-large p-16 md:p-24">
      <div className="flex flex-col md:flex-row md:justify-between items-center">
        <div className="mb-20 md:max-w-[480px] md:mb-0">
          <div className="text-title-large text-on-surface mb-8">
            Never miss an update
          </div>
          <div className="text-body-medium text-on-surface ">
            Receive the latest Sendbypass news, blog posts, and product updates
            in your inbox. We’ll rarely send more than one email a month.
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-8 md:flex md:w-[440px] md:gap-16 md:items-center md:justify-between md:space-y-0">
            <TextField
              label="Email address"
              fullWidth
              autoComplete="off"
              {...register("email")}
              error={!!errors.email}
            />
            <label htmlFor="agree" className="flex items-center md:hidden">
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
            <LoadingButton
              variant="filled"
              type="submit"
              className="h-[56px] w-full md:w-auto"
              disabled={!!errors.agree || !!errors.email}
              loading={isLoading}
            >
              Subscribe
            </LoadingButton>
          </div>
          <label htmlFor="agree" className="items-center hidden md:flex">
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
  );
};

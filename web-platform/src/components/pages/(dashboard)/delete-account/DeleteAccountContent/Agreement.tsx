"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";

import { useSendEmailMutation } from "@/services/auth";
import {
  AgreementSchema,
  AgreementTypeFormData,
} from "@/validations/delete-account";

import { OriginalContentProps } from "./types";

export const Agreement = ({ setFormSubmitted }: OriginalContentProps) => {
  const [sendEmailLink, { isLoading }] = useSendEmailMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AgreementTypeFormData>({
    resolver: zodResolver(AgreementSchema),
    defaultValues: {
      agreement: false,
      email: "",
    },
  });

  const onSubmit = async (data: AgreementTypeFormData) => {
    const res = await sendEmailLink({
      email: data?.email,
      type: "DELETE_ACCOUNT",
    });
    if (res && !("error" in res)) {
      setFormSubmitted(true);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-16 flex flex-col gap-16 md:flex-row md:justify-between"
    >
      <Controller
        name="agreement"
        control={control}
        render={({ field }) => (
          <div>
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              sx={{
                margin: 0,
                "& .MuiFormControlLabel-label": {
                  color: "rgb(var(--text-on-surface-variant))",
                  fontSize: "12px",
                },
              }}
              label="I understand that deleting my account is irreversible and will remove all my data from this service."
            />
            {errors.agreement && (
              <div className="text-body-small text-error ml-40 mt-6">
                {errors.agreement.message}
              </div>
            )}
          </div>
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="email"
            id="email"
            margin="none"
            className="md:w-[359px]"
            placeholder="Your Email Address"
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{
              "& .MuiInputBase-input": {
                padding: "10px 14px",
              },
            }}
          />
        )}
      />
      <LoadingButton
        type="submit"
        variant="filled"
        className="!bg-error-40 !h-40"
        loading={isLoading}
      >
        Request Account Deletion
      </LoadingButton>
    </form>
  );
};

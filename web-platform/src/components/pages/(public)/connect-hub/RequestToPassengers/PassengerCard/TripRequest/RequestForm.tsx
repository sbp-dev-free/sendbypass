import { FC } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Icon } from "@/components/shared";
import { PRIVATE_ROUTES } from "@/constants";
import { useCreateRequestMutation } from "@/services/requests";
import { useGetRequirementsQuery } from "@/services/requirements";
import { DEFAULT_CURRENCY } from "@/utils";
import {
  TripRequestFormValues,
  tripRequestSchema,
} from "@/validations/request";

import { RequestFormProps } from "./types";

export const RequestForm: FC<RequestFormProps> = ({
  cost,
  serviceId,
  onClose,
  callback,
}) => {
  const { data: requirements } = useGetRequirementsQuery({
    service: serviceId,
  });

  const [createRequest, { isLoading }] = useCreateRequestMutation();

  const requirementsOptions =
    requirements?.results.map((requirement) => ({
      label: requirement.name,
      value: requirement.id,
    })) || [];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm<TripRequestFormValues>({
    resolver: zodResolver(tripRequestSchema),
    defaultValues: {
      requirement: undefined,
      reward: undefined,
      description: undefined,
    },
  });

  const description = watch("description", "");

  const onSubmit = async (values: TripRequestFormValues) => {
    try {
      if (cost && serviceId) {
        await createRequest({
          ...values,
          service: serviceId,
          deal: { cost },
        }).unwrap();

        reset();
        onClose?.();
        setTimeout(() => {
          callback?.();
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="space-y-24" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
        <TextField
          select
          label="Select your Need ✱"
          error={!!errors.requirement}
          helperText={errors.requirement?.message}
          value={watch("requirement") ?? ""}
          onChange={(e) => {
            setValue("requirement", +e.target.value);
          }}
          slotProps={{
            select: {
              MenuProps: {
                sx: {
                  ".MuiList-root": { maxWidth: "unset", padding: "8px" },
                },
              },
              IconComponent: () => (
                <Icon name="Caret Down MD" className="text-[20px] mr-6" />
              ),
            },
          }}
        >
          {requirementsOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <span className="text-body-medium">{option.label}</span>
            </MenuItem>
          ))}
          {requirementsOptions.length === 0 && (
            <MenuItem disabled>
              <span className="text-body-medium">No Needs</span>
            </MenuItem>
          )}
        </TextField>

        <TextField
          autoComplete="off"
          label="Reward ✱"
          error={!!errors.reward}
          helperText={errors.reward?.message}
          {...register("reward", { valueAsNumber: true })}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <span className="text-body-medium text-outline">
                    {DEFAULT_CURRENCY.code}
                  </span>
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          autoComplete="off"
          label="Description"
          className="col-span-1 md:col-span-2"
          error={!!errors.description}
          helperText={errors.description?.message}
          {...register("description")}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <span className="text-body-medium text-outline">
                    {description.length}/200
                  </span>
                </InputAdornment>
              ),
            },
          }}
        />
      </div>

      <div className="flex flex-col gap-20 items-start md:flex-row md:items-center md:justify-between md:gap-0">
        <Link href={PRIVATE_ROUTES.needs.index}>
          <Button
            variant="text"
            startIcon={<Icon name="plus" className="text-[16px]" />}
          >
            New Need
          </Button>
        </Link>
        <div className="flex gap-8 items-center w-full md:w-auto">
          <Button variant="text" className="w-full md:w-auto" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton
            className="w-full md:w-auto"
            type="submit"
            loading={isLoading}
            variant="filled"
          >
            Submit
          </LoadingButton>
        </div>
      </div>
    </form>
  );
};

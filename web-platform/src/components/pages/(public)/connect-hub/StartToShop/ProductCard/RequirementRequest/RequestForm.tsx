import { FC } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { useRouter } from "nextjs-toploader/app";
import { useForm } from "react-hook-form";

import { Icon } from "@/components/shared";
import { PRIVATE_ROUTES } from "@/constants";
import { useCreateRequestMutation } from "@/services/requests";
import { useGetServicesQuery } from "@/services/services";
import { DEFAULT_CURRENCY } from "@/utils";
import {
  RequirementRequestFormValues,
  requirementRequestSchema,
} from "@/validations/request";

import { RequestFormProps } from "./types";

export const RequestForm: FC<RequestFormProps> = ({
  cost,
  requirementId,
  onClose,
  callback,
}) => {
  const { push } = useRouter();

  const [createRequest, { isLoading }] = useCreateRequestMutation();

  const { data: services } = useGetServicesQuery({
    requirement: requirementId,
  });

  const servicesOptions =
    services?.results
      .map((service) => ({
        label: `${service?.trip_data?.flight?.source?.location_data?.city} (${service?.trip_data?.flight?.source?.location_data?.country_iso3}) to ${service?.trip_data?.flight?.destination?.location_data?.city}(${service?.trip_data?.flight?.destination?.location_data?.country_iso3})`,
        value: service.id.toString(),
      }))
      .filter((option) => option !== undefined) || [];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm<RequirementRequestFormValues>({
    resolver: zodResolver(requirementRequestSchema),
    defaultValues: {
      service: undefined,
      reward: undefined,
      description: undefined,
    },
  });

  const description = watch("description", "");

  const onSubmit = async (values: RequirementRequestFormValues) => {
    try {
      if (cost && requirementId) {
        await createRequest({
          ...values,
          requirement: requirementId,
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

  const handleGoToNewTrip = () => {
    push(PRIVATE_ROUTES.trips.create);
    onClose?.();
  };

  return (
    <form className="space-y-24" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
        <TextField
          select
          label="Select your Trip ✱"
          error={!!errors.service}
          helperText={errors.service?.message}
          value={watch("service") ?? ""}
          onChange={(e) => {
            setValue("service", e.target.value);
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
          {servicesOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <span className="text-body-medium">{option.label}</span>
            </MenuItem>
          ))}
          {servicesOptions.length === 0 && (
            <MenuItem disabled>
              <span className="text-body-medium">No Trips</span>
            </MenuItem>
          )}
        </TextField>

        <TextField
          autoComplete="off"
          label="Proposed price ✱"
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
        <Button
          variant="text"
          startIcon={<Icon name="plus" className="text-[16px]" />}
          onClick={handleGoToNewTrip}
        >
          New Trip
        </Button>
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

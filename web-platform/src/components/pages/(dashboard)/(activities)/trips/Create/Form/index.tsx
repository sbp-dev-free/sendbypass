"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

import {
  DatePicker,
  Icon,
  ImageUploadModal,
  LocationAutocomplete,
  TimePicker,
} from "@/components";
import { DefaultImg } from "@/components/icons";
import {
  useCreateTripMutation,
  useGetTripQuery,
  useUpdateTripMutation,
} from "@/services/trips";

const Preview = React.lazy(() => import("./Preview"));

import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import { enqueueSnackbar } from "notistack";

import { Option } from "@/components/shared/LocationAutocomplete/types";
import { PRIVATE_ROUTES } from "@/constants";
import { TripBody } from "@/services/trips/update/types";
import { readFile } from "@/utils";
import { formSchema, FormValues } from "@/validations/trip";

import { Service } from "./Service";
import { PreviewData, ServiceType, TripFormProps } from "./types";

export const TripForm = ({ mode = "create", tripId }: TripFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { data: tripData } = useGetTripQuery(tripId ?? "");
  const [createTrip] = useCreateTripMutation();
  const [updateTrip] = useUpdateTripMutation();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [services, setServices] = useState<Record<string, ServiceType>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isDesktop = !isMobile;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: null,
      destination: null,
      originAirport: null,
      destinationAirport: null,
      image: null as any,
      airline: "",
      flightNumber: "",
      departureDate: undefined,
      departureTime: undefined,
      ticketNumber: "",
      arrivalDate: undefined,
      arrivalTime: undefined,
      description: "",
      services: {},
    },
    mode: "onChange",
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  useEffect(() => {
    if (mode === "edit" && tripData) {
      const formattedOrigin = {
        id: Number(tripData.source_data?.id),
        value: String(tripData.source_data?.id),
        label: {
          country: tripData.source_data?.country || "",
          city: tripData.source_data?.city || "",
          airport: tripData.source_data?.related_object?.name,
        },
        type: tripData.source_data?.type,
      };

      const formattedDestination = {
        id: Number(tripData.destination_data?.id),
        value: String(tripData.destination_data?.id),
        label: {
          country: tripData.destination_data?.country || "",
          city: tripData.destination_data?.city || "",
          airport: tripData.destination_data?.related_object?.name,
        },
        type: tripData.destination_data?.type,
      };

      const formattedOriginAirport = {
        id: Number(tripData.flight?.source?.location),
        value: String(tripData.flight?.source?.location),
        label: {
          country: tripData.flight?.source?.location_data.country,
          city: tripData.flight?.source?.location_data.city,
          airport: tripData.flight?.source?.location_data?.related_object?.name,
        },
        type: tripData.flight?.source?.location_data?.type,
      };

      const formattedDestinationAirport = {
        id: Number(tripData.flight?.destination?.location),
        value: String(tripData.flight?.destination?.location),
        label: {
          country: tripData.flight?.destination?.location_data.country,
          city: tripData.flight?.destination?.location_data.city,
          airport:
            tripData.flight?.destination?.location_data?.related_object?.name,
        },
        type: tripData.flight?.destination?.location_data.type,
      };

      reset({
        origin: formattedOrigin,
        destination: formattedDestination,
        originAirport: formattedOriginAirport,
        destinationAirport: formattedDestinationAirport,
        airline: tripData.flight.airline || "",
        flightNumber: tripData.flight.number || "",
        departureDate: tripData.flight.source.to
          ? new Date(dayjs(tripData.flight.source.to).format("YYYY-MM-DD"))
          : undefined,
        departureTime: tripData.flight.source.to
          ? dayjs(tripData.flight.source.to).toDate()
          : undefined,
        ticketNumber: tripData.ticket_number || "",
        arrivalDate: tripData.flight.destination.to
          ? new Date(dayjs(tripData.flight.destination.to).format("YYYY-MM-DD"))
          : undefined,
        arrivalTime: tripData.flight.destination.to
          ? dayjs(tripData.flight.destination.to).toDate()
          : undefined,
        description: tripData.description || "",
        services: tripData.services || {},
        image: tripData.image,
      });

      if (tripData.image) {
        setImagePreview(tripData.image);
      }

      if (tripData.services) {
        setServices(tripData.services);
      }
    }
  }, [tripData, mode, reset]);

  const onSubmit = (data: FormValues) => {
    if (Object.keys(services).length === 0) {
      enqueueSnackbar("Add one service to apply your trip.", {
        variant: "error",
      });
    } else {
      try {
        const formDataWithServices = {
          ...data,
          services: services,
        };

        const validatedData = formSchema.parse(formDataWithServices);
        const previewDataObject: PreviewData = {
          image: validatedData.image,
          origin: {
            id: Number(validatedData.origin?.id ?? ""),
            label: {
              airport: validatedData.origin?.label?.airport ?? "",
              city: validatedData.origin?.label?.city ?? "",
              country: validatedData.origin?.label?.country ?? "",
            },
          },
          destination: {
            id: Number(validatedData.destination?.id ?? ""),
            label: {
              airport: validatedData.destination?.label?.airport ?? "",
              city: validatedData.destination?.label?.city ?? "",
              country: validatedData.destination?.label?.country ?? "",
            },
          },
          airline: validatedData.airline,
          flightNumber: validatedData.flightNumber,
          ticketNumber: validatedData.ticketNumber,
          description: validatedData.description,
          services: validatedData.services,
          originAirport: {
            id: Number(validatedData.originAirport?.id ?? ""),
            label: {
              airport: validatedData.originAirport?.label?.airport ?? "",
              city: validatedData.originAirport?.label?.city ?? "",
              country: validatedData.originAirport?.label?.country ?? "",
            },
          },
          destinationAirport: {
            id: Number(validatedData.destinationAirport?.id ?? ""),
            label: {
              airport: validatedData.destinationAirport?.label?.airport ?? "",
              city: validatedData.destinationAirport?.label?.city ?? "",
              country: validatedData.destinationAirport?.label?.country ?? "",
            },
          },
          departureDate: validatedData.departureDate.toString(),
          departureTime: validatedData.departureTime.toString(),
          arrivalDate: validatedData.arrivalDate.toString(),
          arrivalTime: validatedData.arrivalTime.toString(),
        };

        setPreviewData(previewDataObject);
        setPreviewOpen(true);
      } catch (error) {
        console.error("Validation error:", error);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setCropModalOpen(true);
    }
  };

  const handleCroppedImage = (croppedFile: File) => {
    const url = URL.createObjectURL(croppedFile);
    setImagePreview(url);
    setValue("image", croppedFile);
    setCropModalOpen(false);
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue("image", null as any);
  };

  const handleFinalSubmit = async (visible: boolean) => {
    setIsLoading(true);
    try {
      if (!previewData) return;

      const payload: Partial<
        TripBody & {
          flight?: any;
          services?: any;
          image?: any;
          ticket_number?: string;
          description?: string;
          source?: number;
          destination?: number;
          visible?: boolean;
        }
      > = {};

      const formattedFlight = {
        source: {
          location: previewData.originAirport?.id || "",
          to: `${dayjs(previewData.departureDate).format("YYYY-MM-DD")}T${dayjs(
            previewData.departureTime,
          ).format("HH:mm")}:00${dayjs().format("Z")}`,
        },
        destination: {
          location: previewData.destinationAirport?.id || "",
          to: `${dayjs(previewData.arrivalDate).format("YYYY-MM-DD")}T${dayjs(
            previewData.arrivalTime,
          ).format("HH:mm")}:00${dayjs().format("Z")}`,
        },
        airline: previewData.airline,
        number: previewData.flightNumber,
      };

      if (Object.keys(formattedFlight).length !== 0) {
        payload.flight = formattedFlight;
      }

      if (
        previewData.services &&
        Object.keys(previewData.services).length !== 0
      ) {
        const updatedServices = JSON.parse(
          JSON.stringify(previewData.services),
        );
        if (
          updatedServices["shipping:document"]?.properties?.weight === "< 1"
        ) {
          updatedServices["shipping:document"].properties.weight = "0";
        }
        payload.services = updatedServices;
      }

      if (previewData.ticketNumber) {
        payload.ticket_number = previewData.ticketNumber;
      }
      if (previewData.description) {
        payload.description = previewData.description;
      }
      if (previewData.origin) {
        payload.source = Number(previewData.origin.id);
      }
      if (previewData.destination) {
        payload.destination = Number(previewData.destination.id);
      }

      payload.visible = visible;

      if (mode === "create") {
        const formData = new FormData();

        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(
              key,
              typeof value === "object" ? JSON.stringify(value) : String(value),
            );
          }
        });

        if (previewData.image && previewData.image instanceof File) {
          try {
            const imageBlob = await readFile(previewData.image);
            formData.append("image", imageBlob, previewData.image.name);
          } catch (error) {
            console.error("Error processing new image:", error);
          }
        }

        await createTrip(formData);
      } else {
        if (!tripId) {
          throw new Error("tripId is required for updating the trip.");
        }

        if (previewData.image) {
          if (previewData.image instanceof File) {
            const formData = new FormData();

            Object.entries(payload).forEach(([key, value]) => {
              if (value !== undefined) {
                formData.append(
                  key,
                  typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value),
                );
              }
            });

            try {
              const imageBlob = await readFile(previewData.image);
              formData.append("image", imageBlob, previewData.image.name);
              await updateTrip({
                id: tripId,
                body: formData as unknown as Partial<TripBody>,
              });
            } catch (error) {
              console.error("Error processing new image:", error);
              throw error;
            }
          } else {
            await updateTrip({ id: tripId, body: payload });
          }
        }
      }
      setTimeout(() => {
        router.push("/dashboard/trips");
      }, 1000);
    } catch (error) {
      console.error(
        mode === "edit" ? "Failed to update trip:" : "Failed to add trip:",
        error,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(PRIVATE_ROUTES.trips.index);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-24 mt-24 mb-24 md:grid-cols-2 md:gap-20 md:mb-20">
          <Controller
            name="origin"
            control={control}
            render={({ field }) => (
              <div>
                <LocationAutocomplete
                  type="CITY"
                  value={field.value as Option | null}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  placeholder="Origin City"
                  className={`!w-full ${errors.origin ? "error" : ""}`}
                />
                {errors.origin && (
                  <FormHelperText error className="mt-1 ml-3">
                    {errors.origin.message}
                  </FormHelperText>
                )}
              </div>
            )}
          />

          <Controller
            name="destination"
            control={control}
            render={({ field }) => (
              <div>
                <LocationAutocomplete
                  type="CITY"
                  value={field.value as Option | null}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  placeholder="Destination City"
                  className={`!w-full ${errors.destination ? "error" : ""}`}
                />
                {errors.destination && (
                  <FormHelperText error className="mt-1 ml-3">
                    {errors.destination.message}
                  </FormHelperText>
                )}
              </div>
            )}
          />
        </div>

        <div className="flex gap-x-20 lg:mb-20">
          {isDesktop && (
            <div className="w-[184px] flex-shrink-0">
              <div className="h-full border rounded-small border-primary-opacity-8">
                <div className="h-[90px] rounded-t-small bg-primary-opacity-8 flex items-center justify-center">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={296}
                      height={90}
                      className="h-[90px] object-cover rounded-t-small"
                    />
                  ) : (
                    <DefaultImg />
                  )}
                </div>

                <div className="flex flex-col p-8 h-[114px] justify-between items-center">
                  <div>
                    <span className="block text-center text-label-large text-on-surface">
                      Ticket image
                    </span>
                    <span className="block mt-4 text-center text-outline text-body-small">
                      (PNG, JPEG) under 5MB
                    </span>
                  </div>
                  <div className="flex flex-col justify-center items-center w-full">
                    {!imagePreview ? (
                      <>
                        {" "}
                        <Button
                          variant="text"
                          className="w-full"
                          onClick={handleButtonClick}
                        >
                          Add
                        </Button>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                        />
                      </>
                    ) : (
                      <IconButton
                        color="standard"
                        onClick={removeImage}
                        className="mt-8"
                      >
                        <Icon name="delete" className="text-outline" />
                      </IconButton>
                    )}
                    {errors.image?.message && (
                      <p className="text-[#de1f1f] text-body-small text-center">
                        {String(errors.image.message) ===
                        "Input not instance of File"
                          ? "Image is required"
                          : String(errors.image.message)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="lg:w-full">
            <div className="grid grid-cols-1 gap-y-24 mb-24 lg:grid-cols-3 lg:gap-x-20 lg:mb-20">
              <Controller
                name="originAirport"
                control={control}
                render={({ field }) => (
                  <div>
                    <LocationAutocomplete
                      type="AIRPORT"
                      value={field.value as Option | null}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      placeholder="Origin Airport"
                      className={`!w-full ${errors.originAirport ? "error" : ""}`}
                    />
                    {errors.originAirport && (
                      <FormHelperText error className="mt-1 ml-3">
                        {errors.originAirport.message}
                      </FormHelperText>
                    )}
                  </div>
                )}
              />

              <Controller
                name="destinationAirport"
                control={control}
                render={({ field }) => (
                  <div>
                    <LocationAutocomplete
                      type="AIRPORT"
                      value={field.value as Option | null}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      placeholder="Destination Airport"
                      className={`!w-full ${errors.destinationAirport ? "error" : ""}`}
                    />
                    {errors.destinationAirport && (
                      <FormHelperText error className="mt-1 ml-3">
                        {errors.destinationAirport.message}
                      </FormHelperText>
                    )}
                  </div>
                )}
              />

              <Controller
                name="airline"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Airline"
                    autoComplete="off"
                    className="text-on-surface-variant"
                    size="medium"
                    error={!!errors.airline}
                    helperText={errors.airline?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon
                            name="plane take off"
                            className="text-[24px] text-on-surface-variant"
                          />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      sx: {
                        left: 26,
                      },
                    }}
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-x-12 mb-24 lg:grid-cols-3 lg:gap-x-20 lg:mb-20">
              {isDesktop && (
                <Controller
                  name="flightNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Flight Number"
                      autoComplete="off"
                      className="text-on-surface-variant"
                      size="medium"
                      error={!!errors.flightNumber}
                      helperText={errors.flightNumber?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon
                              name="flight ticket"
                              className="text-[24px] text-on-surface-variant"
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              )}

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="departureDate"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <DatePicker
                        {...field}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) =>
                          field.onChange(date ? date.toDate() : null)
                        }
                        label="Departure Date"
                        className="w-full text-on-surface-variant"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.departureDate,
                          },
                        }}
                        disablePast
                      />
                      {errors.departureDate && (
                        <FormHelperText error className="mt-1 ml-3">
                          {errors.departureDate.message}
                        </FormHelperText>
                      )}
                    </div>
                  )}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="departureTime"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <TimePicker
                        {...field}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(time) =>
                          field.onChange(time ? time.toDate() : null)
                        }
                        label="Departure Time"
                        className="w-full text-on-surface-variant"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.departureTime,
                          },
                        }}
                        views={["hours", "minutes"]}
                        format="hh:mm A"
                      />
                      {errors.departureTime && (
                        <FormHelperText error className="mt-1 ml-3">
                          {errors.departureTime.message}
                        </FormHelperText>
                      )}
                    </div>
                  )}
                />
              </LocalizationProvider>
            </div>
            <div className="grid grid-cols-2 gap-x-12 mb-24 lg:grid-cols-3 lg:gap-x-20 lg:mb-0">
              {isDesktop && (
                <Controller
                  name="ticketNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Ticket Number"
                      className="text-on-surface-variant"
                      size="medium"
                      autoComplete="off"
                      error={!!errors.ticketNumber}
                      helperText={errors.ticketNumber?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon
                              name="ticket"
                              className="text-[24px] text-on-surface-variant"
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              )}

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="arrivalDate"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <DatePicker
                        {...field}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) =>
                          field.onChange(date ? date.toDate() : null)
                        }
                        label="Arrival Date"
                        className="w-full text-on-surface-variant"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.arrivalDate,
                          },
                        }}
                        disablePast
                      />
                      {errors.arrivalDate && (
                        <FormHelperText error className="mt-1 ml-3">
                          {errors.arrivalDate.message}
                        </FormHelperText>
                      )}
                    </div>
                  )}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="arrivalTime"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <TimePicker
                        {...field}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(time) =>
                          field.onChange(time ? time.toDate() : null)
                        }
                        label="Arrival Time"
                        className="w-full text-on-surface-variant"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.arrivalTime,
                          },
                        }}
                        views={["hours", "minutes"]}
                        format="hh:mm A"
                      />
                      {errors.arrivalTime && (
                        <FormHelperText error className="mt-1 ml-3">
                          {errors.arrivalTime.message}
                        </FormHelperText>
                      )}
                    </div>
                  )}
                />
              </LocalizationProvider>
            </div>
            {isMobile && (
              <div className="mb-24">
                <div
                  className={`flex h-[64px] items-center border rounded-small ${errors.image ? "border-[#de1f1f]" : "border-primary-opacity-8"}`}
                >
                  <div className="w-[64px] flex-shrink-0 h-full rounded-s-small bg-primary-opacity-8 flex items-center justify-center">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={64}
                        height={64}
                        className="h-[64px] object-cover rounded-s-small"
                      />
                    ) : (
                      <DefaultImg />
                    )}
                  </div>
                  <div className="flex gap-16 justify-between p-8 w-full">
                    <div>
                      <span className="block text-label-large text-on-surface">
                        Ticket image
                      </span>
                      <span className="block mt-4 text-outline text-body-small">
                        (PNG, JPEG) under 5MB
                      </span>
                    </div>
                    {!imagePreview ? (
                      <div>
                        <Button
                          variant="text"
                          className="w-full"
                          onClick={handleButtonClick}
                        >
                          Add
                        </Button>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                        />
                      </div>
                    ) : (
                      <IconButton color="standard" onClick={removeImage}>
                        <Icon name="delete" className="text-outline" />
                      </IconButton>
                    )}
                  </div>
                </div>
                {errors.image?.message && (
                  <p className="mt-2 text-body-small text-[#de1f1f]">
                    {String(errors.image.message) ===
                    "Input not instance of File"
                      ? "Image is required"
                      : String(errors.image.message)}
                  </p>
                )}
              </div>
            )}

            {isMobile && (
              <div className="grid grid-cols-2 gap-12 mb-24">
                <Controller
                  name="flightNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Flight Number"
                      autoComplete="off"
                      className="text-on-surface-variant"
                      size="medium"
                      error={!!errors.flightNumber}
                      helperText={errors.flightNumber?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon
                              name="flight ticket"
                              className="text-[24px] text-on-surface-variant"
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                <Controller
                  name="ticketNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Ticket Number"
                      autoComplete="off"
                      className="text-on-surface-variant"
                      size="medium"
                      error={!!errors.ticketNumber}
                      helperText={errors.ticketNumber?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon
                              name="ticket"
                              className="text-[24px] text-on-surface-variant"
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </div>
            )}
          </div>
        </div>
        <div className="mt-0">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Description"
                autoComplete="off"
                className="text-on-surface-variant"
                size="medium"
                error={!!errors.description}
                helperText={errors.description?.message}
                multiline
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <span className="text-outline text-body-medium">
                        {field.value?.length || 0}/200
                      </span>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </div>
        <div className="flex items-center mt-48 mb-16 lg:mt-64">
          <div className="p-16">
            <div className="w-[18px] h-[18px] flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="w-[5px] h-[5px] rounded-full bg-outline-variant"></div>
                <div className="w-[5px] h-[5px] rounded-full bg-primary"></div>
              </div>
              <div className="flex justify-between">
                <div className="w-[5px] h-[5px] rounded-full bg-primary"></div>
                <div className="w-[5px] h-[5px] rounded-full bg-primary"></div>
              </div>
            </div>
          </div>
          <div>
            <span className="block text-title-medium text-on-surface">
              Available services {Object.keys(services).length}/3
            </span>
            <span className="block text-body-small text-on-surface-variant">
              Select the specific services you&#39;d like to provide during your
              journey, adding at least one from the list.
            </span>
          </div>
        </div>
        {errors.services?.message && (
          <p className="text-[#de1f1f] text-body-small text-left mb-20 ms-16">
            {String(errors.services?.message)}
          </p>
        )}

        <div className="mb-48 lg:mb-24">
          <Service
            type="DOCUMENT"
            services={services}
            setService={setServices}
          />
          <Service type="Cargo" services={services} setService={setServices} />
          <Service
            type="SHOPPING"
            services={services}
            setService={setServices}
          />
        </div>
        <div className="flex flex-col gap-y-20 justify-between items-center md:flex-row">
          <div className="flex gap-4 items-center">
            {isDesktop && (
              <Icon name="info circle" className="text-body-large" />
            )}
            <span className="text-on-surface text-body-small">
              Your changes will be posted after approval
            </span>
          </div>
          <div className="flex gap-8 mt-12 w-full md:mt-0 md:w-auto">
            <Button className="w-full" variant="text" onClick={handleCancel}>
              Cancel
            </Button>
            <Button className="w-full" type="submit">
              Preview
            </Button>
          </div>
        </div>
      </form>
      {previewOpen && (
        <Suspense fallback={<div>Loading...</div>}>
          <Preview
            isOpen={previewOpen}
            onClose={() => setPreviewOpen(false)}
            onSubmit={handleFinalSubmit}
            data={previewData!}
            loading={isLoading}
          />
        </Suspense>
      )}

      <ImageUploadModal
        open={cropModalOpen}
        image={selectedImage}
        onClose={() => setCropModalOpen(false)}
        onSave={handleCroppedImage}
      />
    </>
  );
};

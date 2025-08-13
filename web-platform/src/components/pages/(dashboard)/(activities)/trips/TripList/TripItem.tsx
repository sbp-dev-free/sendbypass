"use client";
import { FC, useState } from "react";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Switch from "@mui/material/Switch";
import useMediaQuery from "@mui/material/useMediaQuery";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { DeleteModal, Icon, ResponsiveTooltip, Table } from "@/components";
import { PRIVATE_ROUTES } from "@/constants";
import { useDeleteTripMutation, useUpdateTripMutation } from "@/services/trips";

import { BadgeTrip } from "./BadgeTrip";
import { TripItemProps } from "./types";

const serviceLabelMapper = (type: string | undefined) => {
  const serviceType = type?.split(":")[0];
  const service = type?.split(":")[1];
  if (serviceType === "shipping") {
    return service === "visible_load" ? "Cargo" : "Documents";
  }
  return service === "visible_load" ? "Shopping" : "Documents";
};

export const TripItem: FC<TripItemProps> = ({ trip }) => {
  const [showDescription, setShowDescription] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [visible, setVisible] = useState(trip.visible);
  const [updateTrip] = useUpdateTripMutation();
  const [deleteTrip, { isLoading }] = useDeleteTripMutation();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );

  const {
    description,
    flight,
    status,
    ticket_number,
    image,
    destination_data,
    source_data,
  } = trip;
  const { source, destination } = flight;

  const router = useRouter();

  const tripTableData = trip.services
    ? Object.keys(trip.services).map((key) => ({
        key: key,
        services: serviceLabelMapper(key),
        max_weight:
          Number(
            (trip.services as Record<string, any>)[key].properties.weight,
          ) === 0
            ? "< 1"
            : (trip.services as Record<string, any>)[key].properties.weight,
        fee: (trip.services as Record<string, any>)[key].cost.wage,
        description: (trip.services as Record<string, any>)[key].description,
      }))
    : [];
  const columns = [
    {
      title: "Services",
      dataIndex: "services",
    },
    {
      title: "Max weight",
      dataIndex: "max_weight",
    },
    {
      title: "Fee",
      dataIndex: "fee",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
  ];

  const handleDeleteModalOpen = () => setDeleteModalOpen(true);
  const handleDeleteModalClose = () => setDeleteModalOpen(false);

  const handleDeleteConfirm = async () => {
    try {
      await deleteTrip(String(trip.id));
      setDeleteModalOpen(false);
      setSnackbarMessage("Trip deleted successfully");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("Failed to delete trip");
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleEditClick = () => {
    router.push(`${PRIVATE_ROUTES.trips.index}/${trip.id}`);
  };

  const updateVisibilityTrip = async () => {
    setVisible(!trip.visible);
    try {
      await updateTrip({
        id: trip.id,
        body: {
          visible: !trip.visible,
        },
      });
      setSnackbarMessage("Trip visibility updated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      setVisible(trip.visible);
      setSnackbarMessage("Failed to update trip visibility");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <div className="relative p-12 mb-12 border md:p-16 md:mb-16 last:mb-0 border-surface-container-high rounded-medium">
        <div className="absolute -top-2 right-[20px] left-auto text-body-small px-4 md:left-[20px] md:right-auto">
          <BadgeTrip status={status} />
        </div>
        <div className="flex flex-col gap-3 justify-between w-full lg:items-start">
          <div className="flex flex-col lg:flex-row lg:items-center lg:w-full lg:h-full lg:py-16">
            <div className="flex-shrink-0 size-[140px] relative hidden lg:block lg:mr-24">
              <Image
                src={image}
                width={140}
                height={140}
                alt="ticket"
                className="h-full rounded-small"
                loading="lazy"
              />
            </div>
            <div className="grid grid-cols-1 gap-y-16 md:grid-cols-2 md:h-[116px] md:gap-x-48 md:gap-y-24 order-1 lg:order-2 md:w-full">
              <div>
                <div className="mb-2 text-label-medium text-outline md:mb-0">
                  Origin airport
                </div>
                <div className="text-label-large text-on-surface">
                  {source?.location_data?.related_object?.name}(
                  {source?.location_data?.related_object?.iata_code})
                </div>
                <div className="flex gap-x-8 text-body-small text-on-surface">
                  {source_data?.city
                    ? source_data?.city
                    : source?.location_data?.city}
                  ,{" "}
                  {source_data?.country
                    ? source_data?.country
                    : source?.location_data?.country}
                  <div className="my-auto h-12 border-r border-outline-variant"></div>
                  {dayjs(source.to).format("ddd DD MMM")}
                  <div className="my-auto h-12 border-r border-outline-variant"></div>
                  {dayjs(source.to).format("HH:mm")}
                </div>
              </div>
              <div>
                <div className="mb-2 text-label-medium text-outline md:mb-0">
                  Destination airport
                </div>
                <div className="text-label-large text-on-surface">
                  {destination?.location_data?.related_object?.name}(
                  {destination?.location_data?.related_object?.iata_code})
                </div>
                <div className="flex gap-x-8 text-body-small text-on-surface">
                  {destination_data?.city
                    ? destination_data?.city
                    : destination?.location_data?.city}
                  ,{" "}
                  {destination_data?.country
                    ? destination_data?.country
                    : destination?.location_data?.country}
                  <div className="my-auto h-12 border-r border-outline-variant"></div>
                  {dayjs(destination.to).format("ddd DD MMM")}
                  <div className="my-auto h-12 border-r border-outline-variant"></div>
                  {dayjs(destination.to).format("HH:mm")}
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-label-medium text-outline">Airline</div>
                <div className="text-label-large text-on-surface">
                  {flight.airline}
                </div>
              </div>

              <div className="hidden md:block">
                <div className="text-label-medium text-outline">
                  Flight /Ticket Number
                </div>
                <div className="flex text-label-large text-on-surface">
                  {flight.number}
                  <div className="text-label-large text-outline">/</div>
                  {ticket_number}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:w-full">
            <Table columns={columns} dataSource={tripTableData} />
          </div>
        </div>
        <div className="flex gap-x-12 my-16 w-full md:hidden">
          <div className="flex-shrink-0 size-[94px] relative">
            <Image
              src={image}
              width={94}
              height={94}
              alt="ticket"
              className="h-full rounded-small"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col flex-1 gap-y-16">
            <div>
              <div className="mb-2 text-label-medium text-outline md:mb-0">
                Airline
              </div>
              <div className="text-label-large text-on-surface">
                {flight.airline}
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <div className="mb-2 text-label-medium text-outline md:mb-0">
                  Flight Number
                </div>
                <div className="text-label-large text-on-surface">
                  {flight.number}
                </div>
              </div>
              <div>
                <div className="mb-2 text-label-medium text-outline md:mb-0">
                  Ticket number
                </div>
                <div className="text-label-large text-on-surface">
                  {ticket_number}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-16 md:hidden">
          <Table columns={columns} dataSource={tripTableData} />
        </div>
        <div className="hidden my-16 w-full border-b border-surface-container-highest lg:block"></div>
        <div className="flex flex-col gap-4 justify-between items-center lg:flex-row">
          <div className="flex justify-between items-center w-full md:w-auto md:gap-x-24">
            <div className="flex gap-x-6 items-center">
              <div className="flex gap-x-4 items-center -mx-4">
                <Switch
                  id="public"
                  size="medium"
                  checked={visible}
                  onChange={updateVisibilityTrip}
                />
                <label
                  htmlFor="public"
                  className="text-label-large text-on-surface"
                >
                  Public
                </label>
              </div>
              <ResponsiveTooltip
                placement="top"
                title="Turn it off if you do not want to publish it. By default, it will be shown in Connect Hub."
              >
                <Icon
                  name="info circle"
                  className="text-[20px] text-on-surface-variant"
                />
              </ResponsiveTooltip>
            </div>

            <div
              className="flex gap-x-2 items-center cursor-pointer text-label-large text-on-surface"
              onClick={() => setShowDescription(!showDescription)}
            >
              Description
              <Icon
                name="caret down md"
                className={`text-[20px] pt-2 text-on-surface transition-transform duration-200 ${
                  showDescription ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
          </div>
          {showDescription && (
            <div className="block mt-16 w-full md:hidden">
              <p className="whitespace-normal break-all text-on-surface-variant text-body-medium">
                {description}
              </p>
            </div>
          )}
          <div className="block my-16 w-full border-b border-surface-container-highest lg:hidden"></div>
          <div
            className={`flex gap-x-12 md:w-auto ${trip.status === "SUBMITTED" ? "w-full" : "ml-auto"}`}
          >
            <Button
              variant={trip.status === "SUBMITTED" ? "text" : "tonal"}
              fullWidth={isMobile}
              startIcon={<Icon name="delete" />}
              onClick={handleDeleteModalOpen}
            >
              Delete
            </Button>
            {trip.status === "SUBMITTED" && (
              <Button
                variant="tonal"
                fullWidth={isMobile}
                startIcon={<Icon name="edit" />}
                onClick={handleEditClick}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
        {showDescription && (
          <div className="hidden mt-16 w-full md:block">
            <p className="whitespace-normal break-all text-on-surface-variant text-body-medium">
              {description}
            </p>
          </div>
        )}

        <DeleteModal
          open={deleteModalOpen}
          onClose={handleDeleteModalClose}
          onConfirm={handleDeleteConfirm}
          title="Delete Trip"
          description="Deleting this trip will remove all associated bookings and plans. Are you sure you want to continue?"
          loading={isLoading}
        />
      </div>
    </>
  );
};

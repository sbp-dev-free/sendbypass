"use client";
import { useEffect, useMemo, useState } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import useMediaQuery from "@mui/material/useMediaQuery";
import dayjs from "dayjs";
import Image from "next/image";

import { Icon, Modal, ResponsiveTooltip, Table } from "@/components/shared";

import { PreviewProps } from "./types";

const serviceLabelMapper = (type: string | undefined) => {
  const serviceType = type?.split(":")[0];
  const service = type?.split(":")[1];
  if (serviceType === "shipping") {
    return service === "visible_load" ? "Cargo" : "Documents";
  }
  return service === "visible_load" ? "Shopping" : "Documents";
};

const Preview = ({
  isOpen,
  onClose,
  onSubmit,
  data,
  loading = true,
}: PreviewProps) => {
  const [visible, setVisible] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const getImageSource = () => {
    if (!data.image) return null;
    if (data.image instanceof File) {
      return URL.createObjectURL(data.image);
    }
    if (typeof data.image === "string") {
      return data.image;
    }
    return null;
  };

  const handlePublish = () => {
    onSubmit(visible);
  };

  useEffect(() => {
    return () => {
      if (data.image instanceof File) {
        const imageUrl = getImageSource();
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }
      }
    };
  }, [data.image]);

  const tripTableData = useMemo(() => {
    if (!data?.services) return [];

    return Object.keys(data.services).map((key) => {
      const service = data.services![key];
      return {
        key,
        services: serviceLabelMapper(key),
        max_weight:
          Number(service.properties.weight) === 0
            ? "< 1"
            : service.properties.weight,
        fee: service.cost.wage,
        description: service.description,
      };
    });
  }, [data?.services]);

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

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="relative lg:w-[812px] px-16 py-0 lg:p-24 flex flex-col justify-between h-full">
        <div className="pb-16 lg:pb-0">
          <div className="flex justify-between">
            <div>
              <div className="text-title-medium text-on-surface">
                Preview your trip
              </div>
              <div className="mb-16 text-body-small text-on-surface-variant">
                Review the information carefully, and add the trip.
              </div>
            </div>
            {!isMobile && (
              <IconButton
                color="outlined"
                className="!w-32 !h-32 rounded-full flex justify-center items-center"
                onClick={onClose}
              >
                <Icon
                  name="Close remove"
                  className="text-[20px] hidden lg:block"
                />
              </IconButton>
            )}
          </div>
          <div className="flex flex-col gap-16 lg:flex-row lg:gap-12">
            <div className="flex order-2 gap-12 lg:col-span-1 lg:order-1">
              {data.image && (
                <div className="flex-shrink-0 relative w-[94px] h-[94px] lg:w-[108px] lg:h-[108px] rounded-small overflow-hidden ">
                  <Image
                    src={getImageSource() || ""}
                    alt="Ticket"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex flex-col justify-between w-full  lg:hidden">
                <div>
                  <div className="text-outline text-label-medium">Airline</div>
                  <div className="text-on-surface text-label-large">
                    {data.airline}
                  </div>
                </div>
                <div>
                  <div className="text-outline text-label-medium">
                    Flight /Ticket Number
                  </div>
                  <div className="text-on-surface text-label-large">
                    {data.flightNumber} / {data.ticketNumber}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid order-1 grid-cols-1 gap-16 lg:grid-cols-2 lg:order-2">
              <div className="flex flex-col justify-between">
                <div>
                  <div className="text-outline text-label-medium">
                    Origin airport
                  </div>
                  <div className="text-on-surface text-label-large">
                    {data.originAirport?.label.airport}
                  </div>
                  <div className="flex gap-8 text-on-surface text-body-small">
                    {data.origin?.label.city},{data.origin?.label.country}
                    <div className="border-l border-outline-variant"></div>
                    {dayjs(data.departureDate).format("ddd DD MMM")}
                    <div className="border-l border-outline-variant"></div>
                    {dayjs(data.departureTime).format("HH:mm")}
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="text-outline text-label-medium">Airline</div>
                  <div className="text-label-large text-on-surface">
                    {data.airline}
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <div className="text-outline text-label-medium">
                    Destination airport
                  </div>
                  <div className="text-on-surface text-label-large">
                    {data.destinationAirport?.label.airport}
                  </div>
                  <div className="flex gap-8 text-on-surface text-body-small">
                    {data.destination?.label.city},
                    {data.destination?.label.country}
                    <div className="border-l border-outline-variant"></div>
                    {dayjs(data.arrivalDate).format("ddd DD MMM")}
                    <div className="border-l border-outline-variant"></div>
                    {dayjs(data.arrivalTime).format("HH:mm")}
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="text-outline text-label-medium">
                    Flight /Ticket Number
                  </div>
                  <div className="text-label-large text-on-surface">
                    {data.flightNumber} / {data.ticketNumber}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {data.description && (
            <div className="px-8 mt-16">
              <div className="mb-4 text-outline text-label-medium">
                Documents Description
              </div>
              <div className="max-w-full break-words text-on-surface text-body-small">
                {data.description}
              </div>
            </div>
          )}

          <div className="my-16 lg:w-full lg:mb-24">
            <Table
              columns={columns}
              dataSource={tripTableData}
              expansionType={"arrow"}
            />
          </div>

          <div className="lg:flex lg:justify-between lg:items-center">
            <div className="flex gap-x-4 items-center -mx-4">
              <Switch
                id="public"
                size="medium"
                checked={visible}
                onChange={(event, checked) => setVisible(checked)}
              />
              <label
                htmlFor="public"
                className="text-label-large text-on-surface"
              >
                Public
              </label>
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
            <div className="hidden gap-8 lg:flex">
              <Button
                variant="text"
                onClick={onClose}
                className="w-full lg:w-auto"
              >
                Cancel
              </Button>
              <LoadingButton
                variant="filled"
                onClick={handlePublish}
                className="w-full lg:w-auto"
                loading={loading}
              >
                Publish trip
              </LoadingButton>
            </div>
          </div>
        </div>
        <div className="flex gap-8 justify-end pt-16 mb-16 border-t border-surface-container-high lg:hidden">
          <Button variant="text" onClick={onClose} className="w-full lg:w-auto">
            Cancel
          </Button>
          <LoadingButton
            variant="filled"
            onClick={handlePublish}
            className="w-full lg:w-auto"
            loading={loading}
          >
            Publish trip
          </LoadingButton>
        </div>
      </div>
    </Modal>
  );
};
export default Preview;

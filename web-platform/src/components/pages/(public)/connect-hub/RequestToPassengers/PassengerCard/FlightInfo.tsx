"use client";

import { FC } from "react";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useToggle } from "usehooks-ts";

import { Icon, Modal } from "@/components/shared";
import { cn, formatDate } from "@/utils";

import { FlightInfoProps } from "./types";

export const FlightInfo: FC<FlightInfoProps> = ({
  flight,
  description,
  className,
}) => {
  const [showDescriptionModal, toggleDescriptionModal] = useToggle(false);

  const isLongDescription = description.length > 70;

  return (
    <div className={cn("w-auto md:w-[450px] space-y-16", className)}>
      <div>
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            <span className="text-label-large text-on-surface">
              {flight.source.location_data.airport?.iata_code}
            </span>
            <span className="text-label-medium-prominent text-outline">
              {flight.source.location_data.country}
            </span>
          </div>
          <div className="space-x-2">
            <span className="text-label-medium-prominent text-outline">
              {flight.destination.location_data.city}{" "}
            </span>
            <span className="text-label-large text-on-surface">
              {flight.destination.location_data.airport?.iata_code}
            </span>
          </div>{" "}
        </div>
        <div className="flex gap-2 items-center w-full h-24">
          <div className="relative w-full text-center border-t border-dashed before:w-8 before:h-8 before:border-2 before:border-primary before:absolute before:inset-y-1/2 before:left-4 before:-translate-x-1/2 before:rounded-full before:-translate-y-1/2 after:w-8 after:h-8 after:border-2 after:border-primary after:absolute after:inset-y-1/2 after:right-4 after:translate-x-1/2 after:rounded-full after:-translate-y-1/2 border-outline-variant">
            <Icon
              name="plane take off"
              className="text-[24px] text-on-surface-variant cursor-pointer absolute inset-x-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-40 bg-surface-container-lowest"
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="text-label-small text-outline">
              {flight.source.location_data.airport?.name}
            </div>
            <div className="flex gap-6 items-center">
              <span className="text-label-medium text-on-surface">
                {flight.source.since?.toString()}
              </span>
              <span className="inline-block rounded-full size-4 bg-outline-variant" />
              <span className="text-label-medium text-on-surface">
                {formatDate(flight.source.to)}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-end text-label-small text-outline">
              {flight.destination.location_data.airport?.name}
            </div>
            <div className="flex gap-6 justify-end items-center">
              <span className="text-label-medium text-on-surface">
                {flight.destination.since?.toString()}
              </span>
              <span className="inline-block rounded-full size-4 bg-outline-variant" />
              <span className="text-label-medium text-on-surface">
                {formatDate(flight.destination.to)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-8">
        <div className="truncate grow text-body-small text-on-surface-variant xs:max-w-[265px] md:max-w-full">
          {description}
        </div>
        {isLongDescription && (
          <Button
            variant="text-plain"
            className="!text-label-medium"
            onClick={toggleDescriptionModal}
          >
            More
          </Button>
        )}
      </div>
      <Modal open={showDescriptionModal} onClose={toggleDescriptionModal}>
        <div className="lg:w-[800px] p-24 space-y-16">
          <div className="flex justify-between items-center">
            <div className="text-title-medium text-on-surface">
              Trip Description
            </div>
            <IconButton
              color="outlined"
              onClick={toggleDescriptionModal}
              sx={{
                width: 32,
                height: 32,
                borderColor: "rgb(var(--surface-dim))",
              }}
            >
              <Icon name="Close remove" className="text-[20px]" />
            </IconButton>
          </div>
          <div className="text-body-medium text-on-surface-variant">
            {description}
          </div>
        </div>
      </Modal>
    </div>
  );
};

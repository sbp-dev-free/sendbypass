import { FC } from "react";

import Button from "@mui/material/Button";

import { FlightInfo } from "../FlightInfo";
import { PassengerInfo } from "../PassengerInfo";
import { Service } from "../ServicesInfo/Service";

import { TripRequestProps } from "./types";

export const TripReview: FC<TripRequestProps> = ({
  flight,
  description,
  service,
  onClose,
  handleNext,
  ...passengerInfo
}) => {
  return (
    <div className="space-y-24">
      <div className="space-y-16 md:space-x-16">
        <PassengerInfo {...passengerInfo} />
        <div className="flex flex-col gap-16 md:flex-row md:items-center md:gap-80 md:justify-between">
          <FlightInfo
            flight={flight}
            description={description}
            className="md:w-[75%]"
          />
          <Service {...service} />
        </div>
        <div className="space-y-4">
          <p className="text-label-medium text-outline">Service Description</p>
          <span className="text-body-small text-on-surface">
            {service?.description}
          </span>
        </div>
      </div>
      <div className="flex gap-8 justify-end items-center">
        <Button variant="text" className="w-full md:w-auto" onClick={onClose}>
          Cancel
        </Button>
        <Button className="w-full md:w-auto" onClick={handleNext}>
          Confirm and Next
        </Button>
      </div>
    </div>
  );
};

import { FC } from "react";

import Divider from "@mui/material/Divider";

import { cn } from "@/utils";

import { AirportProps } from "./types";

export const Airport: FC<AirportProps> = ({
  origin,
  name,
  iata_code,
  country,
  city,
  time,
  date,
  className,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-label-medium text-outline">
        {origin ? "Origin airport" : "Destination airport"}
      </p>
      <div>
        <p className="space-x-2 text-label-large text-on-surface">
          <span>{name}</span> <span>({iata_code})</span>
        </p>
        <div className="flex gap-x-8 items-center text-body-small text-on-surface">
          <span>
            {city}, {country}
          </span>
          <Divider orientation="vertical" flexItem className="!my-2" />
          <span>{date}</span>
          <Divider orientation="vertical" flexItem className="!my-2" />
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
};

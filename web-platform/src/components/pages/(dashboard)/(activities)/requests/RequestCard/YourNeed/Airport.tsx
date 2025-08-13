import { FC } from "react";

import Divider from "@mui/material/Divider";

import { formatDate } from "@/utils";

import { AirportProps } from "./types";

export const Airport: FC<AirportProps> = ({
  origin,
  name,
  iata_code,
  country,
  date,
}) => {
  return (
    <div>
      <p className="text-label-medium text-outline">
        {origin ? "Origin" : "Destination"}
      </p>
      <div>
        <p className="space-x-2 text-label-large text-on-surface">
          <span>{name}</span> <span>({iata_code})</span>
        </p>
        <div className="flex gap-x-8 items-center text-body-small text-on-surface">
          <span>{country}</span>
          <Divider orientation="vertical" flexItem className="!my-2" />
          <span>{formatDate(date)}</span>
        </div>
      </div>
    </div>
  );
};

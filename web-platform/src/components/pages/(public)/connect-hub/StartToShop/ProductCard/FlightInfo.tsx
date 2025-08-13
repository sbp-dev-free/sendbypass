"use client";

import { FC } from "react";

import { Icon } from "@/components/shared";
import { cn, formatDate, formatTime } from "@/utils";

import { FlightInfoProps } from "./types";

export const FlightInfo: FC<FlightInfoProps> = ({ flight, className }) => {
  return (
    <div className={cn("space-y-16 w-full xl:w-[450px]", className)}>
      <div>
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            <span className="text-label-large text-on-surface">
              {flight?.source?.location_data?.country_iso3}
            </span>
            <span className="text-label-medium-prominent text-outline">
              {flight?.source?.location_data?.city}
            </span>
          </div>
          <div className="space-x-2">
            <span className="text-label-medium-prominent text-outline">
              {flight?.destination?.location_data?.city}{" "}
            </span>
            <span className="text-label-large text-on-surface">
              {flight?.destination?.location_data?.country_iso3}
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
              {flight?.source?.location_data?.country}
            </div>
            <div className="flex gap-6 items-center">
              <span className="text-label-medium text-on-surface">
                {formatTime(flight?.source?.since || "")}
              </span>
              <span className="inline-block rounded-full size-4 bg-outline-variant" />
              <span className="text-label-medium text-on-surface">
                {formatDate(flight?.source?.to || "")}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-end text-label-small text-outline">
              {flight?.destination?.location_data?.country}
            </div>
            <div className="flex gap-6 justify-end items-center">
              <span className="text-label-medium text-on-surface">
                {formatTime(flight?.destination?.since || "")}
              </span>
              <span className="inline-block rounded-full size-4 bg-outline-variant" />
              <span className="text-label-medium text-on-surface">
                {formatDate(flight?.destination?.to || "")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

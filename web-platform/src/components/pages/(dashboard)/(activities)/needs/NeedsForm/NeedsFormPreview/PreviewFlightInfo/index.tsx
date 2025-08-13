import { Icon } from "@/components";
import { cn } from "@/utils";

import { PreviewFlightInfoProps } from "./types";

export default function PreviewFlightInfo({
  className,
  flightInfo,
}: PreviewFlightInfoProps) {
  return (
    <div className={cn("w-full", className)}>
      <div>
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            <span className="text-label-large text-on-surface">
              {flightInfo.origin.countryCode}
            </span>
            <span className="text-label-medium-prominent text-outline">
              {flightInfo.origin.city}
            </span>
          </div>
          <div className="space-x-2">
            <span className="text-label-medium-prominent text-outline">
              {flightInfo.destination.city}
            </span>
            <span className="text-label-large text-on-surface">
              {flightInfo.destination.countryCode}
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
              {flightInfo.origin.country}
            </div>
            <div className="flex gap-6 items-center">
              <span className="text-label-medium text-on-surface">
                {flightInfo.origin.date}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-right text-label-small text-outline">
              {flightInfo.destination.country}
            </div>
            <div className="flex gap-6 justify-end items-center">
              <span className="text-label-medium text-on-surface">
                {flightInfo.destination.date}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

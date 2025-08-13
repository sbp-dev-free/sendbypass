import dayjs from "dayjs";

import { cn } from "@/utils";

import NeedCardLocationInfo from "./NeedCardLocationInfo";
import { NeedCardLocationProps } from "./types";

export const NeedCardLocation = ({
  className,
  origin,
  destination,
}: NeedCardLocationProps) => {
  const douDate = destination.to
    ? dayjs(new Date(destination.to)).format("ddd DD MMM")
    : "Any date";

  return (
    <div className={cn("flex flex-col gap-24 md:flex-row", className)}>
      <NeedCardLocationInfo
        title="Origin"
        destination={origin}
        date="Any date"
      />
      <NeedCardLocationInfo
        title="Destination"
        destination={destination}
        date={douDate}
      />
    </div>
  );
};

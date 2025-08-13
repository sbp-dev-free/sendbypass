import Divider from "@mui/material/Divider";

import { NeedCardLocationInfoProps } from "./types";

export default function NeedCardLocationInfo({
  title,
  destination: { location_data },
  date,
}: NeedCardLocationInfoProps) {
  return (
    <div>
      <div className="text-label-medium text-outline">{title}</div>
      <div className="text-label-large text-on-surface">
        {location_data?.city
          ? `${location_data?.city} (${location_data?.country_iso2})`
          : "Any city"}
      </div>
      <div className="text-body-small text-on-surface flex items-center gap-8 h-[12px]">
        <span>
          {location_data?.country ? location_data?.country : "Any country"}
        </span>
        <Divider orientation="vertical" />
        <span>{date}</span>
      </div>
    </div>
  );
}

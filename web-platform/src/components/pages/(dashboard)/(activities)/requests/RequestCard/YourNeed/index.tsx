import IconButton from "@mui/material/IconButton";

import { Dimensions } from "@/components/pages/(public)/connect-hub/StartToShop/ProductCard/Dimensions";
import { FlightInfo } from "@/components/pages/(public)/connect-hub/StartToShop/ProductCard/FlightInfo";
import { ImagesSlider } from "@/components/pages/(public)/connect-hub/StartToShop/ProductCard/ImagesSlider";
import { Weight } from "@/components/pages/(public)/connect-hub/StartToShop/ProductCard/Weight";
import { Icon } from "@/components/shared";
import { DEFAULT_CURRENCY } from "@/utils";

import { Airport } from "./Airport";
import { YourNeedProps } from "./types";

export const YourNeed = ({ onClose, activity }: YourNeedProps) => {
  const { destination, source, properties, name, image, cost, comment } =
    activity;

  return (
    <div className="p-24 rounded-large bg-surface-container-lowest space-y-16 w-full lg:w-[938px]">
      <div className="flex justify-between items-center">
        <div className="flex gap-8 items-center">
          <div>
            <p className="text-title-medium text-on-surface">Your need </p>
            <span className="text-body-small text-on-surface-variant">
              Review the information carefully{" "}
            </span>
          </div>
        </div>
        <IconButton color="tonal" onClick={onClose}>
          <Icon name="Close remove" className="text-[24px]" />
        </IconButton>
      </div>
      <div className="space-y-24 lg:space-y-16">
        <div className="flex gap-12 items-center">
          {image && (
            <div className="lg:hidden">
              <ImagesSlider images={[image]} />
            </div>
          )}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-0 lg:justify-between w-full">
            <div className="space-y-2">
              <div className="text-title-medium text-on-surface">{name}</div>
              <span className="hidden text-label-medium-prominent text-outline lg:block capitalize">
                {properties.type.toLowerCase()}
              </span>
            </div>
            <div className="flex gap-4 items-center lg:gap-0 lg:items-start lg:flex-col lg:pr-16">
              <div className="whitespace-nowrap text-label-medium-prominent text-on-surface lg:text-label-small lg:text-outline">
                Proposed Reward
              </div>
              <div className="text-title-medium text-on-surface">
                {DEFAULT_CURRENCY.symbol}
                {parseFloat(cost.wage.toString()).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-16 md:flex-row md:items-center md:justify-between">
          <FlightInfo
            flight={{
              destination: destination,
              source: source,
            }}
            className="hidden md:block"
          />
          <div className="space-y-12 md:hidden">
            <Airport
              origin
              name={destination?.location_data.airport?.name || ""}
              country={destination?.location_data?.country || ""}
              date={destination?.since || ""}
              iata_code={destination?.location_data?.airport?.iata_code || ""}
            />
            <Airport
              origin
              name={source?.location_data.airport?.name || ""}
              country={source?.location_data?.country || ""}
              date={source?.since || ""}
              iata_code={source?.location_data?.airport?.iata_code || ""}
            />
          </div>
          <div className="flex gap-6 items-center w-full md:w-auto">
            <Weight value={properties.weight} className="w-full lg:w-auto" />
            <div>
              <Dimensions
                height={properties.height}
                width={properties.width}
                length={properties.length}
                flexible={properties.flexible_dimensions}
              />
            </div>
            <div className="hidden lg:block">
              <ImagesSlider images={["/images/profile-bg-default.jpeg"]} />
            </div>
          </div>
        </div>
        {comment && (
          <div className="text-body-small text-on-surface-variant">
            {comment}
          </div>
        )}
      </div>
    </div>
  );
};

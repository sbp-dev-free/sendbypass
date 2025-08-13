import Image from "next/image";

import { Dimensions } from "@/components/pages/(public)/connect-hub/StartToShop/ProductCard/Dimensions";
import { DocumentInfo } from "@/components/pages/(public)/connect-hub/StartToShop/ProductCard/DocumentInfo";
import { Weight } from "@/components/pages/(public)/connect-hub/StartToShop/ProductCard/Weight";
import { getSizeDimensions } from "@/utils";

import { Airport } from "../YourNeed/Airport";

import { ServiceInfoProps } from "./types";

export const ServiceInfo = ({ activity, description }: ServiceInfoProps) => {
  const { properties, name, image, source, destination, type } = activity;
  const isDocumentType = properties.type === "DOCUMENT" && type === "SHIPPING";
  const dimensionsText = properties.size
    ? getSizeDimensions({
        size: properties.size,
        width: properties.width,
        length: properties.length,
      })
    : "Size not specified";
  return (
    <>
      <div className="flex flex-col gap-16 my-16">
        <div className="flex flex-col gap-24 lg:flex-row lg:items-center">
          <div className="flex gap-12 items-start">
            <Image
              src={image || ""}
              width={108}
              height={108}
              className="min-w-[94px] min-h-[94px] size-[94px] lg:size-[108px] rounded-small object-cover"
              alt={name || ""}
            />
            <div className="text-title-medium text-on-surface lg:hidden">
              {name}
            </div>
          </div>
          <div className="flex flex-col gap-24 grow">
            <div className="hidden space-y-2 lg:block">
              <div className="text-title-medium text-on-surface">{name}</div>
              <p className="text-body-small text-on-surface capitalize">
                {properties.type.toLowerCase()}
              </p>
            </div>
            <div className="flex flex-col gap-24 lg:flex-row lg:items-center lg:gap-64">
              <Airport
                origin
                name={source?.location_data.related_object?.name || ""}
                country={source?.location_data.country || ""}
                date={source?.to || ""}
                iata_code={
                  source?.location_data.related_object?.iata_code || ""
                }
              />
              <Airport
                name={destination?.location_data.related_object?.name || ""}
                country={destination?.location_data.country || ""}
                date={destination?.to || ""}
                iata_code={
                  destination?.location_data.related_object?.iata_code || ""
                }
              />
            </div>
          </div>
          <div className="flex gap-6 items-center w-full lg:w-auto lg:justify-end">
            {isDocumentType ? (
              <DocumentInfo
                size={properties.size}
                num={properties.num || 0}
                dimensionsText={dimensionsText}
              />
            ) : (
              <>
                <Weight value={properties.weight} className="w-full" />
                <Dimensions
                  height={properties.height}
                  width={properties.width}
                  length={properties.length}
                  flexible={properties.flexible_dimensions}
                />
              </>
            )}
          </div>
        </div>
        <div className="text-body-small text-on-surface">{description}</div>
      </div>
    </>
  );
};

import Image from "next/image";

import { formatDate, formatTime } from "@/utils";

import { Airport } from "./Airport";
import { FlightInfoProps } from "./types";

export const FlightInfo = ({
  tripData,
  serviceDescription,
}: FlightInfoProps) => {
  const { flight, ticket_number, description, image } = tripData || {};

  return (
    <div>
      <div className="flex flex-col gap-12 my-16">
        <Airport
          origin
          name={flight?.source.location_data.airport?.name || ""}
          iata_code={flight?.source.location_data.airport?.iata_code || ""}
          country={flight?.source.location_data.country || ""}
          city={flight?.source.location_data.city || ""}
          date={formatDate(flight?.source.since || "")}
          time={formatTime(flight?.source.since || "")}
          className="lg:hidden"
        />
        <Airport
          name={flight?.destination.location_data.airport?.name || ""}
          iata_code={flight?.destination.location_data.airport?.iata_code || ""}
          country={flight?.destination.location_data.country || ""}
          city={flight?.destination.location_data.city || ""}
          date={formatDate(flight?.destination.to || "")}
          time={formatTime(flight?.destination.to || "")}
          className="lg:hidden"
        />

        <div className="flex gap-12 items-center">
          <Image
            src={image || ""}
            width={108}
            height={108}
            className="size-[94px] lg:size-[108px] rounded-small object-cover"
            alt="ticket"
          />
          <div className="flex flex-col grid-cols-2 lg:grid grow">
            <Airport
              origin
              name={flight?.source.location_data.airport?.name || ""}
              iata_code={flight?.source.location_data.airport?.iata_code || ""}
              country={flight?.source.location_data.country || ""}
              city={flight?.source.location_data.city || ""}
              date={formatDate(flight?.source.since || "")}
              time={formatTime(flight?.source.since || "")}
              className="hidden lg:block"
            />
            <Airport
              name={flight?.destination.location_data.airport?.name || ""}
              iata_code={
                flight?.destination.location_data.airport?.iata_code || ""
              }
              country={flight?.destination.location_data.country || ""}
              city={flight?.destination.location_data.city || ""}
              date={formatDate(flight?.destination.to || "")}
              time={formatTime(flight?.destination.to || "")}
              className="hidden lg:block"
            />

            <div className="col-span-2 mt-16 lg:col-span-1">
              <p className="text-label-medium text-outline">Airline</p>
              <div>
                <p className="space-x-2 text-label-large text-on-surface">
                  <span>{flight?.airline || ""}</span>
                </p>
              </div>
            </div>
            <div className="hidden mt-16 lg:block">
              <p className="text-label-medium text-outline">
                Flight /Ticket Number
              </p>
              <div>
                <p className="text-label-large text-on-surface">
                  <span>{flight?.number || ""}</span>{" "}
                  <span className="text-outline">/</span>{" "}
                  <span>{ticket_number || ""}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-12 items-center mt-16">
              <div className="lg:hidden">
                <p className="text-label-medium text-outline">Flight Number</p>
                <div>
                  <p className="text-label-large text-on-surface">
                    <span>{flight?.number || ""}</span>
                  </p>
                </div>
              </div>
              <div className="lg:hidden">
                <p className="text-label-medium text-outline">Ticket Number</p>
                <div>
                  <p className="text-label-large text-on-surface">
                    <span>{ticket_number}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {description && (
          <div className="text-body-small text-on-surface">{description}</div>
        )}
      </div>
      {serviceDescription && (
        <div className="space-y-4">
          <p className="text-label-medium text-outline">Service Description</p>
          <div className="text-body-small text-on-surface">
            {serviceDescription}
          </div>
        </div>
      )}
    </div>
  );
};

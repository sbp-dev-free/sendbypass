"use client";

import Skeleton from "@mui/material/Skeleton";
import { useSearchParams } from "next/navigation";

import { ROLE, SERVICE_TYPE } from "@/enums/globals";
import { useGetTripsQuery } from "@/services/trips";

import { EmptyResult } from "../EmptyResult";
import { KeepExploringFrame } from "../KeepExploringFrame";

import { PassengerCard } from "./PassengerCard";

const DEFAULT_PARAMS = {
  role: ROLE.CUSTOMER,
};

export const RequestToPassengers = () => {
  const searchParams = useSearchParams();
  const { from_location, to_location, service_types, cost, weight } =
    Object.fromEntries(searchParams.entries());

  const {
    data: trips,
    isLoading,
    isFetching,
  } = useGetTripsQuery({
    ...DEFAULT_PARAMS,
    from_location,
    to_location,
    cost,
    weight,
    service_types: service_types as keyof (typeof SERVICE_TYPE)[],
    similar: false,
  });

  const {
    data: similarTrips,
    isLoading: similarTripsLoading,
    isFetching: similarTripsFetching,
  } = useGetTripsQuery(
    {
      ...DEFAULT_PARAMS,
      from_location,
      to_location,
      cost,
      weight,
      service_types: service_types as keyof (typeof SERVICE_TYPE)[],
      similar: true,
    },
    { skip: Boolean(isLoading || isFetching || !trips) },
  );

  const renderSimilaTrips = () => {
    if (similarTripsLoading || similarTripsFetching) {
      return (
        <>
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton
              key={index}
              animation="wave"
              variant="rectangular"
              className="!min-h-[269px] rounded-small"
            />
          ))}
        </>
      );
    }

    if (
      similarTrips?.results.length &&
      !similarTripsLoading &&
      !similarTripsFetching
    ) {
      return (
        <KeepExploringFrame>
          {similarTrips?.results.map((trip) => (
            <PassengerCard key={trip.id} trip={trip} />
          ))}
        </KeepExploringFrame>
      );
    }
  };

  const renderTrips = () => {
    if (!trips?.results.length && !isLoading && !isFetching) {
      return <EmptyResult />;
    }

    if (trips?.results && !isLoading && !isFetching) {
      return trips.results.map((trip) => (
        <PassengerCard key={trip.id} trip={trip} />
      ));
    }

    return (
      <>
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton
            key={index}
            animation="wave"
            variant="rectangular"
            className="!min-h-[269px] rounded-small"
          />
        ))}
      </>
    );
  };

  return (
    <div className="space-y-8">
      {renderTrips()}
      {renderSimilaTrips()}
    </div>
  );
};

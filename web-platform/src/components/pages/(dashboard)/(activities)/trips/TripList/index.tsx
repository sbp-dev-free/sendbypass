"use client";

import { Suspense, useMemo } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import { useSearchParams } from "next/navigation";

import { ROLE } from "@/enums/globals";
import { useGetTripsQuery } from "@/services/trips";

import { NoTrip } from "./NoTrip";
import { TripItem } from "./TripItem";

export const TripListContent = () => {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");

  const queryParams = {
    ...(statusParam === "active" && { active: true }),
    ...(statusParam === "history" && { active: false }),
    role: "TRAVELER" as ROLE,
  };

  const { data, isLoading, isFetching } = useGetTripsQuery(queryParams);

  const trips = useMemo(() => (data ? data.results : []), [data]);

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center p-4 py-96">
        <CircularProgress />
      </div>
    );
  }

  if (trips.length === 0) return <NoTrip />;

  return (
    <div className="flex flex-col gap-12 p-12">
      {trips.map((trip) => (
        <TripItem key={trip.id} trip={trip} />
      ))}
    </div>
  );
};

export const TripList = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center p-4 my-96">
          <CircularProgress />
        </div>
      }
    >
      <TripListContent />
    </Suspense>
  );
};

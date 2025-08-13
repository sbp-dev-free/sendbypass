"use client";

import { useMemo } from "react";

import { ROLE } from "@/enums/globals";
import { useGetRequirementsQuery } from "@/services/requirements";
import { useGetTripsQuery } from "@/services/trips";

export const useActivityStats = () => {
  const {
    data: tripsData,
    isLoading: tripsLoading,
    error: tripsError,
  } = useGetTripsQuery({ role: "TRAVELER" as ROLE });

  const {
    data: needsData,
    isLoading: needsLoading,
    error: needsError,
  } = useGetRequirementsQuery({ role: "CUSTOMER" as ROLE });

  type Item = { status: string; type?: string };

  const countByStatus = (items: Item[] = [], type: string | null = null) => {
    const filteredByType = type
      ? items.filter((item) => item.type === type)
      : items;

    return filteredByType.reduce(
      (counts, item) => {
        if (item.status !== "EXPIRED" && item.status !== "FINISHED")
          counts.active++;
        else if (item.status === "EXPIRED" || item.status === "FINISHED")
          counts.history++;
        counts.all++;
        return counts;
      },
      { all: 0, active: 0, history: 0 },
    );
  };

  const stats = useMemo(() => {
    const trips = tripsData?.results || [];
    const needs = needsData?.results || [];

    return {
      trips: countByStatus(trips),
      needs: {
        shopping: countByStatus(needs, "SHOPPING"),
        shipping: countByStatus(needs, "SHIPPING"),
      },
    };
  }, [tripsData, needsData]);

  return {
    stats,
    isLoading: tripsLoading || needsLoading,
    error: tripsError || needsError,
  };
};

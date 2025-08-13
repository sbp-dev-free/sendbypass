"use client";

import { Suspense, useMemo } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import { usePathname, useSearchParams } from "next/navigation";

import { ROLE, TRIP_TYPE } from "@/enums/globals";
import { useGetRequirementsQuery } from "@/services/requirements";

import { NeedCard } from "./NeedCard";
import { NeedsEmpty } from "./NeedsEmpty";

export const NeedsListContent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");

  const tripType =
    pathname.split("/").at(-1) === "shopping"
      ? TRIP_TYPE.SHOPPING
      : TRIP_TYPE.SHIPPING;

  const queryParams = {
    types: [tripType],
    ...(statusParam === "active" && { active: "true" }),
    ...(statusParam === "history" && { active: "false" }),
    role: "CUSTOMER" as ROLE,
  };

  const { data, isLoading, isFetching } = useGetRequirementsQuery(queryParams);

  const needs = useMemo(() => (data ? data.results : []), [data]);

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center p-4 py-96">
        <CircularProgress />
      </div>
    );
  }

  if (needs.length === 0) return <NeedsEmpty />;

  return (
    <div className="flex flex-col gap-12 p-12">
      {needs.map((need) => (
        <NeedCard key={need.id} need={need} />
      ))}
    </div>
  );
};

export const NeedsList = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center p-4 py-96">
          <CircularProgress />
        </div>
      }
    >
      <NeedsListContent />
    </Suspense>
  );
};

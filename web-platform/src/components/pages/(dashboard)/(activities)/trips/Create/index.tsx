"use client";
import { Suspense } from "react";

import { usePathname } from "next/navigation";

import { TripDetailsHeader } from "../TripDetailsHeader";

import { TripForm } from "./Form";

export const NewTrip = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TripContent />
    </Suspense>
  );
};

const TripContent = () => {
  const pathname = usePathname();
  const isCreateMode = pathname.includes("/create");
  const tripId = isCreateMode ? undefined : pathname.split("/")[3];

  return (
    <div className="p-12 md:!p-16 bg-surface-container-lowest rounded-medium">
      <TripDetailsHeader />
      <TripForm mode={isCreateMode ? "create" : "edit"} tripId={tripId} />
    </div>
  );
};

"use client";

import { Suspense } from "react";

import { ActivitiesSidebar } from "@/components/pages/(dashboard)/(activities)/Sidebar";

export default function TripsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="gap-12 md:flex">
      <Suspense>
        <ActivitiesSidebar />
      </Suspense>
      <div className="bg-surface-container-lowest grow rounded-medium">
        {children}
      </div>
    </div>
  );
}

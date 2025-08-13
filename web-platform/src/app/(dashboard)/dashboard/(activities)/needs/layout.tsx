"use client";

import { Suspense, useMemo } from "react";

import { usePathname } from "next/navigation";

import { ActivitiesSidebar } from "@/components/pages/(dashboard)/(activities)/Sidebar";

export default function NeedsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const activeTab = useMemo(() => pathname.split("/").at(-1) || "", [pathname]);

  const routeHasNavbar = useMemo(
    () => ["shipping", "shopping"].includes(activeTab),
    [activeTab],
  );

  return (
    <div className="gap-12 md:flex">
      {routeHasNavbar && (
        <Suspense>
          <ActivitiesSidebar />
        </Suspense>
      )}
      <div className="bg-surface-container-lowest grow rounded-medium">
        {children}
      </div>
    </div>
  );
}

"use client";

import { ReactNode, Suspense } from "react";

import { OrdersSidebar } from "@/components/pages";

export default function OrdersLa({ children }: { children: ReactNode }) {
  return (
    <div className="gap-12 md:flex">
      <Suspense>
        <OrdersSidebar />
        <div className="bg-surface-container-lowest grow rounded-medium">
          {children}
        </div>
      </Suspense>
    </div>
  );
}

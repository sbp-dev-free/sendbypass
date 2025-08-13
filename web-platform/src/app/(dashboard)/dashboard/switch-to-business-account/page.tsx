import { Suspense } from "react";

import { SwitchToBusinessAccount } from "@/components/pages";

export default function SwitchToBusinessAccountPage() {
  return (
    <Suspense>
      <SwitchToBusinessAccount />;
    </Suspense>
  );
}

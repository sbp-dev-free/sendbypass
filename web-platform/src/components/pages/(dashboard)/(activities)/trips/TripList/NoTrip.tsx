"use client";

import { FolderFileWarning } from "@/components/icons";

export const NoTrip = () => {
  return (
    <div>
      <div className="flex flex-col justify-center py-32 mt-24 lg:h-[400px]">
        <div className="mx-auto">
          <FolderFileWarning />
        </div>
        <span className="block text-center text-title-small text-on-surface">
          No Trips
        </span>
        <span className="block text-center text-body-small text-outline">
          You can add some Trips here.
        </span>
      </div>
    </div>
  );
};

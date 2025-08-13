"use client";

import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

import { ServerSetting } from "@/components/icons";

export const UnderConstruction = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("https://pre.sendbypass.com");
  };

  return (
    <div className="rounded-medium bg-surface-container-lowest py-12 lg:py-48 lg:px-12 flex justify-start lg:justify-center flex-col items-center h-[100vh] lg:min-h-[316px]">
      <div className="flex flex-col gap-16 justify-center items-center py-32">
        <ServerSetting />
        <div>
          <div className="text-center text-on-surface text-title-small">
            Under Construction
          </div>
          <div className="text-center text-body-small text-outline">
            This page is under construction and will be back soon.
          </div>
        </div>
        <Button
          variant="tonal"
          onClick={handleClick}
          aria-label="Navigate to previous version"
        >
          Go to previous version
        </Button>
      </div>
    </div>
  );
};

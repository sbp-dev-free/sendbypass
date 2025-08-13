"use client";

import Button from "@mui/material/Button";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { Chip } from "@/components/shared";

const renderLabel = (key: string, pathname: string) => {
  switch (key) {
    case "service_types":
      return "Service Type";
    case "cost":
      return pathname.includes("start") ? "Reward" : "Budget";
    case "weight":
      return "Weight";
    case "item_types":
      return "Category";
    default:
      return key.slice(0, 1).toUpperCase() + key.slice(1);
  }
};

export const FiltersActive = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const paramsArray = Array.from(searchParams.keys()).filter(
    (key) => key !== "from_location" && key !== "to_location",
  );

  const handleRemove = (key: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete(key);
    replace(`?${newParams.toString()}`, { scroll: false });
  };

  const handleReset = () => {
    replace("?", { scroll: false });
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <span className="space-x-4">
          <span className="text-title-small text-on-surface">
            Filters active
          </span>
          <span className="text-body-small text-on-surface-variant">
            ({paramsArray.length})
          </span>
        </span>
        <Button
          variant="text"
          sx={{ minWidth: "auto", padding: "10px 12px", height: "32px" }}
          onClick={handleReset}
          disabled={paramsArray.length === 0}
        >
          Reset
        </Button>
      </div>
      <span className="flex flex-wrap gap-6 items-center">
        {paramsArray.map((key) => (
          <Chip
            key={key}
            label={renderLabel(key, pathname)}
            onClick={() => handleRemove(key)}
          />
        ))}
      </span>
    </div>
  );
};

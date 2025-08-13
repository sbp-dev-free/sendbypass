"use client";

import { useEffect, useState } from "react";

import Slider from "@mui/material/Slider";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { DEFAULT_CURRENCY } from "@/utils";

export const Budget = () => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const initialValue = searchParams.get("cost")
    ? Number(searchParams.get("cost"))
    : 1000;
  const [value, setValue] = useState<number>(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  const handleSliderChangeCommitted = (
    event: unknown,
    newValue: number | number[],
  ) => {
    const newValueAsNumber = newValue as number;
    const newParams = new URLSearchParams(searchParams.toString());

    if (newValueAsNumber === 1000) {
      newParams.delete("cost");
    } else {
      newParams.set("cost", newValueAsNumber.toString());
    }

    replace(`?${newParams.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-12">
      <span className="space-x-4">
        <span className="text-title-small text-on-surface">Your Budget</span>
        <span className="text-body-small text-on-surface-variant">
          (Per Kilo)
        </span>
      </span>
      <div className="space-y-2">
        <span className="text-label-medium text-primary">
          {value === 1000 ? "Any" : `${DEFAULT_CURRENCY.symbol}${value}`}
        </span>
        <Slider
          value={value}
          onChange={handleSliderChange}
          onChangeCommitted={handleSliderChangeCommitted}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) =>
            value === 1000 ? "Any" : `${DEFAULT_CURRENCY.symbol}${value}`
          }
          disableSwap
          min={0}
          max={1000}
        />
        <div className="flex justify-between items-center">
          <span className="text-body-small text-outline">
            {DEFAULT_CURRENCY.symbol}0
          </span>
          <span className="text-body-small text-outline">Any</span>
        </div>
      </div>
    </div>
  );
};

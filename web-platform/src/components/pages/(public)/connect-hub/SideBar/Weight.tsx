"use client";

import { useEffect, useState } from "react";

import Slider from "@mui/material/Slider";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

export const Weight = () => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const initialValue = searchParams.get("weight")
    ? Number(searchParams.get("weight"))
    : 12;
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

    if (newValueAsNumber === 12) {
      newParams.delete("weight");
    } else {
      newParams.set("weight", newValueAsNumber.toString());
    }

    replace(`?${newParams.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-12">
      <span className="space-x-4">
        <span className="text-title-small text-on-surface">Weight</span>
        <span className="text-body-small text-on-surface-variant">(kg)</span>
      </span>
      <div className="space-y-2">
        <span className="text-label-medium text-primary">
          {value === 12 ? "Any" : `${value} kg`}
        </span>
        <Slider
          value={value}
          onChange={handleSliderChange}
          onChangeCommitted={handleSliderChangeCommitted}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => (value === 12 ? "Any" : `${value} kg`)}
          disableSwap
          min={0}
          max={12}
        />
        <div className="flex justify-between items-center">
          <span className="text-body-small text-outline">0 kg</span>
          <span className="text-body-small text-outline">Any</span>
        </div>
      </div>
    </div>
  );
};

import { useState } from "react";

import LoadingButton from "@mui/lab/LoadingButton";

import { Icon } from "@/components/shared";

import { OrderCardProps } from "../types";

export const ActionBar = ({}: OrderCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className="flex justify-between items-center">
      <div
        className="text-label-large text-on-surface flex items-center"
        role="button"
        onClick={() => setShowDetails(!showDetails)}
      >
        Details
        <Icon
          name="caret down md"
          className={`text-[20px] text-on-surface transition-transform duration-200 ${
            showDetails ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>
      <div className="flex items-center gap-8">
        <Icon name="info menu" className="text-[24px] text-on-surface " />
        <LoadingButton variant="filled">Payment</LoadingButton>
      </div>
    </div>
  );
};

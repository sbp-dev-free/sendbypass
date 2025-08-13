import { FC } from "react";

import { getColorsByStatus } from "@/utils";

import { StatusProps } from "./types";

export const Status: FC<StatusProps> = ({ status }) => {
  const { bg, text } = getColorsByStatus(status);

  return (
    <div
      className={`flex items-center capitalize text-label-medium py-6 px-12 rounded-full ${bg} ${text}`}
      role="status"
    >
      {status.toLowerCase()}
    </div>
  );
};

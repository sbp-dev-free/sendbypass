import { StatusShape } from "@/components/icons";
import { getColorsByStatus } from "@/utils";

import { StatusProps } from "./types";

export const Status = ({ status }: StatusProps) => {
  const { fill, text } = getColorsByStatus(status);

  return (
    <div className="relative -top-2">
      <StatusShape className={fill} width="116" />
      <span
        className={`absolute block top-0 mx-auto left-0 right-0 w-auto 
                           text-center pt-2 first-letter:uppercase text-label-small ${text}`}
      >
        {status.toLowerCase()}
      </span>
    </div>
  );
};

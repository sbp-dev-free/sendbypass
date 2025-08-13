import { FC } from "react";

import { ValueItemProps } from "./types";

export const ValueItem: FC<ValueItemProps> = ({
  number,
  title,
  description,
}) => {
  return (
    <div className="flex gap-8 items-start">
      <h3 className="text-display-small text-primary-opacity-16">0{number}.</h3>
      <div>
        <div className="flex items-center h-[44px]">
          <h3 className="text-title-medium text-on-surface">{title}</h3>
        </div>
        <p className="text-body-large text-on-surface-variant">{description}</p>
      </div>
    </div>
  );
};

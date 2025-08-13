import { FC } from "react";

import { DescriptionAccordionProps } from "./types";

export const DescriptionAccordion: FC<DescriptionAccordionProps> = ({
  children,
  isExpanded,
}) => {
  return (
    <div
      className={`transition-all duration-300 overflow-hidden ${
        isExpanded ? "max-h-[320px] md:max-h-[260px]" : "max-h-0"
      }`}
    >
      <div className="pt-16">{children}</div>
    </div>
  );
};

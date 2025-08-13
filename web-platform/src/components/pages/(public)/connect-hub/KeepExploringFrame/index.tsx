import { FC } from "react";

import { Icon } from "@/components/shared";
import { BaseComponentProps } from "@/components/types";

export const KeepExploringFrame: FC<BaseComponentProps> = ({ children }) => {
  return (
    <div className="px-4 pt-12 pb-4 space-y-16 bg-surface-container lg:p-12 rounded-medium">
      <div className="flex flex-col gap-4 justify-center items-center">
        <p className="text-label-large-prominent text-primary">
          Keep exploring
        </p>
        <span className="text-body-small text-primary">
          Feel free to look through these other results
        </span>
        <Icon name="Caret Down MD" className="text-[24px]" />
      </div>
      {children}
    </div>
  );
};

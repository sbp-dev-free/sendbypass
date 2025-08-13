import { FC } from "react";

import { TabContentProps } from "./types";

export const TabContent: FC<TabContentProps> = ({ id, label }) => {
  return (
    <div className="flex gap-8 items-stretch transition-all duration-500 ease-in-out">
      <div className="flex gap-8 items-center py-16 px-20 rounded-small bg-primary-opacity-8">
        <span className="inline-block text-title-medium text-[rgba(255,_255,_255,_0)] bg-clip-text bg-gradient-to-r from-primary-opacity-50 to-primary">
          0{id}.
        </span>
        <div className="text-body-medium text-on-surface-variant lg:whitespace-nowrap">
          {label}
        </div>
      </div>
      <div className="grow bg-[url('/images/home/pattern.png')] bg-no-repeat bg-cover rounded-small min-w-24" />
    </div>
  );
};

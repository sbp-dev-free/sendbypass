import { Icon } from "@/components/shared/Icon";
import { getSizeDimensions } from "@/utils";

import { NeedCardDocumentTypeProps } from "./types";
export const NeedCardDocumentType = ({
  properties,
}: NeedCardDocumentTypeProps) => {
  const { size, width, length, num } = properties;

  const dimensionsText = size
    ? getSizeDimensions({ size, width, length })
    : "Size not specified";

  return (
    <div className=" justify-center p-8 h-full border border-surface-container-high flex rounded-small">
      <div className="flex flex-col justify-between items-center px-16 py-4 w-full">
        <Icon name="Document 2 lines" className="text-[24px] text-primary" />

        <div className="mb-4 text-label-medium text-on-surface flex gap-8 justify-center">
          <span className="capitalize">{size?.toLowerCase()}</span>
          <span>x{num}</span>
        </div>

        <div className="text-center text-label-medium text-outline mt-2">
          {dimensionsText}
        </div>
      </div>
    </div>
  );
};

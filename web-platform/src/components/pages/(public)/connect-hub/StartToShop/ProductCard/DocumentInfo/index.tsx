import { Icon } from "@/components";

import { DocumentInfoProps } from "./types";
export const DocumentInfo = ({
  size,
  num,
  dimensionsText,
}: DocumentInfoProps) => {
  const displaySize = size?.toLowerCase() ?? "N/A";

  return (
    <div className="space-y-6 h-[90px] px-16 py-8 rounded-small border border-surface-container-high text-center">
      <Icon name="Document 2 lines" className="text-[24px] text-primary" />
      <div className="space-y-4 text-label-medium">
        <div className="text-on-surface flex gap-8 justify-center">
          <span className="capitalize">{displaySize}</span>
          <span>x{num}</span>
        </div>

        <div className="text-outline text-label-medium mt-2">
          {dimensionsText}
        </div>
      </div>
    </div>
  );
};

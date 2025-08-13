import { FC } from "react";

import { FolderFileWarning1 } from "@/components/icons";

import { EmptyStateProps } from "./types";

export const EmptyState: FC<EmptyStateProps> = ({ title }) => {
  return (
    <div className="flex flex-col gap-8 justify-center items-center">
      <FolderFileWarning1 />
      <div className="text-title-small text-on-surface">No {title}</div>
      <p className="text-body-small text-outline">
        Please ensure that your profile includes at least one {title}.
      </p>
    </div>
  );
};

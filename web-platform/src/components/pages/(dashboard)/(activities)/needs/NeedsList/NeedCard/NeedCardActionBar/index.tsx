"use client";

import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useToggle } from "usehooks-ts";

import { Icon } from "@/components";
import { DescriptionAccordion } from "@/components/pages/(public)/connect-hub/DescriptionAccordion";
import { cn } from "@/utils";

import { NeedsCardActionBarProps } from "./types";

export const NeedsCardActionBar = ({
  description,
  handleDelete,
  needId,
  status,
}: NeedsCardActionBarProps) => {
  const [isOpenDescription, toggleDescription] = useToggle();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <button
          onClick={toggleDescription}
          className="inline-flex gap-2 items-center text-on-surface"
        >
          <span className="text-label-large">Description</span>
          <Icon
            name={isOpenDescription ? "Caret Up MD" : "Caret Down MD"}
            className="text-[20px] pt-2"
          />
        </button>
        <div className="flex gap-12 items-center">
          <Button
            variant={status === "SUBMITTED" ? "text" : "tonal"}
            onClick={handleDelete}
            startIcon={isMobile ? null : <Icon name="delete" />}
            className={cn({ "!px-0": isMobile })}
          >
            Delete
          </Button>
          {status === "SUBMITTED" && (
            <Button
              variant="tonal"
              startIcon={isMobile ? null : <Icon name="edit" />}
              onClick={() =>
                router.push(`${pathname.split("/").at(-1)}/${needId}`)
              }
              className={cn({ "!px-0": isMobile })}
            >
              Edit
            </Button>
          )}
        </div>
      </div>
      <DescriptionAccordion isExpanded={isOpenDescription}>
        <div className="space-y-16">
          <div>
            <div className="text-body-medium text-on-surface-variant">
              {description}
            </div>
          </div>
        </div>
      </DescriptionAccordion>
    </div>
  );
};

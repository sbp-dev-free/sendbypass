import { FC } from "react";

import Image from "next/image";

import { Breadcrumbs } from "@/components/shared";
import { cn } from "@/utils";

import { StaticPageFrameProps } from "./types";

export const StaticPageFrame: FC<StaticPageFrameProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-surface-container-lowest rounded-medium p-12 md:p-16 space-y-32",
        className,
      )}
    >
      <div className="space-y-12">
        <div className="text-title-large md:text-display-medium text-on-surface">
          {title}
        </div>
        <Breadcrumbs />
      </div>{" "}
      <Image
        src={"/images/static-pages/dots.svg"}
        width={83}
        height={29}
        alt="dots"
      />
      {children}
    </div>
  );
};

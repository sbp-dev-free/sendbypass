import { FC } from "react";

import Image from "next/image";
import Link from "next/link";

import { AdvisorCardProps } from "./types";

export const AdvisorCard: FC<AdvisorCardProps> = ({
  image,
  name,
  description,
  linkedin,
}) => {
  return (
    <div className="lg:w-[293px] space-y-12">
      <div className="relative h-[356px] lg:h-[391px]">
        <Image
          alt={name}
          src={image}
          className="object-cover w-full h-full rounded-large"
          fill
        />
        <Link
          href={linkedin}
          target="_blank"
          className="inline-flex absolute right-12 bottom-12 z-10 justify-center items-center py-6 px-16 rounded-full text-label-medium text-on-surface bg-surface-container"
        >
          Linkedin
        </Link>
      </div>
      <div className="px-12 space-y-4">
        <p className="text-title-medium text-on-surface">{name}</p>
        <span className="text-body-medium text-outline">{description}</span>
      </div>
    </div>
  );
};

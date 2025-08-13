import { FC } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { AdvisorCardProps } from './types';

export const AdvisorCard: FC<AdvisorCardProps> = ({
  image,
  name,
  description,
  linkedin,
}) => {
  return (
    <div className="lg:w-[293px] space-y-[12px]">
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
          className="inline-flex absolute right-[12px] bottom-[12px] z-10 justify-center items-center py-[6px] px-[16px] rounded-full text-label-medium text-[#1D1B1F] bg-[#F3EDF7]"
        >
          Linkedin
        </Link>
      </div>
      <div className="px-[12px] space-y-[4px]">
        <p className="text-title-medium text-on-surface">{name}</p>
        <span className="text-body-medium text-outline">{description}</span>
      </div>
    </div>
  );
};

import { FC } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { PartnerCardProps } from './types';

export const PartnerCard: FC<PartnerCardProps> = ({
  image,
  title,
  description,
  location,
  href,
}) => {
  return (
    <div className="flex gap-[16px] items-center py-[8px] pr-[16px] pl-[8px] border-2 border-surface-container rounded-large">
      <Image
        src={image}
        alt=""
        width={150}
        height={150}
        className="object-cover"
      />
      <div className="flex flex-col justify-between py-[8px] h-full">
        <div className="">
          <h6 className="text-title-medium text-on-surface">{title}</h6>
          <p className="text-body-small text-outline">{description}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-label-medium-prominent text-on-surface">
            {location}
          </p>
          <Link
            href={href}
            target="_blank"
            className="inline-flex justify-center items-center px-[12px] h-[32px] text-label-medium text-[#1D1B1F] rounded-small bg-[#F3EDF7]"
          >
            Website
          </Link>
        </div>
      </div>
    </div>
  );
};

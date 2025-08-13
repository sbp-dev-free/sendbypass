import { FC } from 'react';

import Image from 'next/image';
import { Layout as AntLayout } from 'antd';

import { StaticPageFrameProps } from './types';

export const StaticPageFrame: FC<StaticPageFrameProps> = ({
  title,
  children = '',
  className,
}) => {
  return (
    <AntLayout className="min-h-screen bg-[#FEF7FF] pb-16 sm:pb-0 container mx-auto m-4">
      <div
        className={`bg-white rounded-medium p-[12px] md:p-[16px] space-y-[32px] ${className}`}
      >
        <div className="space-y-[12px]">
          <div className="text-title-large md:text-display-medium text-on-surface">
            {title}
          </div>
        </div>{' '}
        <Image
          src="/img/static-pages/dots.svg"
          width={83}
          height={29}
          alt="dots"
        />
        {children}
      </div>
    </AntLayout>
  );
};

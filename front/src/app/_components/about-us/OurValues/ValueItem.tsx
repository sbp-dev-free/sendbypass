import { FC } from 'react';

import { ValueItemProps } from './types';

export const ValueItem: FC<ValueItemProps> = ({
  number,
  title,
  description,
}) => {
  return (
    <div className="flex gap-[8px] items-start">
      <h3 className="text-display-small text-[#65558F29]">0{number}.</h3>
      <div>
        <div className="flex items-center h-[44px]">
          <h3 className="text-title-medium">{title}</h3>
        </div>
        <p className="text-body-large text-[#49454F]">{description}</p>
      </div>
    </div>
  );
};

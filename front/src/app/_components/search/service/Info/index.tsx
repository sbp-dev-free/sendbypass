import { FC } from 'react';
import { Radio } from 'antd';
import Text from 'antd/es/typography/Text';
import clsx from 'clsx';
import z from 'zod';
import { RiSuitcase2Line } from 'react-icons/ri';
import { FaRegFileAlt } from 'react-icons/fa';
import { MdOutlineShoppingBag } from 'react-icons/md';
import { DEFAULT_CURRENCY } from '@/app/_dtos/currency';

export const ServiceTypeSchema = z.enum(['Cargo', 'DOCUMENTS', 'SHOPPING']);

interface ServiceInfoProps {
  type: string;
  onClick?: () => void;
  isSelected?: boolean;
  service?: any;
}

const ServiceInfo: FC<ServiceInfoProps> = ({
  type,
  service = undefined,
  onClick = () => {},
  isSelected = false,
}) => {
  return (
    <div
      className={clsx('w-full h-[48px] lg:h-[134px] lg:w-[110px]', {
        hidden: !service,
      })}
    >
      <button
        type="button"
        className={clsx(
          'relative bg-white pl-8 lg:pt-1 lg:pl-0 flex flex-row items-center overflow-hidden lg:flex-col w-full h-full cursor-pointer transition-all duration-300 ease-in-out transform rounded-xl shadow-sm',
          {
            'border border-[#ECE6EE]': !isSelected,
            'border-2 border-[#67548E]': isSelected,
          },
        )}
        onClick={() => {
          if (!service) {
            return;
          }
          if (onClick) {
            onClick();
          }
        }}
      >
        <Radio
          checked={isSelected}
          onChange={() => {
            if (onClick) {
              onClick();
            }
          }}
          className="absolute left-2 inset-y-0 lg:top-2 lg:inset-y-auto"
        />
        <div className="flex lg:flex-col items-center justify-between grow gap-2 w-full mr-2 mt-0 lg:mt-0.5 lg:mr-0 whitespace-nowrap">
          <div className="flex lg:flex-col items-center gap-2">
            {type === 'Cargo' && (
              <RiSuitcase2Line size={20} className="lg:mx-auto" />
            )}
            {type === 'Document' && (
              <FaRegFileAlt size={20} className="lg:mx-auto" />
            )}
            {type === 'Shopping' && (
              <MdOutlineShoppingBag size={20} className="lg:mx-auto" />
            )}
            <Text
              className={clsx('text-sm font-bold block', {
                'text-[#67548E]': isSelected,
                'text-[#49454E]': !isSelected,
              })}
            >
              {type}
            </Text>
          </div>
          <div className="flex items-center gap-1">
            <Text className="text-sm text-[#7A757F] font-semibold">
              {service?.properties.weight === 0 ? 'Under' : 'Up to'}{' '}
            </Text>
            <Text className="text-sm text-[#49454E] font-semibold">
              {service?.properties.weight === 0
                ? '1'
                : service?.properties.weight}{' '}
              kg
            </Text>
          </div>
        </div>
        <div className="bg-[#ECE6EE] w-1/2 lg:w-full lg:mt-2 h-full flex items-center justify-center flex-row lg:flex-col gap-1 lg:gap-0">
          <Text className="text-[#7A757F] font-semibold block text-[11px]">
            Per Kilo
          </Text>
          <Text
            className={clsx('font-semibold text-[14px]', {
              'text-[#67548E]': isSelected,
              'text-[#7A757F]': !isSelected,
            })}
          >
            {DEFAULT_CURRENCY.symbol}
            {service?.cost.wage}
          </Text>
        </div>
      </button>
    </div>
  );
};

export default ServiceInfo;

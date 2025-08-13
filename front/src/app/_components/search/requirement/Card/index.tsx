import { FC, useState } from 'react';
import { List, Button, Typography, Divider } from 'antd';
import { useToggle } from 'react-use';
import Requirement from '@/app/_dtos/requirement';
import { getToken } from '@/app/_utils/token';
import { useRouter } from 'next/navigation';
import { BiChevronDown } from 'react-icons/bi';
import clsx from 'clsx';
import { DEFAULT_CURRENCY } from '@/app/_dtos/currency';
import RequirementInfo from '../Info';
import RequirementModal from '../Modal';

interface RequirementCardProps {
  requirement: Requirement;
}

const RequirementCard: FC<RequirementCardProps> = ({ requirement }) => {
  const [isModalVisible, toggleIsModalVisible] = useToggle(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDescription, setIsOpenDescription] = useState(false);

  const isLoggedIn = getToken('access');
  const { push } = useRouter();
  const handleSelectTrip = () => {
    setIsLoading(true);
    if (isLoggedIn) {
      toggleIsModalVisible(true);
    } else {
      const currentUrl = window.location.pathname;
      const encodedReturnUrl = encodeURIComponent(currentUrl);
      push(`/login?redirectUrl=${encodedReturnUrl}`);
    }
    setIsLoading(false);
  };

  return (
    <>
      <RequirementModal
        onClose={() => toggleIsModalVisible(false)}
        requirement={requirement}
        visible={isModalVisible}
      />

      <List.Item className="flex flex-col items-start rounded-lg bg-white mb-3">
        <RequirementInfo requirement={requirement} />
        <Divider className="border-[#ECE6EE]" />
        <div className="flex  gap-4 w-full justify-between">
          <Button
            className={clsx('text-[#49454E] font-bold px-0', {
              invisible: !requirement.comment,
            })}
            type="link"
            onClick={() => {
              setIsOpenDescription(!isOpenDescription);
            }}
            icon={
              <BiChevronDown
                size={20}
                className={clsx('transition-transform duration-300', {
                  'rotate-180': isOpenDescription,
                })}
              />
            }
            iconPosition="end"
            size="large"
          >
            Description
          </Button>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="font-bold text-[#7A7580]">Reward</div>
              <div className="font-extrabold text-[#67548E]">
                {DEFAULT_CURRENCY.symbol}
                {requirement.cost.wage ?? 0}
              </div>
            </div>
            <Button
              className="w-full lg:w-auto"
              onClick={handleSelectTrip}
              size="large"
              type="primary"
              loading={isLoading}
            >
              Select
            </Button>
          </div>
        </div>
        <div
          className={`overflow-hidden transition-all duration-150 ${isOpenDescription ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <Typography className="text-sm text-gray-800">
            {requirement.comment}
          </Typography>
        </div>
      </List.Item>
    </>
  );
};

export default RequirementCard;

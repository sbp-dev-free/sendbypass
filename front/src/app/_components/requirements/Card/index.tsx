import { FC, useState } from 'react';
import {
  List,
  Divider,
  Button,
  Image,
  message,
  Badge,
  Tag,
  Modal,
  Typography,
} from 'antd';
import Text from 'antd/es/typography/Text';
import { FaPlaneDeparture } from 'react-icons/fa';
import { HiArrowNarrowRight } from 'react-icons/hi';
import { MdOutlineCalendarMonth } from 'react-icons/md';
import { BiMessageSquareDots } from 'react-icons/bi';
import Requirement from '@/app/_dtos/requirement';
import { useRouter } from 'next/navigation';
import { getStatusColor } from '@/app/_utils/statusColor';
import axios from 'axios';
import URLS from '@/app/_configs/urls';
import { injectAccessToken } from '@/app/_utils/fetcher';
import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { DEFAULT_CURRENCY } from '@/app/_dtos/currency';

interface RequirementCardProps {
  requirement: Requirement;
  mutate?: () => void;
}

const RequirementCard: FC<RequirementCardProps> = ({
  requirement,
  mutate = () => {},
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleLoading, setVisibleIsLoading] = useState(false);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleEditRequirement = () => {
    if (requirement.type === 'SHIPPING') {
      router.push(`/requirements/shipping/${requirement.id}/edit`);
    } else {
      router.push(`/requirements/shopping/${requirement.id}/edit`);
    }
  };

  const handleDeleteRequirement = async () => {
    setIsLoading(true);
    const newConfig = await injectAccessToken(true);
    if (!newConfig) {
      messageApi.error('service: failed to inject access token');
      return;
    }
    try {
      await axios.delete(URLS.requirement(String(requirement.id)), newConfig);
      messageApi.success('Successfull deleted');
      mutate?.();
      setIsModalOpen(false);
    } catch (error: any) {
      messageApi.error(JSON.parse(error?.response?.data?.detail).message);
    }
    setIsLoading(false);
  };

  const handleToggleVisibility = async () => {
    setVisibleIsLoading(true);
    const newConfig = await injectAccessToken(true);
    if (!newConfig) {
      messageApi.error('service: failed to inject access token');
      return;
    }
    try {
      await axios.patch(
        URLS.requirement(String(requirement.id)),
        { visible: !requirement.visible },
        newConfig,
      );
      messageApi.success('Successfull edited');
      mutate?.();
    } catch (error: any) {
      messageApi.error('Something wrong happened.');
    }
    setVisibleIsLoading(false);
  };

  return (
    <>
      {contextHolder}
      <Badge.Ribbon
        text={requirement.type}
        color="purple"
        placement="start"
        className="mt-4"
      >
        <Badge.Ribbon
          text={requirement.status}
          color={getStatusColor(requirement.status as string)}
          placement="start"
          className="-mt-4"
        />
        <List.Item className="flex flex-col items-center gap-4 lg:flex-row bg-white rounded-md mb-4">
          <div className="flex flex-col gap-4 lg:justify-center w-full lg:w-[320px]">
            <div className="flex flex-row gap-2 items-center mt-3 pl-16">
              <Tag
                color="processing"
                className="text-xs font-semibold"
                bordered={false}
              >
                {requirement.properties.type === 'ELECTRONIC_GADGET'
                  ? 'Electronic Gadget'
                  : requirement.properties.type}
              </Tag>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-row gap-2 items-center">
                <MdOutlineCalendarMonth />
                Flight date:{' '}
                {new Date(requirement.destination.to).toLocaleDateString()}
              </div>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <FaPlaneDeparture />
              {requirement.source.location_data.city}{' '}
              {requirement.source.location_data.country} <HiArrowNarrowRight />{' '}
              {requirement.destination.location_data.city}{' '}
              {requirement.destination.location_data.country}
            </div>
          </div>

          <Divider
            className="hidden lg:block h-24 border-l-3 border-dashed border-slate-400"
            type="vertical"
          />
          <div className="flex gap-4 lg:w-1/2">
            <Image
              fallback="data:image/png;base64,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"
              height={100}
              width={100}
              src={requirement.image as unknown as string}
            />

            <div className="flex flex-col grow lg:px-8 py-1 self-start">
              <div className="flex w-full flex-wrap justify-between mb-2">
                <div>
                  <Text type="secondary">Title:</Text> {requirement.name}
                </div>
                <div>
                  <Text type="secondary">Weight:</Text>{' '}
                  {`${requirement.properties.weight} (kg)`}
                </div>
                <div>
                  <Text type="secondary">Price:</Text>{' '}
                  {`${requirement.cost.wage} (${DEFAULT_CURRENCY.symbol})`}
                </div>
              </div>

              {Boolean(requirement.comment) && (
                <div className="max-w-[500px]">
                  <Text type="secondary">Description:</Text>{' '}
                  {requirement.comment}
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-auto flex justify-center flex-wrap lg:justify-start lg:flex-col gap-4">
            <Button
              type="default"
              icon={
                requirement.visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
              className="w-full sm:w-auto"
              onClick={handleToggleVisibility}
              loading={isVisibleLoading}
            >
              {requirement.visible ? 'Visible' : 'Invisible'}
            </Button>
            <Button
              type="default"
              icon={<BiMessageSquareDots />}
              className="text-[#67548E] border-[#67548E] flex justify-center items-center w-full sm:w-auto"
              onClick={handleEditRequirement}
            >
              Edit
            </Button>
            <Button
              type="default"
              className="bg-[#BF0027] text-white w-full sm:w-auto"
              icon={<DeleteOutlined />}
              loading={isLoading}
              onClick={() => setIsModalOpen(true)}
            >
              Delete
            </Button>
          </div>
        </List.Item>
      </Badge.Ribbon>
      <Modal
        open={isModalOpen}
        centered
        onCancel={() => setIsModalOpen(false)}
        cancelButtonProps={{ className: 'hidden' }}
        okButtonProps={{ className: 'hidden' }}
        closable={false}
      >
        <div className="flex flex-col gap-4">
          <Typography className="text-lg font-bold text-[#1D1B20]">
            Delete Requirements
          </Typography>
          <Typography className="text-sm text-[#7A757F]">
            Deleting this requirements will remove all associated bookings and
            plans. Are you sure you want to continue?
          </Typography>
          <div className="flex gap-4">
            <Button
              type="primary"
              size="large"
              className="w-full lg:w-auto"
              onClick={handleDeleteRequirement}
            >
              Delete
            </Button>
            <Button
              type="primary"
              size="large"
              className="bg-[#65558F14] text-[#67548E] w-full lg:w-auto"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RequirementCard;

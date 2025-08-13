import { FC, useEffect, useState } from 'react';
import { useToggle } from 'react-use';
import { useImmer } from 'use-immer';
import { List, Button, Empty, Typography, Divider, Badge, message } from 'antd';
import Service from '@/app/_dtos/service';
import { PiPushPinBold, PiPushPinFill } from 'react-icons/pi';
import { BiChevronDown, BiMessageSquareDots } from 'react-icons/bi';
import { getToken } from '@/app/_utils/token';
import Link from 'next/link';
import { getStatusColor } from '@/app/_utils/statusColor';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import URLS from '@/app/_configs/urls';
import axios from 'axios';
import { injectAccessToken } from '@/app/_utils/fetcher';
import { TripType } from '@/app/_dtos/newTrip';
import ServiceModal from '../../service/Modal';
import TripInfo from '../Info';
import ServiceInfo from '../../service/Info';

interface TripCardProps {
  trip: TripType;
  isPinned?: boolean;
  isMyOwnTrip?: boolean;
  onPinToggle?: (tripId: number) => void;
  mutate?: () => void;
}

const typeMapper = (type: string) => {
  const [tripType, serviceType] = type.split(':');

  if (serviceType === 'visible_load') {
    switch (tripType) {
      case 'shipping':
        return 'Cargo';
      case 'shopping':
        return 'Shopping';
      default:
        return '';
    }
  }
  return 'Document';
};

const TripCard: FC<TripCardProps> = ({
  trip,
  isPinned = false,
  isMyOwnTrip = false,
  onPinToggle = () => {},
  mutate = () => {},
}) => {
  const [isOpenDescription, setIsOpenDescription] = useState(false);
  const [isVisibleLoading, setVisibleIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const { services: servicesList } = trip;
  const isLoggedIn: boolean = Boolean(getToken('access'));
  const servicesArray = servicesList ? Object.entries(servicesList) : [];

  const services = servicesArray.map((service: any) => {
    return {
      type: typeMapper(service[0]),
      service: {
        id: service[1].id,
        properties: service[1].properties,
        cost: service[1].cost,
        description: service[1].description,
      },
    };
  });

  const [selectedService, setSelectedService] = useImmer<string | undefined>(
    undefined,
  );
  const [isModalVisible, toggleIsModalVisible] = useToggle(false);
  const selectedServiceDetails = services.find(
    ({ type }) => type === selectedService,
  );
  const noValidServices = services.every(
    ({ service }) => service === undefined,
  );

  useEffect(() => {
    const validServices = services.filter(
      ({ service }) => service !== undefined,
    );

    if (validServices.length > 0) {
      setSelectedService(validServices[0].type);
    }
  }, []);

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

  const handleToggleVisibility = async () => {
    setVisibleIsLoading(true);
    const newConfig = await injectAccessToken(true);
    if (!newConfig) {
      messageApi.error('service: failed to inject access token');
      return;
    }
    try {
      await axios.patch(
        URLS.trip(String(trip.id)),
        { visible: !trip.visible },
        newConfig,
      );
      messageApi.success('Successfull edited');
      mutate?.();
    } catch (error: any) {
      messageApi.error('Something wrong happened.');
    }
    setVisibleIsLoading(false);
  };

  const handleDeleteTrip = async () => {
    setIsDeleteLoading(true);
    const newConfig = await injectAccessToken(true);
    if (!newConfig) {
      messageApi.error('service: failed to inject access token');
      return;
    }
    try {
      await axios.delete(URLS.trip(String(trip.id)), newConfig);
      messageApi.success('Successfull deleted');
      mutate?.();
    } catch (error: any) {
      messageApi.error(JSON.parse(error?.response?.data?.detail).message);
    }
    setIsDeleteLoading(false);
  };

  return (
    <Badge.Ribbon
      text={trip.status}
      placement="start"
      className={clsx('text-xs py-px font-medium', { hidden: !isMyOwnTrip })}
      color={getStatusColor(trip.status)}
    >
      {contextHolder}
      {selectedService !== undefined && (
        <ServiceModal
          onClose={() => toggleIsModalVisible(false)}
          service={
            services.find((s) => s.type === selectedService)?.service as Service
          }
          trip={trip}
          type={selectedService}
          visible={isModalVisible}
        />
      )}
      <List.Item className="block rounded-lg bg-white mb-3">
        <div className="flex flex-col lg:flex-row justify-start lg:justify-between gap-6">
          <TripInfo trip={trip} />
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col md:flex-row w-full h-full gap-4">
              <div className="relative flex flex-col lg:flex-row gap-2 items-center lg:justify-end w-full">
                {noValidServices ? (
                  <Empty description="No Services Available" />
                ) : (
                  services.map(({ type, service }) => (
                    <ServiceInfo
                      key={type}
                      isSelected={Boolean(selectedService === type)}
                      onClick={() => setSelectedService(type)}
                      type={type ?? ''}
                      service={service}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        <Divider className="border-[#ECE6EE]" />
        <div className="flex items-center justify-between">
          <Button
            className="text-[#49454E] font-bold px-0"
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

          {!isMyOwnTrip ? (
            <div className="flex items-center gap-3">
              {!isPinned ? (
                <PiPushPinBold
                  size={24}
                  className="cursor-pointer  text-[#67548E]"
                  onClick={() => onPinToggle(trip.id)}
                />
              ) : (
                <PiPushPinFill
                  size={24}
                  className="cursor-pointer  text-[#67548E]"
                  onClick={() => onPinToggle(trip.id)}
                />
              )}

              <Button
                className="bg-[#67548E] text-white w-full lg:w-auto flex justify-center items-center disabled:bg-gray-100 disabled:text-gray-300"
                onClick={handleSelectTrip}
                size="large"
                loading={isLoading}
              >
                Select
              </Button>
            </div>
          ) : (
            <div className="block space-y-3 md:space-y-0 md:flex items-center  gap-3">
              <Button
                type="default"
                size="large"
                icon={trip.visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                className="w-full sm:w-auto"
                onClick={handleToggleVisibility}
                loading={isVisibleLoading}
              >
                {trip.visible ? 'Visible' : 'Invisible'}
              </Button>
              <Link href={`/trips/${trip.id}/services/edit`} className="w-full">
                <Button
                  size="large"
                  className="text-[#67548E] border-[#67548E] flex justify-center items-center w-full"
                  icon={<BiMessageSquareDots />}
                >
                  Edit
                </Button>
              </Link>
              <Button
                size="large"
                className="bg-[#BF0027] text-white flex justify-center items-center w-full"
                icon={<DeleteOutlined />}
                loading={isDeleteLoading}
                onClick={handleDeleteTrip}
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        <div
          className={`overflow-hidden transition-all duration-150 ${isOpenDescription ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <Typography className="text-sm text-gray-800">
            {selectedServiceDetails?.service?.description}
          </Typography>
        </div>
      </List.Item>
    </Badge.Ribbon>
  );
};

export default TripCard;

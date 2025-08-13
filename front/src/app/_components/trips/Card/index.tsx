import { FC, useEffect } from 'react';
import Trip from '@/app/_dtos/trip';
import { List, Divider, Button, message, Tag, Empty, Typography } from 'antd';
import Text from 'antd/es/typography/Text';
import { FaPlaneDeparture, FaHashtag } from 'react-icons/fa';
import { BsSend } from 'react-icons/bs';
import { HiArrowNarrowRight } from 'react-icons/hi';
import { MdOutlineCalendarMonth } from 'react-icons/md';
import { BiMessageSquareDots } from 'react-icons/bi';
import Link from 'next/link';
import { getStatusColor } from '@/app/_utils/statusColor';
import { useImmer } from 'use-immer';
import ServiceInfo from '../../search/service/Info';

interface TripCardProps {
  trip: Trip;
}

const typeMapper = (type: string) => {
  const [tripType, serviceType] = type.split(':');

  if (serviceType === 'visible_load') {
    return tripType === 'shipping' ? 'Cargo' : 'Documents';
  }
  return tripType === 'shipping' ? 'Shopping' : 'Documents';
};

const TripCard: FC<TripCardProps> = ({ trip }) => {
  const { services: servicesList } = trip;

  const servicesArray = servicesList ? Object.entries(servicesList) : [];

  const services = servicesArray.map((service) => {
    return {
      type: typeMapper(service[0]),
      service: {
        properties: service[1].properties,
        cost: service[1].cost,
        description: service[1].description,
      },
    };
  });
  const [selectedService, setSelectedService] = useImmer<any | null>(null);
  const selectedServiceDetails = services.find(
    ({ type }) => type === selectedService,
  );

  useEffect(() => {
    const validServices = services.filter(
      ({ service }) => service !== undefined,
    );
    if (validServices.length > 0 && selectedService === null) {
      setSelectedService(validServices[0].type);
    }
  }, [services, setSelectedService, selectedService]);

  const noValidServices = services.every(
    ({ service }) => service === undefined,
  );
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <>
      {contextHolder}
      <List.Item className="flex flex-col items-start xl:items-center gap-4 xl:flex-row bg-white rounded-md mb-4">
        <div className="flex flex-col gap-4 justify-center w-full md:w-[440px]">
          <div className="flex flex-row gap-2 items-center">
            <FaHashtag />
            <Text>{trip.id}</Text>

            <Tag
              color={getStatusColor(trip.status)}
              className="text-xs font-semibold"
              bordered={false}
            >
              {trip.status}
            </Tag>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-row gap-2 items-center">
              <MdOutlineCalendarMonth />
              Flight date:{' '}
              {new Date(trip.flight.destination.to).toLocaleDateString()}
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <FaPlaneDeparture />
            {trip.flight.source.location_data.city}{' '}
            {trip.flight.source.location_data.country} <HiArrowNarrowRight />{' '}
            {trip.flight.destination.location_data.city}{' '}
            {trip.flight.destination.location_data.country}
          </div>
        </div>

        <Divider
          className="hidden xl:block h-24 border-l-3 border-dashed border-slate-400"
          type="vertical"
        />

        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-24 w-full">
          <div className="w-full">
            <div className="flex flex-col md:flex-row w-full h-full gap-4">
              <div className="relative flex flex-col xl:w-auto">
                {noValidServices ? (
                  <Empty description="No Services Available" />
                ) : (
                  services.map(({ type, service }) => (
                    <ServiceInfo
                      key={type}
                      isSelected={selectedService === type}
                      onClick={() => setSelectedService(type)}
                      type={type}
                      service={service}
                    />
                  ))
                )}
              </div>
              {selectedServiceDetails?.service?.description ? (
                <div className="w-full xl:w-1/2 border border-solid border-gray-200 p-2 bg-gray-50 rounded-lg shadow-sm transition-transform duration-500 ease-in-out transform">
                  <Typography className="text-sm font-semibold text-gray-800 line-clamp-[7]">
                    {selectedServiceDetails?.service?.description}
                  </Typography>
                </div>
              ) : (
                <div className="flex justify-center w-full">
                  <Empty description="No description is available" />
                </div>
              )}
            </div>
          </div>
          <div className="w-full lg:w-auto flex justify-center lg:justify-start lg:flex-col gap-4">
            <Link href={`/trips/${trip.id}/services/edit`}>
              <Button
                className="text-violet-600 border-violet-600 flex justify-center items-center w-full"
                icon={<BiMessageSquareDots />}
              >
                Edit
              </Button>
            </Link>
            <Button
              className="bg-rose-500 text-white flex justify-center items-center w-full md:w-auto"
              icon={<BsSend />}
              onClick={() =>
                messageApi.success(
                  'Admins have been notified for deleting your trip.',
                )
              }
            >
              Delete
            </Button>
          </div>
        </div>
      </List.Item>
    </>
  );
};

export default TripCard;

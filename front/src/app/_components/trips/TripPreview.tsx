'use client';

import { Button, message, Switch, Table, Tooltip } from 'antd';
import Image from 'next/image';
import { Key, useState } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import { CiCircleAlert } from 'react-icons/ci';
import dayjs from 'dayjs';
import useFetcher from '@/app/_hooks/useFetcher';
import { AirportResultType } from '@/app/_dtos/airport';
import URLS from '@/app/_configs/urls';
import { injectAccessToken } from '@/app/_utils/fetcher';
import { cleanObject } from '@/app/_utils/cleanObject';
import readFile from '@/app/_utils/file';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { DEFAULT_CURRENCY } from '@/app/_dtos/currency';
import { TripFormDataType } from './types';

const columns = [
  {
    title: 'Services',
    dataIndex: 'services',
  },
  {
    title: <span className="text-nowrap">Max weight</span>,
    dataIndex: 'max_weight',
    render: (text: any) => (
      <span className="text-sm font-medium">
        {text} <sub className="text-[#7A757F]">kg</sub>
      </span>
    ),
  },
  {
    title: 'Fee',
    dataIndex: 'fee',
    render: (text: any) => (
      <span className="text-sm font-medium">
        {DEFAULT_CURRENCY.symbol}
        {text}
      </span>
    ),
  },
  {
    title: 'Description',
    dataIndex: 'description',
  },
];

const serviceLabelMapper = (type: string | undefined) => {
  const serviceType = type?.split(':')[0];
  const service = type?.split(':')[1];
  if (serviceType === 'shipping') {
    return service === 'visible_load' ? 'Cargo' : 'Documents';
  }
  return service === 'visible_load' ? 'Shopping' : 'Documents';
};

export const TripPreview = ({
  flight,
  services,
  description,
  image,
  onClose,
}: TripFormDataType) => {
  const [isPrivate, setIsPrivate] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const { tripId } = useParams();

  const { push } = useRouter();

  const { data: airportsResponse } = useFetcher<AirportResultType>({
    url: URLS.airports(),
    isProtected: true,
  });

  const airports = airportsResponse?.results || [];

  const tripFromData = {
    originAirport: airports.find(
      (airport) => airport.location.id === +flight?.source?.location,
    ),
    destinationAirport: airports.find(
      (airport) => airport.location.id === +flight?.destination?.location,
    ),
    airline: flight?.airline,
    flightNumber: flight?.number,
    departureDate: flight?.source?.to,
    arrivalDate: flight?.destination?.to,
    description: flight?.description,
    ticketNumber: flight?.ticket_number,
  };

  const [expandedRowKeys, setExpandedRowKeys] = useState<Key[] | undefined>();
  const [showDescription, setShowDescription] = useState(false);
  const data = services
    ? Object.keys(services).map((key) => {
        return {
          key,
          services: serviceLabelMapper(key),
          max_weight:
            services[`${key}`].properties.weight === 'Under 1kg'
              ? '< 1'
              : services[`${key}`].properties.weight,
          fee: (
            <span className="text-nowrap">
              {services[`${key}`].cost.wage}{' '}
              <sub className="text-[#7A7580] text-nowrap">
                {serviceLabelMapper(key) === 'Documents'
                  ? 'Per Box'
                  : 'Per Kilo'}
              </sub>
            </span>
          ),
          description: (
            <Button type="text" onClick={() => setExpandedRowKeys([key])}>
              Show
            </Button>
          ),
          collapseData: services[key].description,
        };
      })
    : [];

  const imageUrl =
    tripId && !Array.isArray(image)
      ? image
      : image && image[0] && image[0].originFileObj
        ? URL.createObjectURL(image[0].originFileObj)
        : '';

  const onPublish = async () => {
    const newConfig = await injectAccessToken(true);
    if (!newConfig) {
      return;
    }

    const formData = new FormData();
    const data = cleanObject({
      flight: {
        source: {
          location: flight.source.location,
          to: dayjs(flight.source.to).format('YYYY-MM-DD'),
        },
        destination: {
          location: flight.destination.location,
          to: dayjs(flight.destination.to).format('YYYY-MM-DD'),
        },
        airline: flight.airline,
        number: flight.number,
      },
      services,
      description,
    });
    if (services && Object.keys(services).length !== 0) {
      const updatedServices = JSON.parse(JSON.stringify(services));
      if (
        updatedServices['shipping:document']?.properties?.weight === 'Under 1kg'
      ) {
        updatedServices['shipping:document'].properties.weight = '0';
      }

      formData.append('services', JSON.stringify(updatedServices));
    }
    if (Object.keys(data.flight).length !== 0) {
      formData.append('flight', JSON.stringify(data.flight));
    }
    if (flight.ticket_number) {
      formData.append('ticket_number', flight.ticket_number);
    }
    if (data.description) {
      formData.append('description', data.description);
    }

    if (isPrivate !== undefined) {
      formData.append('visible', String(isPrivate));
    }

    if (image) {
      const imageFile: File = image[0].originFileObj;

      try {
        const imageBlob = await readFile(imageFile);

        formData.append('image', imageBlob, imageFile.name);
      } catch (e) {
        console.error(e);
      }
    }
    if (tripId) {
      try {
        await axios.patch(URLS.trip(String(tripId)), formData, newConfig);
        push('/trips');
      } catch (error) {
        messageApi.error('Something wrong happened');
      } finally {
        onClose();
      }
    } else {
      try {
        await axios.post(URLS.trips(), formData, newConfig);
        push('/trips');
      } catch (error) {
        messageApi.error('Something wrong happened');
      } finally {
        onClose();
      }
    }
  };

  return (
    <>
      {contextHolder}
      <div className="w-full space-y-12">
        <div className="pt-3 xl:pt-0 mt-2 flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="order-2 lg:order-1 flex items-start gap-3">
            <div className="size-[90px] lg:size-[140px] relative">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  fill
                  alt="ticket"
                  className="rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-[#CBC4CF] rounded-lg" />
              )}
            </div>
            <div className="lg:hidden block space-y-4">
              <div className="space-y-0.5">
                <div className="text-[#7A757F] text-xs">Airline</div>
                {tripFromData.airline && (
                  <div className="text-[#1D1B20] text-sm font-medium">
                    {tripFromData.airline}
                  </div>
                )}
              </div>
              <div className="space-y-0.5">
                <div className="text-[#7A757F] text-xs">
                  Flight /Ticket Number
                </div>
                {tripFromData.flightNumber && tripFromData.ticketNumber ? (
                  <div className="text-[#1D1B20] text-sm font-medium">
                    {tripFromData.flightNumber}/{tripFromData.ticketNumber}
                  </div>
                ) : (
                  <div className="text-[#1D1B20] text-sm font-medium">
                    -----/-----
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-24 gap-y-6 order-1 lg:order-2">
            <div className="space-y-0.5">
              <div className="text-[#7A757F] text-xs">Origin airport</div>
              {tripFromData.originAirport?.id ? (
                <>
                  <div className="text-[#1D1B20] text-sm font-medium">
                    {tripFromData.originAirport?.name} (
                    {tripFromData.originAirport?.iata_code})
                  </div>
                  <div className="text-[#1D1B20] text-xs">
                    {tripFromData.originAirport?.location.country},
                    {tripFromData.originAirport?.location.city} |{' '}
                    {dayjs(tripFromData.departureDate).format('DD MMM, YYYY')}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-[#1D1B20] text-sm font-medium">
                    --------------------
                  </div>
                  <div className="text-[#1D1B20] text-sm font-medium">
                    --------------------
                  </div>
                </>
              )}
            </div>

            <div className="space-y-0.5">
              <div className="text-[#7A757F] text-xs">Destination airport</div>
              {tripFromData.destinationAirport?.id ? (
                <>
                  <div className="text-[#1D1B20] text-sm font-medium">
                    {tripFromData.destinationAirport?.name} (
                    {tripFromData.destinationAirport?.iata_code})
                  </div>
                  <div className="text-[#1D1B20] text-xs">
                    {tripFromData.destinationAirport?.location.country},
                    {tripFromData.destinationAirport?.location.city} |{' '}
                    {dayjs(tripFromData.arrivalDate).format('DD MMM, YYYY')}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-[#1D1B20] text-sm font-medium">
                    --------------------
                  </div>
                  <div className="text-[#1D1B20] text-sm font-medium">
                    --------------------
                  </div>
                </>
              )}
            </div>
            <div className="space-y-0.5 hidden lg:block">
              <div className="text-[#7A757F] text-xs">
                Flight /Ticket Number
              </div>
              {tripFromData.flightNumber ? (
                <div className="text-[#1D1B20] text-sm font-medium">
                  {tripFromData.flightNumber}/{tripFromData.ticketNumber}
                </div>
              ) : (
                <div className="text-[#1D1B20] text-sm font-medium">
                  -------/----------------
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto lg:overflow-visible">
          <Table
            expandable={{
              expandedRowRender: (record) => record.collapseData,
              showExpandColumn: false,
              expandRowByClick: false,
              expandedRowKeys,
            }}
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
            className="w-full"
            scroll={{ x: 'max-content' }}
            rowClassName="border-b border-[#ECE6EE]"
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <Switch checked={isPrivate} onChange={setIsPrivate} />
          <Tooltip title="This trip is strictly for information purposes and is private.When the switch is off, the trip is visible to all users.">
            <div className="flex items-center gap-1">
              <span className="text-sm text-[#49454E] font-medium">Public</span>
              <CiCircleAlert size={20} />
            </div>
          </Tooltip>
          <Button
            className="text-[#49454E] text-sm font-medium px-0"
            type="link"
            icon={
              <BiChevronDown
                size={20}
                className={`transition-transform duration-200 ${
                  showDescription ? 'rotate-180' : 'rotate-0'
                }`}
              />
            }
            iconPosition="end"
            size="large"
            onClick={() => setShowDescription(!showDescription)}
            disabled={!description}
          >
            Description
          </Button>
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <Button
            type="primary"
            size="large"
            className="bg-transparent text-[#67548E] w-full lg:w-auto"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            className="w-full lg:w-auto"
            onClick={onPublish}
            disabled={!imageUrl}
          >
            Publish trip
          </Button>
        </div>
      </div>
      {showDescription && (
        <div className="w-full mt-4">
          <p className="text-[#7A757F] text-sm">{description}</p>
        </div>
      )}
    </>
  );
};

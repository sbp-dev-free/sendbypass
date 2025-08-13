import {
  Badge,
  Button,
  Divider,
  message,
  Modal,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import Image from 'next/image';

import '@/app/styles/table.Module.css';
import { CiCircleAlert } from 'react-icons/ci';
import { BiChevronDown } from 'react-icons/bi';
import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { TripType } from '@/app/_dtos/newTrip';
import { getStatusColor } from '@/app/_utils/statusColor';
import dayjs from 'dayjs';
import { useState } from 'react';
import URLS from '@/app/_configs/urls';
import axios from 'axios';
import { injectAccessToken } from '@/app/_utils/fetcher';
import { DEFAULT_CURRENCY } from '@/app/_dtos/currency';

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

export const Trip = ({
  trip,
  mutate,
}: {
  trip: TripType;
  mutate: () => void;
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const [visible, setVisible] = useState(trip.visible);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKey, setSelectedRowKey] = useState<string>('');

  const tripTableData = trip.services
    ? Object.keys(trip.services).map((key) => ({
        key,
        services: <div className="capitalize">{serviceLabelMapper(key)}</div>,
        max_weight:
          Number(trip.services[`${key}`].properties.weight) === 0
            ? '< 1'
            : trip.services[`${key}`].properties.weight,
        fee: (
          <span className="text-nowrap">
            {trip.services[`${key}`].cost.wage}{' '}
            <sub className="text-[#7A7580] text-nowrap">
              {serviceLabelMapper(key) === 'Documents' ? 'Per Box' : 'Per Kilo'}
            </sub>
          </span>
        ),
        description: (
          <Button type="text" onClick={() => setSelectedRowKey(key.toString())}>
            Show
          </Button>
        ),
      }))
    : [];

  const handleUpdateTripVisibility = async () => {
    const newConfig = await injectAccessToken(true);
    if (!newConfig) {
      return;
    }
    try {
      await axios.patch(
        URLS.trip(String(trip.id)),
        { visible: !trip.visible },
        newConfig,
      );
      messageApi.success('Trip visibility updated successfully!');
      setVisible(!visible);
      mutate();
    } catch (error) {
      console.error('Error updating trip visibility:', error);
    }
  };

  const handleDeleteTrip = async () => {
    const newConfig = await injectAccessToken(true);
    if (!newConfig) {
      return;
    }
    try {
      await axios.delete(URLS.trip(String(trip.id)), newConfig);
      messageApi.success('Trip deleted successfully!');
      mutate();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  return (
    <Badge.Ribbon
      text={<div className="capitalize">{trip.status.toLowerCase()}</div>}
      placement="start"
      color={getStatusColor(trip.status)}
    >
      {contextHolder}
      <div className="p-4 rounded-xl border border-[#ECE6EE] mb-3 relative">
        <Tag
          className="absolute top-2 left-20 z-10 flex items-center gap-1"
          color={trip.publish_status === 'PUBLISHED' ? 'success' : 'warning'}
        >
          <div className="capitalize text-sm">
            {trip.publish_status.toLowerCase()}
          </div>
          {trip.publish_status === 'PUBLISHED' ? (
            <EyeOutlined />
          ) : (
            <EyeInvisibleOutlined />
          )}
        </Tag>
        <div className="flex xl:flex-row flex-col gap-3 lg:items-center justify-between w-full lg:mt-2">
          <div className="pt-3 xl:pt-0 mt-3 flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="order-2 lg:order-1 flex items-start gap-3">
              <div className="size-[90px] lg:size-[140px] relative">
                <Image
                  src={trip.image}
                  fill
                  alt="ticket"
                  className="rounded-lg"
                />
              </div>
              <div className="lg:hidden block space-y-4">
                <div className="space-y-0.5">
                  <div className="text-[#7A757F] text-xs">Airline</div>
                  <div className="text-[#1D1B20] text-sm font-medium">
                    {trip.flight.airline}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[#7A757F] text-xs">
                    Flight /Ticket Number
                  </div>
                  <div className="text-[#1D1B20] text-sm font-medium">
                    {trip.flight.number}/{trip.ticket_number}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-6 order-1 lg:order-2">
              <div className="space-y-0.5">
                <div className="text-[#7A757F] text-xs">Origin airport</div>
                <div className="text-[#1D1B20] text-sm font-medium">
                  {trip.flight.source.location_data.airport.name}(
                  {trip.flight.source.location_data.airport.iata_code})
                </div>
                <div className="text-[#1D1B20] text-xs">
                  {trip.flight.source.location_data.city},{' '}
                  {trip.flight.source.location_data.country} |{' '}
                  {dayjs(trip.flight.source.to).format('YYYY-MM-DD')}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[#7A757F] text-xs">
                  Destination airport
                </div>
                <div className="text-[#1D1B20] text-sm font-medium">
                  {trip.flight.destination.location_data.airport.name}(
                  {trip.flight.destination.location_data.airport.iata_code})
                </div>
                <div className="text-[#1D1B20] text-xs">
                  {trip.flight.destination.location_data.city},{' '}
                  {trip.flight.destination.location_data.country} |{' '}
                  {dayjs(trip.flight.destination.to).format('YYYY-MM-DD')}
                </div>
              </div>
              <div className="space-y-0.5 hidden lg:block">
                <div className="text-[#7A757F] text-xs">Airline</div>
                <div className="text-[#1D1B20] text-sm font-medium">
                  {trip.flight.airline}
                </div>
              </div>
              <div className="space-y-0.5 hidden lg:block">
                <div className="text-[#7A757F] text-xs">
                  Flight /Ticket Number
                </div>
                <div className="text-[#1D1B20] text-sm font-medium">
                  {trip.flight.number}/{trip.ticket_number}
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto lg:overflow-visible">
            <Table
              columns={columns}
              dataSource={tripTableData}
              pagination={false}
              bordered
              className="w-full"
              scroll={{ x: 'max-content' }}
              rowClassName="border-b border-[#ECE6EE]"
            />
          </div>
        </div>
        <Divider />
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch checked={visible} onChange={handleUpdateTripVisibility} />
            <Tooltip title="This trip is strictly for information purposes and is private.When the switch is off, the trip is visible to all users.">
              <div className="flex items-center gap-1">
                <span className="text-sm text-[#49454E] font-medium">
                  Public
                </span>
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
            >
              Description
            </Button>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <Button
              type="primary"
              size="large"
              className="bg-transparent text-[#67548E] w-full lg:w-auto"
              icon={<DeleteOutlined size={20} />}
              onClick={() => setIsModalOpen(true)}
            >
              Delete
            </Button>
            <Button
              type="primary"
              size="large"
              className="bg-[#65558F14] text-[#67548E] w-full lg:w-auto"
              icon={<EditOutlined size={20} />}
              href={`/trips/${trip.id}`}
            >
              Edit
            </Button>
          </div>
        </div>
        {showDescription && (
          <div className="w-full mt-4">
            <p className="text-[#7A757F] text-sm">{trip.description}</p>
          </div>
        )}
      </div>
      <Modal
        open={!!selectedRowKey}
        centered
        onCancel={() => setSelectedRowKey('')}
        cancelButtonProps={{ className: 'hidden' }}
        okButtonProps={{ className: 'hidden' }}
        closable={false}
      >
        <div className="flex flex-col gap-4">
          <Typography className="text-lg font-bold text-[#1D1B20]">
            {serviceLabelMapper(selectedRowKey)}
          </Typography>
          <Typography className="text-xs font-normal text-[#49454F]">
            Description
          </Typography>

          <Typography className="text-sm text-[#7A757F]">
            {trip.services[selectedRowKey]?.description}
          </Typography>
        </div>
      </Modal>
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
            Delete Trip
          </Typography>
          <Typography className="text-sm text-[#7A757F]">
            Deleting this trip will remove all associated bookings and plans.
            Are you sure you want to continue?
          </Typography>
          <div className="flex gap-4">
            <Button
              type="primary"
              size="large"
              className="w-full lg:w-auto"
              onClick={handleDeleteTrip}
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
    </Badge.Ribbon>
  );
};

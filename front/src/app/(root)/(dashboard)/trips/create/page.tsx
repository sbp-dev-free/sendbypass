'use client';

import { FC, useState } from 'react';
import Title from 'antd/es/typography/Title';
import { FaArrowLeftLong } from 'react-icons/fa6';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Upload,
  Spin,
} from 'antd';
import { CiCircleAlert } from 'react-icons/ci';
import Link from 'next/link';
import useFetcher from '@/app/_hooks/useFetcher';
import URLS from '@/app/_configs/urls';
import { AirportResultType } from '@/app/_dtos/airport';
import dayjs, { Dayjs } from 'dayjs';
import { normFile } from '@/app/_utils/file';
import { Service } from '@/app/_components/trips/Service';
import { ServiceType } from '@/app/_components/trips/types';
import { TripPreview } from '@/app/_components/trips/TripPreview';

export interface AirportOption {
  value: string;
  label: JSX.Element;
  country: string;
  iso2: string;
  iso3: string;
  iata_code: string;
  airport_code: string;
  shortLabel: string;
  city: string;
  name: string;
}

const NewTripPage: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState<Record<string, ServiceType>>({});
  const [form] = Form.useForm();
  const [minDate, setMinDate] = useState<Dayjs>();
  const { data: airportsResponse, isLoading } = useFetcher<AirportResultType>({
    url: URLS.airports(),
    isProtected: true,
  });

  const airports = airportsResponse?.results || [];

  const airportsOptions: AirportOption[] = airports.map((l) => ({
    value: String(l.location.id),
    label: (
      <div>
        <span className="block text-sm font-medium">
          {l.name} ({l.iata_code})
        </span>
        <span className="block text-xs">
          {l.location.city} , {l.location.country}
        </span>
      </div>
    ),
    country: l.location.country,
    iso2: l.location.country_iso2,
    iso3: l.location.country_iso3,
    iata_code: l.iata_code,
    airport_code: l.airport_code,
    shortLabel: `${l.name} (${l.iata_code})`,
    city: l.location.city,
    name: l.name,
  }));

  const tripFromData = {
    flight: form.getFieldValue(['flight']),
    description: form.getFieldValue('description'),
    image: form.getFieldValue('images'),
    services,
  };

  const isPreviewDisabled = Array.isArray(form.getFieldValue('images'))
    ? form.getFieldValue('images').length === 0
    : !form.getFieldValue('images') ||
      !form.getFieldValue(['flight', 'source', 'location']) ||
      !form.getFieldValue(['flight', 'destination', 'location']) ||
      !form.getFieldValue(['flight', 'source', 'to']) ||
      !form.getFieldValue(['flight', 'destination', 'to']) ||
      !form.getFieldValue(['flight', 'airline']) ||
      !form.getFieldValue(['flight', 'number']) ||
      !form.getFieldValue('ticket_number');

  const handlePreview = async () => {
    try {
      await form.validateFields();
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-8 space-y-8 h-full bg-white rounded-lg">
      <div className="flex gap-4 items-center">
        <Link href="./">
          <FaArrowLeftLong size={20} className="text-[#1D1B20]" />
        </Link>
        <div>
          <Title level={3}>Add trip</Title>
          <span>Enter your trip details accurately.</span>
        </div>
      </div>
      <div className="w-full h-full">
        <Form form={form}>
          <div className="flex flex-col gap-4 w-full lg:flex-row lg:items-center">
            <Form.Item
              getValueFromEvent={normFile}
              name="images"
              valuePropName="fileList"
              required
              rules={[{ required: true, message: 'Ticket image is required' }]}
              className="w-full h-full lg:w-[184px] lg:h-[184px] flex items-center justify-center"
            >
              <Upload
                maxCount={1}
                listType="picture-card"
                className="w-full h-full"
              >
                Ticket image
              </Upload>
            </Form.Item>
            <div className="grid grid-cols-1 gap-3 w-full lg:grid-cols-4">
              <Form.Item
                className="lg:col-span-2"
                name={['flight', 'source', 'location']}
                rules={[
                  { required: true, message: 'Origin airport is required' },
                ]}
              >
                <Select
                  placeholder="Origin airport"
                  size="large"
                  options={airportsOptions}
                  loading={isLoading}
                  notFoundContent={
                    isLoading ? (
                      <div className="flex justify-center items-center">
                        <Spin size="small" className="mx-auto" />
                      </div>
                    ) : null
                  }
                  optionLabelProp="shortLabel"
                  showSearch
                  allowClear
                  filterOption={(input, option) => {
                    const nameMatch = (option?.name ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase());
                    const cityMatch = (option?.city ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase());
                    const countryMatch = (option?.country ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase());
                    const countryIso2Match = (option?.iso2 ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase());
                    const countryIso3Match = (option?.iso3 ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase());
                    const iataCode = (option?.iata_code ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase());
                    const airportCode = (option?.airport_code ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase());

                    return (
                      nameMatch ||
                      cityMatch ||
                      countryMatch ||
                      countryIso2Match ||
                      countryIso3Match ||
                      iataCode ||
                      airportCode
                    );
                  }}
                />
              </Form.Item>
              <Form.Item
                className="lg:col-span-2"
                name={['flight', 'destination', 'location']}
                rules={[
                  {
                    required: true,
                    message: 'Destination airport is required',
                  },
                ]}
              >
                <Select
                  placeholder="Destination airport"
                  size="large"
                  options={airportsOptions}
                  showSearch
                  allowClear
                  loading={isLoading}
                  notFoundContent={
                    isLoading ? (
                      <div className="flex justify-center items-center">
                        <Spin size="small" className="mx-auto" />
                      </div>
                    ) : null
                  }
                  optionLabelProp="shortLabel"
                  filterOption={(input, option) => {
                    const nameMatch = (option?.name ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase());
                    const cityMatch = (option?.city ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase());
                    const countryMatch = (option?.country ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase());
                    const countryIso2Match = (option?.iso2 ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase());
                    const countryIso3Match = (option?.iso3 ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase());
                    const iataCode = (option?.iata_code ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase());
                    const airportCode = (option?.airport_code ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase());

                    return (
                      nameMatch ||
                      cityMatch ||
                      countryMatch ||
                      countryIso2Match ||
                      countryIso3Match ||
                      iataCode ||
                      airportCode
                    );
                  }}
                />
              </Form.Item>
              <Form.Item
                name={['flight', 'airline']}
                required
                rules={[{ required: true, message: 'Airline is required' }]}
              >
                <Input placeholder="Airline" size="large" />
              </Form.Item>
              <Form.Item
                name={['flight', 'number']}
                rules={[
                  { required: true, message: 'Flight Number is required' },
                ]}
              >
                <Input placeholder="Flight Number" size="large" />
              </Form.Item>
              <Form.Item
                name={['flight', 'ticket_number']}
                rules={[
                  { required: true, message: 'Ticket Number is required' },
                ]}
              >
                <Input placeholder="Ticket Number" size="large" />
              </Form.Item>
              <Form.Item
                name={['flight', 'source', 'to']}
                rules={[
                  { required: true, message: 'Departure Date is required' },
                ]}
              >
                <DatePicker
                  placeholder="Departure Date"
                  size="large"
                  className="w-full"
                  minDate={dayjs()}
                  onChange={(date) => {
                    setMinDate(date);
                    form.setFieldValue(['flight', 'destination', 'to'], '');
                  }}
                />
              </Form.Item>
              <Form.Item
                name={['flight', 'destination', 'to']}
                rules={[
                  {
                    required: true,
                    message: 'Arrival Date is required',
                  },
                ]}
              >
                <DatePicker
                  placeholder="Arrival Date"
                  size="large"
                  className="w-full"
                  minDate={dayjs(minDate)}
                />
              </Form.Item>
            </div>
          </div>
          <Form.Item name="description">
            <Input placeholder="Description" size="large" />
          </Form.Item>
        </Form>
        <div className="mt-12 space-y-4">
          <div>
            <Title level={5}>
              Available services {Object.keys(services).length}/3
            </Title>
            <span className="text-xs text-[#49454E]">
              Select the specific services you&apos;d provide during your
              journey, adding at least one from the list.
            </span>
          </div>
          <Service type="Cargo" services={services} setService={setServices} />
          <Service
            type="DOCUMENT"
            services={services}
            setService={setServices}
          />
          <Service
            type="SHOPPING"
            services={services}
            setService={setServices}
          />
        </div>

        <div className="flex flex-col gap-2 mt-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 items-center">
            <CiCircleAlert size={20} />
            <span className="text-xs text-[#49454E]">
              Your changes will be posted on the site after approval
            </span>
          </div>
          <div className="flex gap-2 mt-2 w-full lg:justify-end lg:mt-12 lg:w-auto">
            <Button
              type="primary"
              size="large"
              className="bg-transparent text-[#67548E] w-full lg:w-auto"
              href="/trips"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              className="w-full lg:w-auto"
              onClick={handlePreview}
            >
              Preview
            </Button>
          </div>
        </div>
      </div>
      <Modal
        open={isModalOpen && !isPreviewDisabled}
        onCancel={() => setIsModalOpen(false)}
        width={860}
        centered
        cancelButtonProps={{ className: 'hidden' }}
        okButtonProps={{ className: 'hidden' }}
        destroyOnClose
        closable={false}
      >
        <TripPreview {...tripFromData} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default NewTripPage;

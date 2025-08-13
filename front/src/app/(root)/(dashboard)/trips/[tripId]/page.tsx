'use client';

import { FC, useEffect, useState } from 'react';
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
  UploadFile,
  UploadProps,
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
import { useParams } from 'next/navigation';
import { TripType } from '@/app/_dtos/newTrip';

const EditTripPage: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { tripId } = useParams();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [minDate, setMinDate] = useState<Dayjs>();

  const { data: airportsResponse, isLoading } = useFetcher<AirportResultType>({
    url: URLS.airports(),
    isProtected: true,
  });

  const { data: trip } = useFetcher<TripType>({
    url: URLS.trip(tripId as string),
    isProtected: true,
  });

  const [services, setServices] = useState<
    Record<string, ServiceType> | undefined
  >();

  const airports = airportsResponse?.results || [];

  const airportsOptions = airports.map((l) => ({
    value: l.location.id,
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

  useEffect(() => {
    const updatedTrip: any =
      trip?.services &&
      Object.prototype.hasOwnProperty.call(
        trip.services,
        'shipping:document',
      ) &&
      Number(trip?.services['shipping:document']?.properties?.weight) === 0
        ? JSON.parse(JSON.stringify(trip))
        : null;

    if (updatedTrip) {
      updatedTrip.services['shipping:document'].properties.weight = 'Under 1kg';
    }
    form.setFieldsValue({
      flight: {
        ...trip?.flight,
        source: {
          ...trip?.flight?.source,
          to: dayjs(trip?.flight?.source?.to),
        },
        destination: {
          ...trip?.flight?.destination,
          to: dayjs(trip?.flight?.destination?.to),
        },
      },
      description: trip?.description,
      images: trip?.image,
      services: updatedTrip ? updatedTrip?.services : trip?.services,
      ticket_number: trip?.ticket_number,
    });
    if (trip?.services) {
      setServices(updatedTrip ? updatedTrip.services : trip?.services);
    }
    if (trip?.image) {
      setFileList([
        {
          uid: '1',
          name: trip?.image
            ? (trip?.image?.split('/')?.pop()?.split('.')[0] as string)
            : '',
          url: trip?.image,
        },
      ]);
    }
  }, [
    tripId,
    trip?.id,
    form,
    trip?.description,
    trip?.flight,
    trip?.image,
    trip?.services,
    trip?.ticket_number,
  ]);

  const tripFromData = {
    flight: {
      ...form.getFieldValue(['flight']),
      ticket_number: form.getFieldValue('ticket_number'),
    },
    description: form.getFieldValue('description'),
    image: form.getFieldValue('images'),
    services,
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

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
    <div className="h-full p-8 bg-white rounded-lg space-y-8">
      <div className="flex items-center gap-4">
        <Link href="./">
          <FaArrowLeftLong size={20} className="text-[#1D1B20]" />
        </Link>
        <div>
          <Title level={3}>Edit trip</Title>
          <span>Enter your trip details accurately.</span>
        </div>
      </div>
      <div className="w-full h-full">
        <Form form={form}>
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full">
            <Form.Item
              getValueFromEvent={normFile}
              name="images"
              required
              rules={[{ required: true, message: 'Ticket image is required' }]}
              className="w-full h-full lg:w-[184px] lg:h-[184px] flex items-center justify-center"
            >
              <Upload
                onChange={handleChange}
                fileList={fileList}
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
                  optionLabelProp="shortLabel"
                  loading={isLoading}
                  notFoundContent={
                    isLoading ? (
                      <div className="flex justify-center items-center">
                        <Spin size="small" className="mx-auto" />
                      </div>
                    ) : null
                  }
                  filterOption={(input, option) => {
                    const nameMatch = (option?.name ?? '')
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
                name="ticket_number"
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
                  { required: true, message: 'Arrival Date is required' },
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
              Available services {services ? Object.keys(services).length : 0}/3
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

        <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:justify-between mt-6">
          <div className="flex items-center gap-2">
            <CiCircleAlert size={20} />
            <span className="text-xs text-[#49454E]">
              Your changes will be posted on the site after approval
            </span>
          </div>
          <div className="flex gap-2 lg:justify-end mt-2 lg:mt-12 w-full lg:w-auto">
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

export default EditTripPage;

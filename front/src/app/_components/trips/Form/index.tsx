'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Divider,
  Upload,
  message,
  Image,
  UploadFile,
  UploadProps,
  GetProp,
} from 'antd';
import Text from 'antd/es/typography/Text';
import TextArea from 'antd/es/input/TextArea';
import {
  FaTicket,
  FaRegCalendarDays,
  FaCamera,
  FaClipboardList,
  FaUpload,
} from 'react-icons/fa6';
import URLS from '@/app/_configs/urls';
import useFetcher from '@/app/_hooks/useFetcher';
import { normFile } from '@/app/_utils/file';
import { MdOutlineLocalAirport } from 'react-icons/md';
import { AirportResultType } from '@/app/_dtos/airport';
import dayjs from 'dayjs';
import onSubmit from './actions/submit';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const TripForm: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>();

  const { data: airportsResponse } = useFetcher<AirportResultType>({
    url: URLS.airports(),
  });

  const airports = airportsResponse?.results || [];

  const airportsOptions: Record<string, string>[] = airports.map((l) => ({
    value: String(l.location.id),
    label: `${l.name} - ${l.location.city}`,
    country: l.location.country,
    iso2: l.location.country_iso2,
    iso3: l.location.country_iso3,
    iata_code: l.iata_code,
    airport_code: l.airport_code,
  }));

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      await onSubmit(router)(values);
    } catch (error: any) {
      if (error.response.data.detail) {
        messageApi.error(error.response.data.detail);
      } else {
        messageApi.error('Something wrong happend!');
      }
    }
    setIsLoading(false);
  };
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  return (
    <Form className="mb-12 lg:mt-4" layout="vertical" onFinish={handleSubmit}>
      {contextHolder}
      <div className="flex flex-col gap-4 lg:flex-row mt-12">
        <div className="w-28 gap-2 flex flex-row items-center">
          <MdOutlineLocalAirport className="text-2xl" />
          <Text strong>Airport</Text>
        </div>
        <Form.Item
          className="lg:w-1/4"
          label="Origin airport"
          name={['flight', 'source', 'location']}
          required
          rules={[{ required: true, message: 'Origin airport is required' }]}
        >
          <Select
            options={airportsOptions}
            showSearch
            allowClear
            filterOption={(input, option) => {
              const labelMatch = (option?.label ?? '')
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
                labelMatch ||
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
          className="lg:w-1/4"
          label="Destination airport"
          name={['flight', 'destination', 'location']}
          required
          rules={[
            { required: true, message: 'Destination airport is required' },
          ]}
        >
          <Select
            options={airportsOptions}
            showSearch
            allowClear
            filterOption={(input, option) => {
              const labelMatch = (option?.label ?? '')
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
                labelMatch ||
                countryMatch ||
                countryIso2Match ||
                countryIso3Match ||
                iataCode ||
                airportCode
              );
            }}
          />
        </Form.Item>
      </div>

      <Divider className="my-3 mx-2" />

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-28 gap-2 flex flex-row items-center">
          <FaTicket className="text-2xl" />
          <Text strong>Ticket</Text>
        </div>

        <Form.Item
          className="lg:w-1/4"
          label="Airline"
          name={['flight', 'airline']}
          required
          rules={[{ required: true, message: 'Airline is required' }]}
        >
          <Input className="w-full" />
        </Form.Item>

        <Form.Item
          className="lg:w-1/4"
          label="Ticket Number"
          name="ticket_number"
          required
          rules={[{ required: true, message: 'Ticket Number is required' }]}
        >
          <Input className="w-full" />
        </Form.Item>
        <Form.Item
          className="lg:w-1/4"
          label="Flight Number"
          name={['flight', 'number']}
          required
          rules={[{ required: true, message: 'Flight Number is required' }]}
        >
          <Input className="w-full" />
        </Form.Item>
      </div>

      <Divider className="my-3 mx-2" />

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-28 gap-2 flex flex-row items-center">
          <FaRegCalendarDays className="text-2xl" />
          <Text strong>Date</Text>
        </div>

        <Form.Item
          className="lg:w-1/4"
          label="Pickup Date"
          name={['flight', 'source', 'to']}
          required
          rules={[{ required: true, message: 'Pickup Date is required' }]}
        >
          <DatePicker className="w-full" minDate={dayjs()} />
        </Form.Item>

        <Form.Item
          className="lg:w-1/4"
          label="Delivery Date"
          name={['flight', 'destination', 'to']}
          required
          rules={[{ required: true, message: 'Delivery Date is required' }]}
        >
          <DatePicker className="w-full" minDate={dayjs()} />
        </Form.Item>
      </div>

      <Divider className="my-3 mx-2" />

      <div className="flex flex-row gap-24">
        <div className="w-32 gap-2 flex flex-row items-center">
          <FaCamera className="text-2xl" />
          <Text strong>Ticket image</Text>
        </div>

        <Form.Item
          className="m-0"
          getValueFromEvent={normFile}
          name="images"
          required
          rules={[{ required: true, message: 'Ticket image is required' }]}
          valuePropName="fileList"
        >
          <Upload
            maxCount={1}
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            <div className="flex items-center gap-2">
              <span>Upload</span> <FaUpload />
            </div>
          </Upload>
        </Form.Item>
        {previewImage && (
          <Image
            wrapperStyle={{ display: 'none' }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(''),
            }}
            src={previewImage}
          />
        )}
      </div>

      <Divider className="my-3 mx-2" />

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-28 gap-2 flex flex-row items-center">
          <FaClipboardList className="text-2xl" />
          <Text strong>Description</Text>
        </div>

        <Form.Item className="my-2" name="description" required>
          <TextArea className="lg:w-96 h-48" />
        </Form.Item>
      </div>

      <div className="flex flex-row gap-4 justify-end mt-2">
        <Link href="/trips">
          <Button size="large" type="default">
            Cancel
          </Button>
        </Link>

        <Button
          loading={isLoading}
          htmlType="submit"
          size="large"
          type="primary"
        >
          Save
        </Button>
      </div>
    </Form>
  );
};

export default TripForm;

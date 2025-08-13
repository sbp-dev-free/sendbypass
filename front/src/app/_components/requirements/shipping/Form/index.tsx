'use client';

import { requirementPayloadTypeSelectOptions } from '@/app/_dtos/requirementPayloadTypes';
import { RequirementTypeEnum } from '@/app/_dtos/requirementTypes';
import { normFile } from '@/app/_utils/file';
import {
  Button,
  DatePicker,
  Divider,
  Form,
  GetProp,
  Image,
  Input,
  message,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Text from 'antd/es/typography/Text';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FC, useState } from 'react';
import {
  FaCamera,
  FaClipboardList,
  FaMoneyBill1Wave,
  FaRegCalendarDays,
  FaUpload,
} from 'react-icons/fa6';
import { LuPackageSearch } from 'react-icons/lu';
import { RxSize } from 'react-icons/rx';
import URLS from '@/app/_configs/urls';
import useFetcher from '@/app/_hooks/useFetcher';
import { MdOutlineLocalAirport } from 'react-icons/md';
import dayjs from 'dayjs';
import PaginatedLocations from '@/app/_dtos/locations';
import { DEFAULT_CURRENCY } from '@/app/_dtos/currency';
import onSubmit from '../../actions/submit';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const ShippingForm: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>();
  const router = useRouter();

  const { data: locationsResponse } = useFetcher<PaginatedLocations>({
    url: URLS.locations(),
  });

  const locations = locationsResponse?.results || [];

  const locationsOptions = locations.map((location) => ({
    value: location.id,
    label: `${location.country} - ${location.city} (${location.country_iso3})`,
    country: location.country,
    country_iso2: location.country_iso2,
    country_iso3: location.country_iso3,
  }));

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      await onSubmit(router, RequirementTypeEnum.Enum.SHIPPING)(values);
    } catch (error: any) {
      messageApi.error(error.response.data.detail);
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
      <div className="flex flex-col gap-2 lg:flex-row lg:gap-24">
        <div className="w-28 gap-2 flex flex-row items-center">
          <LuPackageSearch className="text-2xl" />
          <Text strong>Type</Text>
        </div>
        <Form.Item
          className="lg:w-1/4 m-0"
          label="Load Type"
          name={['properties', 'type']}
          required
          rules={[{ required: true, message: 'Load Type is required' }]}
        >
          <Select
            size="large"
            options={requirementPayloadTypeSelectOptions}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
          className="lg:w-1/4 m-0"
          label="Product Name"
          name="name"
          required
          rules={[{ required: true, message: 'Product Name is required' }]}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          className="lg:w-1/4 m-0"
          label={`Product Price (${DEFAULT_CURRENCY.symbol})`}
          name={['cost', 'item_price']}
          required
          rules={[{ required: true, message: 'Product Price is required' }]}
        >
          <Input type="number" size="large" />
        </Form.Item>
      </div>

      <Divider className="my-3 mx-2" />

      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:gap-24">
        <div className="w-28 gap-2 flex flex-row items-center lg:self-center">
          <RxSize className="text-2xl" />
          <Text strong>Size</Text>
        </div>

        <div className="lg:w-1/4 flex items-center gap-4">
          <Form.Item
            label="Length (cm)"
            name={['properties', 'length']}
            required
            rules={[{ required: true, message: 'Length is required' }]}
          >
            <Input type="number" size="large" />
          </Form.Item>

          <Form.Item
            label="Width (cm)"
            name={['properties', 'width']}
            required
            rules={[{ required: true, message: 'Width is required' }]}
          >
            <Input type="number" size="large" />
          </Form.Item>

          <Form.Item
            label="Height (cm)"
            name={['properties', 'height']}
            required
            rules={[{ required: true, message: 'Height is required' }]}
          >
            <Input type="number" size="large" />
          </Form.Item>
        </div>

        <Form.Item
          className="lg:w-1/4"
          label="Weight (kg)"
          name={['properties', 'weight']}
          required
          rules={[
            { required: true, message: 'Weight is required' },
            {
              validator(_, value) {
                if (value === null || value === '' || Number(value) <= 100) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Weight must be less than or equal to 100'),
                );
              },
            },
          ]}
        >
          <Input type="number" size="large" maxLength={5} step="0.01" />
        </Form.Item>
      </div>
      <Divider className="my-3 mx-2" />

      <div className="flex flex-col gap-2 lg:flex-row lg:gap-24">
        <div className="w-28 gap-2 flex flex-row items-center">
          <FaMoneyBill1Wave className="text-2xl" />
          <Text strong>Wage</Text>
        </div>

        <Form.Item
          className="lg:w-1/4"
          label={`Proposed Price (${DEFAULT_CURRENCY.symbol})`}
          name={['cost', 'wage']}
          required
          rules={[{ required: true, message: 'Proposed Price is required' }]}
        >
          <Input size="large" type="number" />
        </Form.Item>

        <Form.Item className="lg:w-1/4" label="Fee">
          <Input disabled size="large" />
        </Form.Item>
      </div>
      <Divider className="my-3 mx-2" />

      <div className="flex flex-col gap-2 lg:flex-row lg:gap-24">
        <div className="w-28 gap-2 flex flex-row items-center">
          <MdOutlineLocalAirport className="text-2xl" />
          <Text strong>Location</Text>
        </div>

        <Form.Item
          className="lg:w-1/4"
          label="Source location"
          name={['source', 'location']}
          required
          rules={[{ required: true, message: 'Source location is required' }]}
        >
          <Select
            size="large"
            options={locationsOptions}
            showSearch
            allowClear
            filterOption={(input, option) => {
              const labelMatch = (option?.label ?? '')
                .toLowerCase()
                .includes(input.toLowerCase());
              const countryMatch = (option?.country ?? '')
                .toLowerCase()
                .includes(input.toLowerCase());
              const countryIso2Match = (option?.country_iso2 ?? '')
                .toLowerCase()
                .includes(input.toLowerCase());
              const countryIso3Match = (option?.country_iso3 ?? '')
                .toLowerCase()
                .includes(input.toLowerCase());

              return (
                labelMatch ||
                countryMatch ||
                countryIso2Match ||
                countryIso3Match
              );
            }}
          />
        </Form.Item>

        <Form.Item
          className="lg:w-1/4"
          label="Destination location"
          name={['destination', 'location']}
          required
          rules={[
            { required: true, message: 'Destination location is required' },
          ]}
        >
          <Select
            size="large"
            options={locationsOptions}
            showSearch
            allowClear
            filterOption={(input, option) => {
              const labelMatch = (option?.label ?? '')
                .toLowerCase()
                .includes(input.toLowerCase());
              const countryMatch = (option?.country ?? '')
                .toLowerCase()
                .includes(input.toLowerCase());
              const countryIso2Match = (option?.country_iso2 ?? '')
                .toLowerCase()
                .includes(input.toLowerCase());
              const countryIso3Match = (option?.country_iso3 ?? '')
                .toLowerCase()
                .includes(input.toLowerCase());

              return (
                labelMatch ||
                countryMatch ||
                countryIso2Match ||
                countryIso3Match
              );
            }}
          />
        </Form.Item>
      </div>
      <Divider className="my-3 mx-2" />

      <div className="flex flex-col gap-2 lg:flex-row lg:gap-24">
        <div className="w-28 gap-2 flex flex-row items-center">
          <FaRegCalendarDays className="text-2xl" />
          <Text strong>Due date</Text>
        </div>

        <Form.Item
          className="lg:w-1/4"
          label="Due date"
          name={['destination', 'to']}
          required
          rules={[{ required: true, message: 'Due date is required' }]}
        >
          <DatePicker size="large" className="w-full" minDate={dayjs()} />
        </Form.Item>
      </div>
      <Divider className="my-3 mx-2" />

      <div className="flex flex-col gap-2 lg:flex-row lg:gap-24">
        <div className="w-28 gap-2 flex flex-row items-center">
          <FaCamera className="text-2xl" />
          <Text strong>Item image</Text>
        </div>

        <Form.Item
          className="m-0"
          getValueFromEvent={normFile}
          name="images"
          required
          rules={[{ required: true, message: 'Image is required' }]}
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

      <div className="flex flex-col gap-2 lg:flex-row lg:gap-24">
        <div className="w-28 gap-2 flex flex-row items-center">
          <FaClipboardList className="text-2xl" />
          <Text strong>Description</Text>
        </div>

        <Form.Item className="my-2" name="comment">
          <TextArea size="large" className="lg:w-96 h-48" />
        </Form.Item>
      </div>

      <div className="flex flex-row gap-4 justify-end mt-2">
        <Link href="/requirements">
          <Button size="large" type="default">
            Cancel
          </Button>
        </Link>

        <Button
          htmlType="submit"
          size="large"
          type="primary"
          loading={isLoading}
        >
          Save
        </Button>
      </div>
    </Form>
  );
};

export default ShippingForm;

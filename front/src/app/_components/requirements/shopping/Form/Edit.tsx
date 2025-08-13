'use client';

import { requirementPayloadTypeSelectOptions } from '@/app/_dtos/requirementPayloadTypes';
import {
  GetRequirementResultType,
  RequirementTypeEnum,
} from '@/app/_dtos/requirementTypes';
import { normFile } from '@/app/_utils/file';
import { DEFAULT_CURRENCY } from '@/app/_dtos/currency';
import {
  Button,
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
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import {
  FaCamera,
  FaClipboardList,
  FaMoneyBill1Wave,
  FaRegCalendarDays,
  FaUpload,
} from 'react-icons/fa6';
import { LuPackageSearch } from 'react-icons/lu';
import { RxSize } from 'react-icons/rx';
import useFetcher from '@/app/_hooks/useFetcher';
import URLS from '@/app/_configs/urls';
import { CloseOutlined } from '@ant-design/icons';
import DatePicker from 'react-datepicker';
import { MdOutlineLocalAirport } from 'react-icons/md';
import PaginatedLocations from '@/app/_dtos/locations';
import onSubmit from '../../actions/edit';
import 'react-datepicker/dist/react-datepicker.css';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const ShoppingForm: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const router = useRouter();
  const { requirementId } = useParams();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>();

  const { data: requirement } = useFetcher<GetRequirementResultType>({
    url: URLS.requirement(requirementId as string),
    shouldFetch: true,
    isProtected: true,
  });

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

  useEffect(() => {
    if (requirement) {
      form.resetFields();

      const toDate = requirement?.destination?.to;
      let parsedDate: Date | null = null;

      if (toDate) {
        parsedDate = new Date(toDate);
        if (isNaN(parsedDate.getTime())) {
          parsedDate = null;
        }
      }

      setDate(parsedDate);
      setShowImage(!!requirement.image);
    }
  }, [requirement, form]);

  useEffect(() => {
    form.setFieldValue('to', date);
  }, [date, form]);

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      await onSubmit(
        router,
        RequirementTypeEnum.Enum.SHOPPING,
        requirementId as string,
      )(values);
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
    <Form
      className="mb-12 lg:mt-4"
      layout="vertical"
      form={form}
      initialValues={{
        to: date,
        ...requirement,
      }}
      onFinish={handleSubmit}
    >
      {contextHolder}
      <div className="flex flex-col gap-2 lg:flex-row lg:gap-24">
        <div className="w-28 gap-2 flex flex-row items-center">
          <LuPackageSearch className="text-2xl" />
          <Text strong>Product</Text>
        </div>

        <div className="grid lg:grid-cols-2 gap-x-24 gap-y-4">
          <Form.Item
            className="m-0"
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
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item
            className="m-0"
            label="Product Name"
            name="name"
            required
            rules={[{ required: true }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            className="m-0"
            label="Product Link"
            name={['properties', 'link']}
            required
            rules={[{ required: true }]}
          >
            <Input size="large" />
          </Form.Item>
        </div>

        <Form.Item
          className="lg:w-1/4 m-0"
          label={`Product Price (${DEFAULT_CURRENCY.symbol})`}
          name={['cost', 'item_price']}
          required
          rules={[{ required: true }]}
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
            rules={[{ required: true }]}
          >
            <Input type="number" size="large" />
          </Form.Item>

          <Form.Item
            label="Width (cm)"
            name={['properties', 'width']}
            required
            rules={[{ required: true }]}
          >
            <Input type="number" size="large" />
          </Form.Item>

          <Form.Item
            label="Height (cm)"
            name={['properties', 'height']}
            required
            rules={[{ required: true }]}
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
          rules={[{ required: true }]}
        >
          <Input type="number" size="large" />
        </Form.Item>

        <Form.Item className="lg:w-1/4" label="Fee">
          <Input disabled size="large" />
        </Form.Item>
      </div>

      <Divider className="my-3 mx-2" />

      <div className="flex flex-col gap-2 lg:flex-row lg:gap-24">
        <div className="w-28 gap-2 flex flex-row items-center">
          <MdOutlineLocalAirport className="text-2xl" />
          <Text strong>Airport</Text>
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
            disabled
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
            disabled
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
          name={['to']}
          required
          rules={[{ required: true }]}
        >
          <DatePicker
            selected={date}
            onChange={(date: Date | null) => {
              setDate(date);
              form.setFieldValue('to', date);
            }}
            className="h-[38px] rounded-lg border border-gray-300"
            closeOnScroll
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
          />
        </Form.Item>
      </div>

      <Divider className="my-3 mx-2" />

      <div className="flex flex-row gap-24">
        <div className="w-28 gap-2 flex flex-row items-center">
          <FaCamera className="text-2xl" />
          <Text strong>Item image</Text>
        </div>

        <Form.Item
          className="m-0"
          getValueFromEvent={normFile}
          name="images"
          required
          rules={[{ required: !requirement?.image }]}
          valuePropName="fileList"
        >
          {showImage ? (
            <div className="relative">
              <Image
                src={requirement?.image as string}
                width={120}
                height={120}
                className="rounded-full"
                preview={false}
              />
              <CloseOutlined
                onClick={() => setShowImage(false)}
                className="text-red-500 absolute right-2 top-2 cursor-pointer"
              />
            </div>
          ) : (
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
          )}
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
          <TextArea className="lg:w-96 h-48" />
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

export default ShoppingForm;

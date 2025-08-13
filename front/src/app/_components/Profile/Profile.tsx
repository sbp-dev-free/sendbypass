'use client';

import {
  Avatar,
  Button,
  Form,
  GetProp,
  Input,
  message,
  Select,
  Space,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import Typography from 'antd/es/typography/Typography';
import { useEffect, useState } from 'react';
import URLS from '@/app/_configs/urls';
import useFetcher from '@/app/_hooks/useFetcher';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import { injectAccessToken } from '@/app/_utils/fetcher';
import { produce } from 'immer';
import jsonToFormData from '@/app/_utils/formData';
import { getToken, setTokens } from '@/app/_utils/token';
import { RiErrorWarningLine } from 'react-icons/ri';
import { BiTrash } from 'react-icons/bi';
import { UserOutlined } from '@ant-design/icons';
import { CountryResult } from '@/app/_dtos/country';
import { socialOptions } from '@/app/_dtos/socials';
import ImgCrop from 'antd-img-crop';
import { cleanObject } from '@/app/_utils/cleanObject';
import { GetProfileType, LanguageResultType } from './types';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bgPreview, setBgPreview] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [imageFile, setImageFile] = useState<UploadFile[]>();
  const [bgFile, setBgFile] = useState<UploadFile[]>();

  const [form] = useForm();

  const { data: profile, mutate } = useFetcher<GetProfileType>({
    url: URLS.profile(),
    isProtected: true,
  });
  const { data: countries } = useFetcher<CountryResult>({
    url: URLS.countries(),
    isProtected: true,
  });

  const { data: languages } = useFetcher<LanguageResultType>({
    url: URLS.languages(),
    isProtected: true,
  });

  const zoneCodes = countries?.results.map((country) => ({
    label: `(+${country.zip_code}) ${country.name}`,
    value: country.zip_code,
    country: country.name,
    iso2: country.iso_2,
    iso3: country.iso_3,
  }));

  const currentLocationOptions = profile?.addresses.map((address) => ({
    label: `${address.country} - ${address.city} ${address.description ? `- ${address.description}` : ''}`,
    value: address.id,
  }));

  const languagesOptions = languages?.results.map((language) => ({
    label: language.name,
    name: language.name,
    value: language.iso,
    iso: language.iso,
  }));
  const uniqueLanguagesOptions = [
    ...new Map(languagesOptions?.map((item) => [item.iso, item])).values(),
  ];

  const phoneRelatedSocials = socialOptions.filter(
    (option) => option.phoneRelated === true,
  );

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        ...profile,
        languages: profile.speak_languages,
        phone_number: {
          ...profile.phone_number,
          socials: profile.phone_number?.socials,
          zip_code: profile.phone_number?.zip_code?.zip_code,
        },
      });
      setImagePreview(profile.image);
      setBgPreview(profile.background);
    }
  }, [profile, form]);

  const handleSubmit = async () => {
    setIsLoading(true);
    const values = cleanObject(form.getFieldsValue());
    const newConfig = await injectAccessToken(true);
    if (!newConfig) {
      return;
    }

    const data = produce(values, (draft: any) => {
      delete draft.background;
      delete draft.email;
      delete draft.phone_number;
      delete draft.languages;
      if (!draft.current_location) {
        delete draft.current_location;
      }
    });

    const formData = jsonToFormData(data);

    const { phone_number, languages } = values;

    if (languages) {
      formData.append(
        'speak_languages',
        JSON.stringify(Object.values(languages)),
      );
    }
    if (phone_number) {
      const zipCode = {
        zip_code: phone_number.zip_code,
        country: zoneCodes?.find((zone) => zone.value === phone_number.zip_code)
          ?.iso3,
      };
      formData.append(
        'phone_number',
        JSON.stringify({
          ...phone_number,
          zip_code: zipCode,
        }),
      );
    }

    if (imageFile) {
      const image = imageFile[0].originFileObj;
      try {
        if (image) {
          formData.append('image', image, image?.name);
        }
      } catch (e) {
        console.error('Failed to append image file', e);
      }
    }
    if (bgFile) {
      const backgroundFile = bgFile[0].originFileObj;
      try {
        if (backgroundFile) {
          formData.append('background', backgroundFile, backgroundFile.name);
        }
      } catch (e) {
        console.error('Failed to append background file', e);
      }
    }

    try {
      await axios.patch(URLS.profile(), formData, newConfig);
      const refresh = getToken('refresh');
      const { data }: any = await axios.post(URLS.refresh(), { refresh });
      setTokens({ access: data.access, refresh: data.refresh });

      messageApi.success('Successfully edited.');
    } catch (error) {
      messageApi.error('Something wrong happened');
    }
    mutate();
    setIsLoading(false);
  };

  const onImageChange: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    setImageFile(newFileList);
    setImagePreview(URL.createObjectURL(newFileList[0].originFileObj as any));
  };

  const onBgChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setBgFile(newFileList);
    setBgPreview(URL.createObjectURL(newFileList[0].originFileObj as any));
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      {contextHolder}
      <div className="flex flex-col lg:flex-row items-center gap-2 w-full my-8">
        <div className="w-full p-4 rounded-2xl gap-6 border border-[#F2ECF4] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Avatar
              shape="circle"
              size={80}
              className="bg-[#F8F1FA] min-w-20 text-[#CBC4CF] border-2 border-[#CBC4CF]"
              icon={<UserOutlined />}
              src={imagePreview}
            />
            <div className="space-y-1">
              <Typography className="text-sm font-semibold">
                Profile photo
              </Typography>
              <Typography className="text-gray-400">
                500*500 (PNG, JPEG) under 5MB
              </Typography>
            </div>
          </div>
          {imagePreview ? (
            <Button
              type="link"
              className="text-[#67548E]"
              icon={<BiTrash size={20} />}
              size="large"
              onClick={() => {
                setImagePreview('');
              }}
            />
          ) : (
            <Form.Item name="image" className="!mb-0">
              <ImgCrop
                rotationSlider
                showGrid
                modalWidth={800}
                minZoom={1}
                cropShape="round"
                showReset
                quality={1}
              >
                <Upload
                  maxCount={1}
                  showUploadList={false}
                  onPreview={onPreview}
                  onChange={onImageChange}
                  accept="image/png, image/jpeg"
                  className="[&>.ant-upload]:!w-auto [&>.ant-upload]:!h-auto"
                >
                  <Button type="primary" className="bg-[#67548E]" size="large">
                    Add
                  </Button>
                </Upload>
              </ImgCrop>
            </Form.Item>
          )}
        </div>
        <div className="w-full p-4 rounded-2xl gap-6 border border-[#F2ECF4] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Avatar
              shape="square"
              className="bg-[#F8F1FA] min-w-20 text-[#CBC4CF] border-2 border-[#CBC4CF]"
              size={80}
              icon={<UserOutlined />}
              src={bgPreview}
            />

            <div className="space-y-1">
              <Typography className="text-sm font-semibold">
                Background photo{' '}
              </Typography>
              <Typography className="text-gray-400">
                800*200 (PNG, JPEG) under 5MB{' '}
              </Typography>
            </div>
          </div>
          {bgPreview ? (
            <Button
              type="link"
              className="text-[#67548E]"
              icon={<BiTrash size={20} />}
              size="large"
              onClick={() => {
                setBgPreview('');
              }}
            />
          ) : (
            <ImgCrop
              rotationSlider
              showGrid
              modalWidth={800}
              minZoom={1}
              cropShape="rect"
              showReset
              quality={1}
            >
              <Upload
                maxCount={1}
                showUploadList={false}
                onPreview={onPreview}
                onChange={onBgChange}
                accept="image/png, image/jpeg"
                className="[&>.ant-upload]:!w-auto [&>.ant-upload]:!h-auto"
              >
                <Button type="primary" className="bg-[#67548E]" size="large">
                  Add
                </Button>
              </Upload>
            </ImgCrop>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-x-6">
        {profile?.type === 'PERSONAL' && (
          <Form.Item
            name="first_name"
            className="col-span-1 lg:col-span-3"
            rules={[{ required: true, message: 'First name is required' }]}
          >
            <Input placeholder="First name (Required)" size="large" />
          </Form.Item>
        )}
        {profile?.type === 'PERSONAL' && (
          <Form.Item
            name="last_name"
            className="col-span-1 lg:col-span-3"
            rules={[{ required: true, message: 'Last name is required' }]}
          >
            <Input placeholder="Last name (Required)" size="large" />
          </Form.Item>
        )}
        {profile?.type === 'BUSINESS' && (
          <Form.Item
            name="business_name"
            className="col-span-1 lg:col-span-3"
            rules={[{ required: true, message: 'Business name is required' }]}
          >
            <Input placeholder="Business name (Required)" size="large" />
          </Form.Item>
        )}
        <Form.Item
          name="email"
          className={`col-span-1 ${profile?.type === 'PERSONAL' ? 'lg:col-span-2' : 'lg:col-span-3'}`}
        >
          <Input placeholder="Email" size="large" disabled />
        </Form.Item>
        <Form.Item
          name={['phone_number', 'zip_code']}
          className="col-span-1 lg:col-span-2"
          rules={[
            {
              required: true,
              message: 'Zone code is required',
            },
          ]}
        >
          <Select
            allowClear
            placeholder="Zone code"
            size="large"
            showSearch
            options={zoneCodes}
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
              return (
                labelMatch ||
                countryMatch ||
                countryIso2Match ||
                countryIso3Match
              );
            }}
          />
        </Form.Item>
        <Space.Compact className="col-span-1 lg:col-span-2">
          <Form.Item
            name={['phone_number', 'phone']}
            className="w-full"
            rules={[
              {
                required: true,
                message: 'Phone number is required',
              },
            ]}
          >
            <Input placeholder="Mobile" size="large" />
          </Form.Item>
          <Form.Item name={['phone_number', 'socials']} className="w-full">
            <Select
              placeholder="Socails"
              size="large"
              mode="multiple"
              maxTagCount="responsive"
              options={phoneRelatedSocials}
              optionRender={(option) => (
                <div className="flex items-center gap-1">
                  <span className="size-4">{option.data.emoji}</span>{' '}
                  <span>{option.data.label}</span>
                </div>
              )}
            />
          </Form.Item>
        </Space.Compact>
        {profile?.type !== 'PERSONAL' && (
          <Form.Item name="website" className="col-span-1 lg:col-span-2">
            <Input placeholder="Website" size="large" />
          </Form.Item>
        )}

        <Form.Item
          name="languages"
          rules={[
            {
              required: true,
              message: 'Please select at least one language!',
            },
          ]}
          className="col-span-1 lg:col-span-2"
        >
          <Select
            placeholder="Language you speak"
            size="large"
            showSearch
            mode="multiple"
            maxTagCount="responsive"
            options={uniqueLanguagesOptions}
            filterOption={(input, option) => {
              const labelMatch = (option?.label ?? '')
                .toLowerCase()
                .includes(input.toLowerCase());
              const nameMatch = (option?.name ?? '').includes(
                input.toLowerCase(),
              );
              const isoMatch = (option?.iso ?? '')
                .toLowerCase()
                .includes(input.toLowerCase());

              return nameMatch || labelMatch || isoMatch;
            }}
          />
        </Form.Item>
        <Form.Item name="current_location" className="col-span-1 lg:col-span-2">
          <Select
            placeholder="Current Location"
            size="large"
            showSearch
            options={currentLocationOptions}
          />
        </Form.Item>
        <div className="col-span-1 lg:col-span-6">
          <Form.Item name="bio">
            <Input showCount maxLength={200} size="large" placeholder="Bio" />
          </Form.Item>
          <div className="pl-4 -mt-3 text-sm text-gray-400">
            Brief description for your profile
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="flex items-center gap-2 text-[#49454E]">
          <RiErrorWarningLine size={20} />
          <Typography>
            Your changes will be posted on the site after approval
          </Typography>
        </div>
        <div className="flex items-center w-full justify-end lg:w-auto gap-2">
          <Button type="link" size="large" className="text-[#67548E]">
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            className="bg-[#67548E]"
            htmlType="submit"
            loading={isLoading}
          >
            Update
          </Button>
        </div>
      </div>
    </Form>
  );
};

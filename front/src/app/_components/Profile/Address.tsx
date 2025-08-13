'use client';

import URLS from '@/app/_configs/urls';
import useFetcher from '@/app/_hooks/useFetcher';
import { injectAccessToken } from '@/app/_utils/fetcher';
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Select,
  Spin,
  Typography,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import { useState } from 'react';
import { BiTrash } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import { CountryResult } from '@/app/_dtos/country';
import { UserLocationsResultType } from './types';
import { NoResult } from './NoResult';

export const Address = ({ mutate: _mutate }: { mutate: () => void }) => {
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [iso3, setIso3] = useState('');
  const { push } = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const [form] = useForm();

  const {
    data: addresses,
    isLoading,
    mutate,
  } = useFetcher<UserLocationsResultType>({
    url: URLS.userLocations(),
    isProtected: true,
  });

  const { data: citiesData } = useFetcher<any>({
    url: URLS.cities(form.getFieldValue('country') ?? ''),
    isProtected: true,
    shouldFetch: true,
  });

  const { data: countriesData } = useFetcher<CountryResult>({
    url: URLS.countries(),
    isProtected: true,
  });

  const citiesOptions = citiesData?.results.map((city: any) => ({
    label: `${city.name}`,
    value: city.name,
    country: city.country,
  }));

  const countriesOptions = countriesData?.results.map((country) => ({
    label: `${country.iso_3}`,
    value: country.iso_3,
    country: country.name,
    iso2: country.iso_2,
    iso3: country.iso_3,
  }));

  const handleToggleAddAddress = () => {
    setIsAddAddressOpen(!isAddAddressOpen);
  };

  const handleAddAddress = async (values: any) => {
    const newConfig = await injectAccessToken(true);
    if (!newConfig) {
      return;
    }

    try {
      await axios.post(
        URLS.userLocations(),
        {
          ...values,
          country: countriesData?.results.find(
            (country: any) => country.iso_3 === iso3,
          )?.name,
        },
        newConfig,
      );
      mutate();
      setIso3('');
      setIsAddAddressOpen(false);
      messageApi.success('Successfull added.');
      form.resetFields();
    } catch (error) {
      messageApi.error('Something wrong happened');
    } finally {
      if (addresses?.results.length === 0) {
        _mutate();
      }
    }
  };

  const handleDeleteAddress = async (e: unknown, id: number) => {
    const newConfig = await injectAccessToken(true);
    if (!newConfig) {
      return;
    }
    try {
      axios.delete(URLS.userLocation(id.toString()), newConfig).then(() => {
        mutate();
        messageApi.success('Successfull deleted.');
        push('/profile');
        setIso3('');
      });
    } catch (error) {
      messageApi.error('Something wrong happened');
    } finally {
      if (addresses?.results.length && addresses?.results.length <= 1) {
        _mutate();
      }
    }
  };
  const handleChangeCountry = (item: any) => {
    setIso3(item);
    form.setFieldsValue({
      city: '',
    });
  };

  return (
    <div>
      {contextHolder}
      <div className="relative flex flex-col lg:flex-row items-start gap-8 lg:gap-0">
        {isLoading && !addresses?.results.length && !isAddAddressOpen && (
          <Spin size="large" className="flex justify-center w-full" />
        )}
        {!isLoading && !addresses?.results.length && !isAddAddressOpen && (
          <div className="flex flex-col justify-center items-center w-full py-8">
            <NoResult />
            <Typography className="text-[#49454E] text-lg font-semibold">
              No Address
            </Typography>
            <Typography className="text-[#7A757F]">
              You can add address here.
            </Typography>
          </div>
        )}
      </div>
      <div className="w-full mb-12">
        {addresses?.results.map((address) => (
          <div className="flex items-center mb-3 px-3 py-1 w-full bg-slate-100 rounded-md hover:bg-slate-200 transition-colors duration-200">
            <div className="flex flex-col items-center justify-center">
              <div className="w-0.5 h-full bg-[#65558F29] lg:hidden" />
              <Button
                icon={<BiTrash size={20} />}
                className="text-[#67548E] my-1 lg:mb-0 lg:mr-2"
                type="link"
                onClick={() => handleDeleteAddress(null, address.id)}
              />
              <div className="w-0.5 h-full bg-[#65558F29] lg:hidden" />
            </div>
            <div className="flex items-center gap-4 w-full">
              <Typography className="text-[#7A757F]">
                {address.country}
              </Typography>
              <Divider type="vertical" className="border-gray-400" />
              <Typography className="text-[#7A757F]">{address.city}</Typography>
              {address.description && (
                <>
                  <Divider type="vertical" className="border-gray-400" />
                  <Typography className="text-[#7A757F]">
                    {address.description}
                  </Typography>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {isAddAddressOpen && (
        <Form
          onFinish={handleAddAddress}
          form={form}
          className="flex flex-col lg:flex-row gap-2 mb-4 w-full"
        >
          <div className="flex flex-row mb-3 w-full">
            <div className="flex flex-col items-center justify-center">
              <div className="w-0.5 h-full bg-[#65558F29] lg:hidden" />
              <Button
                icon={<BiTrash size={20} />}
                className="text-[#67548E] my-1 lg:mb-0 lg:mr-2 lg:-mt-6"
                type="link"
                onClick={handleToggleAddAddress}
              />
              <div className="w-0.5 h-full bg-[#65558F29] lg:hidden" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
              <Form.Item name="country" className="w-full">
                <Select
                  showSearch
                  allowClear
                  placeholder="Country"
                  maxCount={1}
                  size="large"
                  options={countriesOptions}
                  onChange={handleChangeCountry}
                  labelRender={(option) => (
                    <div>
                      {
                        countriesData?.results.find(
                          (country: any) => country.iso_3 === option.value,
                        )?.name
                      }
                    </div>
                  )}
                  optionRender={(option) => (
                    <div>
                      {
                        countriesData?.results.find(
                          (country: any) => country.iso_3 === option.value,
                        )?.name
                      }
                    </div>
                  )}
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
              <Form.Item name="city" className="w-full">
                <Select
                  showSearch
                  allowClear
                  placeholder="City"
                  maxCount={1}
                  size="large"
                  options={citiesOptions}
                  disabled={!iso3}
                />
              </Form.Item>
              <Form.Item name="description">
                <Input placeholder="Address" size="large" />
              </Form.Item>
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            className="bg-[#67548E]"
            htmlType="submit"
          >
            Update
          </Button>
        </Form>
      )}
      <div className="flex items-center justify-between">
        <Button
          type="primary"
          size="large"
          className="bg-[#67548E] bg-opacity-15 text-[#67548E]"
          onClick={handleToggleAddAddress}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

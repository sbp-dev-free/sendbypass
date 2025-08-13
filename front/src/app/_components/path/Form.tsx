'use client';

import { FC } from 'react';
import {
  useSearchParams,
  useRouter,
  ReadonlyURLSearchParams,
} from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Button, Form, Select, Spin } from 'antd';
import z from 'zod';
import { FaArrowsRotate } from 'react-icons/fa6';
import uniqBy from 'lodash/uniqBy';
import useFetcher from '@/app/_hooks/useFetcher';
import PaginatedLocations from '@/app/_dtos/locations';
import URLS from '@/app/_configs/urls';

export const SearchTypeEnum = z.enum(['send', 'shop', 'reward']);
export type SearchType = z.infer<typeof SearchTypeEnum>;

interface PathFormProps {
  type?: SearchType;
}

export interface LocationOption {
  value: string;
  label: JSX.Element;
  country: string;
  iso2: string;
  iso3: string;
  shortLabel: string;
}
const onSearch =
  (
    router: AppRouterInstance,
    searchParams: ReadonlyURLSearchParams,
    type?: SearchType,
  ) =>
  (values: any) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const { fromCity, toCity } = values;

    newSearchParams.delete('from_city');
    if (fromCity) {
      newSearchParams.set('from_city', fromCity);
    }

    newSearchParams.delete('to_city');
    if (toCity) {
      newSearchParams.set('to_city', toCity);
    }

    if (type) {
      router.push(`/search/${type}?${newSearchParams.toString()}`);
      return;
    }

    window.history.pushState(null, '', `?${newSearchParams.toString()}`);
  };

const PathForm: FC<PathFormProps> = ({ type = undefined }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: locationsResponse, isLoading } = useFetcher<PaginatedLocations>(
    {
      url: URLS.locations(),
    },
  );
  const locations = locationsResponse?.results || [];
  const cityOptions: LocationOption[] = uniqBy(
    locations.map((location) => ({
      value: location.city,
      label: (
        <div>
          <span className="block text-sm font-medium">{location.city}</span>
          <span className="block text-xs">{location.country}</span>
        </div>
      ),
      country: location.country,
      iso2: location.country_iso2,
      iso3: location.country_iso3,
      shortLabel: location.city,
    })),
    (item) => item.value,
  );

  return (
    <Form
      className="w-full justify-center sm:flex sm:flex-row gap-4 sm:px-16 px-4"
      initialValues={{
        fromCity: searchParams.get('from_city'),
        toCity: searchParams.get('to_city'),
      }}
      name="search-form"
      onFinish={onSearch(router, searchParams, type)}
      size="middle"
    >
      <div className="flex w-full flex-row justify-center gap-4">
        <Form.Item className="w-full mt-6" name="fromCity">
          <Select
            allowClear
            size="large"
            options={cityOptions}
            loading={isLoading}
            showSearch
            notFoundContent={
              isLoading ? (
                <div className="flex justify-center items-center">
                  <Spin size="small" className="mx-auto" />
                </div>
              ) : null
            }
            optionLabelProp="shortLabel"
            filterOption={(input, option) => {
              const shortLabelMatch = (option?.shortLabel ?? '')
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
                shortLabelMatch ||
                countryMatch ||
                countryIso2Match ||
                countryIso3Match
              );
            }}
            placeholder="From"
          />
        </Form.Item>

        <Form.Item className="mt-6">
          <Button
            className="flex items-center justify-center"
            icon={<FaArrowsRotate />}
            shape="round"
            size="large"
          />
        </Form.Item>

        <Form.Item className="w-full mt-6" name="toCity">
          <Select
            allowClear
            size="large"
            options={cityOptions}
            showSearch
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
              const shortLabelMatch = (option?.shortLabel ?? '')
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
                shortLabelMatch ||
                countryMatch ||
                countryIso2Match ||
                countryIso3Match
              );
            }}
            placeholder="To"
          />
        </Form.Item>
      </div>

      <div className="lg:mt-6">
        <Form.Item className="sm:inline block">
          <Button
            className="bg-[#67548E] w-full"
            htmlType="submit"
            type="primary"
            size="large"
          >
            Search
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default PathForm;

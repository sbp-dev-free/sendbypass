'use client';

import { FC, Suspense, useEffect, useRef, useState } from 'react';
import {
  Menu,
  Layout as AntLayout,
  Divider,
  Dropdown,
  Select,
  Button,
} from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import { RootLayoutProps } from '@/app/layout';
import { BiSort } from 'react-icons/bi';
import useFetcher from '@/app/_hooks/useFetcher';
import URLS from '@/app/_configs/urls';
import { PaginatedServices } from '@/app/_dtos/service';
import PaginatedRequirements from '@/app/_dtos/requirements';
import { useRouter, useSearchParams } from 'next/navigation';
import { orderItems, sortItems } from '@/app/_dtos/sidebars';

interface LayoutProps extends RootLayoutProps {}

const Layout: FC<LayoutProps> = ({ children = null }) => {
  const { push } = useRouter();
  const params = useSearchParams();

  const [currentService, setCurrentService] = useState<string | undefined>();
  const [currentRequirement, setCurrentRequirement] = useState<
    string | undefined
  >();
  const [currentOrdering, setCurrentOrdering] = useState<string | undefined>();
  const [currentMenuItem, setCurrentMenuItem] = useState<string | undefined>(
    'my-requirements',
  );

  const isInitialRender = useRef(true);

  useEffect(() => {
    if (!isInitialRender) return;
    if (
      isInitialRender.current &&
      (params.get('role') ||
        params.get('status') ||
        params.get('service') ||
        params.get('requirement') ||
        params.get('ordering'))
    ) {
      push('/orders');
    }
    isInitialRender.current = false;
  }, [params, push]);

  const { data: services } = useFetcher<PaginatedServices>({
    url: URLS.services(),
    isProtected: true,
  });

  const { data: requirements } = useFetcher<PaginatedRequirements>({
    url: URLS.requirements(),
    isProtected: true,
  });

  const serviceOptions = services?.results.map((service) => ({
    label: service.description,
    value: service.id,
  }));

  const requirementOptions = requirements?.results.map((requirement) => ({
    label: requirement.name,
    value: requirement.id,
  }));

  const updatePath = (
    service?: string,
    requirement?: string,
    ordering?: string,
    status?: string,
  ) => {
    const queryParams = new URLSearchParams();
    if (service) queryParams.append('service', service);
    if (requirement) queryParams.append('requirement', requirement);
    if (ordering) queryParams.append('ordering', ordering);

    if (status) {
      if (status === 'my-trips') {
        queryParams.append('role', 'TRAVELER');
      } else if (status === 'my-requirements') {
        queryParams.append('role', 'CUSTOMER');
      } else if (status === 'delivered-orders') {
        queryParams.append('status', 'DELIVERED');
      } else if (status === 'cancelled-orders') {
        queryParams.append('status', 'CANCELLED');
      }
    }
    const path = `/orders?${queryParams.toString()}`;
    push(path);
  };

  const onChangeRequirement = (value: string) => {
    setCurrentRequirement(value);
    updatePath(currentService, value, currentOrdering, currentMenuItem);
  };

  const onChangeService = (value: string) => {
    setCurrentService(value);
    updatePath(value, currentRequirement, currentOrdering, currentMenuItem);
  };

  const onChangeOrdering = (item: any) => {
    const { key } = item;
    setCurrentOrdering(key);
    updatePath(currentService, currentRequirement, key, currentMenuItem);
  };

  const onMenuItemClick = (info: any) => {
    const { key } = info;
    setCurrentMenuItem(key);
    updatePath(currentService, currentRequirement, currentOrdering, key);
  };

  const clearFilters = () => {
    setCurrentService(undefined);
    setCurrentRequirement(undefined);
    setCurrentOrdering(undefined);
    setCurrentMenuItem('my-requirements');
    push('/orders');
  };

  const hasActiveFilters = !!(
    currentService ||
    currentRequirement ||
    currentOrdering ||
    currentMenuItem !== 'my-requirements'
  );

  return (
    <AntLayout className="min-h-full">
      <Sider collapsedWidth="0" className="bg-white hidden md:block">
        <Menu
          mode="inline"
          items={orderItems}
          onClick={onMenuItemClick}
          selectedKeys={currentMenuItem ? [currentMenuItem] : undefined}
          defaultOpenKeys={['current-orders']}
          defaultSelectedKeys={['my-requirements']}
        />
        <div className="bg-white h-full px-4 space-y-6">
          <Divider>
            <span className="text-xs font-semibold">Filters</span>
          </Divider>
          <Dropdown.Button
            menu={{ items: sortItems, onClick: onChangeOrdering }}
            placement="bottom"
            icon={<BiSort />}
            className="w-full"
          >
            <span className="w-[104px]">Sort By date</span>
          </Dropdown.Button>
          <Select
            placeholder="Your item"
            optionFilterProp="label"
            onChange={onChangeService}
            className="w-full"
            options={serviceOptions}
          />
          <Select
            placeholder="Your requirement"
            optionFilterProp="label"
            onChange={onChangeRequirement}
            className="w-full"
            options={requirementOptions}
          />
          {hasActiveFilters && (
            <div className="p-2 w-full">
              <Button
                icon={<ClearOutlined />}
                type="primary"
                onClick={clearFilters}
                className="w-full"
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </Sider>

      <Content className="p-2">{children}</Content>
    </AntLayout>
  );
};

const SuspenseOrdersLayout: FC<LayoutProps> = ({ children = null }) => (
  <Suspense>
    <Layout>{children}</Layout>
  </Suspense>
);

export default SuspenseOrdersLayout;

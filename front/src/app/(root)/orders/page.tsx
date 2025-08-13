'use client';

import { FC, useState } from 'react';
import { Button, Divider, Drawer, Dropdown, List, Menu, Select } from 'antd';
import Title from 'antd/es/typography/Title';
import { OrderItem } from '@/app/_components/orders/OrderItem';
import { Order } from '@/app/_components/orders/types';
import useFetcher from '@/app/_hooks/useFetcher';
import URLS from '@/app/_configs/urls';
import { GetOrdersResultType } from '@/app/_dtos/ordersDataType';
import { useRouter, useSearchParams } from 'next/navigation';
import { orderItemsMobile, sortItems } from '@/app/_dtos/sidebars';
import { BiSort } from 'react-icons/bi';
import { PaginatedServices } from '@/app/_dtos/service';
import PaginatedRequirements from '@/app/_dtos/requirements';

const OrdersPage: FC = () => {
  const params = useSearchParams();
  const role = params.get('role') ?? 'CUSTOMER';
  const status = params.get('status');
  const ordering = params.get('ordering');
  const requirement = params.get('requirement');
  const service = params.get('service');

  const { data, mutate, isLoading } = useFetcher<GetOrdersResultType>({
    url: URLS.orders(),
    isProtected: true,
    shouldFetch: true,
    config: {
      params: {
        status,
        ordering,
        requirement,
        service,
        ...(status ? {} : { role }),
      },
    },
  });

  const orders = data?.results.map((order) => {
    return {
      title: order.requirement_data.name,
      user:
        order.role === 'CUSTOMER' ? order.traveler_data : order.customer_data,
      requirement: order.requirement_data.type,
      destination: order.requirement_data.destination.location_data.city,
      current: order.steps.length > 0 ? order.steps.length - 1 : 0,
      stepId:
        order.steps.length > 0 ? order.steps[order.steps.length - 1].id : 0,
      role: order.role,
      properties: order.steps.map((step) => ({
        date: step?.timestamp,
        code: step?.properties?.code,
        comment: step.properties.comment,
        rate: step.properties.rate,
        image: step.properties.image,
      })),
      status: order.status,
    };
  });

  const { push } = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const showDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const onChangeService = (value: string) => {
    push(`/orders?service=${value}`);
  };

  const { data: services } = useFetcher<PaginatedServices>({
    url: URLS.services(),
    isProtected: true,
    shouldFetch: isDrawerOpen,
  });

  const serviceOptions = services?.results.map((service) => ({
    label: service.description,
    value: service.id,
  }));

  const onChangeRequirement = (value: string) => {
    push(`/orders?requirement=${value}`);
  };
  const { data: requirements } = useFetcher<PaginatedRequirements>({
    url: URLS.requirements(),
    isProtected: true,
    shouldFetch: isDrawerOpen,
  });

  const requirementOptions = requirements?.results.map((requirement) => ({
    label: requirement.name,
    value: requirement.id,
  }));

  return (
    <div className="h-full p-2">
      <div className="mb-4 flex justify-between">
        <Title level={3}>Orders</Title>
        <Button
          className="block lg:hidden"
          type="primary"
          size="large"
          onClick={showDrawer}
        >
          Settings
        </Button>
        <Drawer
          title="Settings"
          placement="left"
          onClose={closeDrawer}
          open={isDrawerOpen}
        >
          <Menu className="!border-none" items={orderItemsMobile} />
          <div className="bg-white px-4 space-y-6">
            <Divider>
              <span className="text-xs font-semibold">Filters</span>
            </Divider>
            <Dropdown.Button
              menu={{ items: sortItems }}
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
          </div>
        </Drawer>
      </div>

      <Divider className="mt-4 mb-6" />

      <List
        dataSource={orders}
        className="rounded-md"
        loading={isLoading}
        renderItem={(order: Order) => (
          <OrderItem order={order} mutate={mutate} />
        )}
        size="large"
      />
    </div>
  );
};

export default OrdersPage;

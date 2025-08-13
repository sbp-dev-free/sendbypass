'use client';

import { Button, Divider, Drawer, List, Menu, Tag } from 'antd';
import { useState } from 'react';
import Title from 'antd/es/typography/Title';
import { PaginatedRequests, RequestGet } from '@/app/_dtos/request';
import URLS from '@/app/_configs/urls';
import useFetcher from '@/app/_hooks/useFetcher';
import { RequestItem } from '@/app/_components/Requests/RequestItem';
import { useMenuData } from '@/app/_hooks/useMenuItems';

const applicationsGetParams: RequestGet = {
  status: 'PENDING',
  ordering: 'submit_time',
};

const ApplicationsPage = () => {
  const {
    data: requestsResponse,
    isLoading,
    mutate,
  } = useFetcher<PaginatedRequests>({
    url: URLS.requests(),
    config: {
      params: applicationsGetParams,
    },
    isProtected: true,
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { menuItems } = useMenuData();
  const showDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="h-full p-2 rounded-md">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Title level={3}>
            <span>Requests</span>
          </Title>
          <Tag className="flex items-center gap-2 mb-2" color="default">
            All
          </Tag>
        </div>
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
          <Menu className="!border-none" items={menuItems} />
        </Drawer>
      </div>

      <Divider className="mt-4 mb-6" />
      <List
        dataSource={requestsResponse?.results}
        grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 2, xl: 3, xxl: 3 }}
        loading={isLoading}
        renderItem={(request) => (
          <RequestItem
            request={request}
            mutate={mutate}
            isSent={request.role === 'CUSTOMER'}
          />
        )}
        size="large"
      />
    </div>
  );
};

export default ApplicationsPage;

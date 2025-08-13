'use client';

import { Button, Divider, Drawer, List, Menu, Tag, Typography } from 'antd';
import { PaginatedRequests, RequestGet } from '@/app/_dtos/request';
import { RequestSideSchema } from '@/app/_dtos/requestSide';
import { RequirementTypeEnum } from '@/app/_dtos/requirementTypes';
import URLS from '@/app/_configs/urls';
import useFetcher from '@/app/_hooks/useFetcher';
import { RequestItem } from '@/app/_components/Requests/RequestItem';
import { CiImport } from 'react-icons/ci';
import { useMemo, useState } from 'react';
import { useMenuData } from '@/app/_hooks/useMenuItems';

const { Title } = Typography;

const inboxShoppingRequestGetParams: RequestGet = {
  side: RequestSideSchema.Enum.RECEIVED,
  type: RequirementTypeEnum.Enum.SHOPPING,
};

const ReceivedShoppingRequestsPage = () => {
  const {
    data: requestsResponse,
    isLoading,
    error,
    mutate,
  } = useFetcher<PaginatedRequests>({
    url: URLS.requests(),
    config: {
      params: inboxShoppingRequestGetParams,
    },
    isProtected: true,
  });

  const sortedRequests = useMemo(() => {
    if (!requestsResponse?.results) return [];
    return [...requestsResponse.results].sort((a, b) => {
      const aRequest = a.status === 'PENDING' ? 1 : 0;
      const bRequest = b.status === 'PENDING' ? 1 : 0;
      return bRequest - aRequest;
    });
  }, [requestsResponse]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { menuItems } = useMenuData();
  const showDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  if (error) {
    return <div className="text-red-500 p-4">Error loading requests</div>;
  }

  return (
    <div className="h-full p-4">
      <div className="flex items-center gap-2 mb-4 justify-between">
        <div className="flex items-center gap-2">
          <Title level={3}>Requests</Title>
          <Tag
            className="flex items-center gap-2 mb-2"
            icon={<CiImport />}
            color="default"
          >
            Inbox
          </Tag>
        </div>
        <Button
          type="primary"
          size="large"
          className="block lg:hidden"
          onClick={showDrawer}
        >
          setting
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

      <Divider className="mb-6" />

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 3 }}
        dataSource={sortedRequests}
        loading={isLoading}
        renderItem={(request) => (
          <RequestItem request={request} mutate={mutate} />
        )}
        size="large"
      />
    </div>
  );
};

export default ReceivedShoppingRequestsPage;

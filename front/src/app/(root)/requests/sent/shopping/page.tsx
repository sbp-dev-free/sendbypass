'use client';

import { Button, Divider, Drawer, List, Menu, Tag } from 'antd';
import Title from 'antd/es/typography/Title';
import { PaginatedRequests, RequestGet } from '@/app/_dtos/request';
import URLS from '@/app/_configs/urls';
import { RequestSideSchema } from '@/app/_dtos/requestSide';
import { RequirementTypeEnum } from '@/app/_dtos/requirementTypes';
import useFetcher from '@/app/_hooks/useFetcher';
import { RequestItem } from '@/app/_components/Requests/RequestItem';
import { CiExport } from 'react-icons/ci';
import { useMemo, useState } from 'react';
import { useMenuData } from '@/app/_hooks/useMenuItems';

const outboxShoppingRequestGetParams: RequestGet = {
  side: RequestSideSchema.Enum.SENT,
  type: RequirementTypeEnum.Enum.SHOPPING,
};

const SentShoppingRequestsPage = () => {
  const {
    data: requestsResponse,
    isLoading,
    mutate,
  } = useFetcher<PaginatedRequests>({
    url: URLS.requests(),
    config: {
      params: outboxShoppingRequestGetParams,
    },
    isProtected: true,
  });

  const sortedRequests = useMemo(() => {
    return requestsResponse?.results.sort((a, b) => {
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

  return (
    <div className="h-full p-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Title level={3}>Requests</Title>
          <Tag
            className="flex items-center gap-2 mb-2"
            icon={<CiExport />}
            color="default"
          >
            Outbox
          </Tag>
        </div>
        <Button
          type="primary"
          className="block lg:hidden"
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
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 3 }}
        dataSource={sortedRequests}
        loading={isLoading}
        renderItem={(request) => (
          <RequestItem request={request} mutate={mutate} isSent />
        )}
        size="large"
      />
    </div>
  );
};

export default SentShoppingRequestsPage;

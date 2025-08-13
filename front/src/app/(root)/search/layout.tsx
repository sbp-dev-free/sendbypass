'use client';

import { Layout as AntLayout, Tabs } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { FaShoppingBag, FaBox } from 'react-icons/fa';
import { LuPlane } from 'react-icons/lu';
import PathForm, { SearchType } from '@/app/_components/path/Form';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ShopSidebar, RewardSidebar, SentSidebar } from '@/app/_dtos/sidebars';
import { FC, Suspense } from 'react';

const SearchLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const renderSidebar = () => {
    switch (pathname) {
      case '/search/shop':
        return <ShopSidebar />;
      case '/search/reward':
        return <RewardSidebar />;
      case '/search/send':
      default:
        return <SentSidebar />;
    }
  };
  const getActiveKey = () => {
    const path = pathname.split('/')[2];
    return path || 'send';
  };

  return (
    <AntLayout className="min-h-full bg-[#FEF7FF]">
      <Sider breakpoint="md" className="hidden md:block bg-white">
        {renderSidebar()}
      </Sider>

      <Content className="p-2 flex flex-col gap-4">
        <div className="bg-white rounded">
          <Tabs
            centered
            className="flex align-center"
            activeKey={getActiveKey()}
            defaultActiveKey="send"
            destroyInactiveTabPane
            items={[
              {
                key: 'send',
                label: (
                  <div className="flex gap-2 items-center sm:text-base text-xs">
                    <LuPlane className="sm:block hidden" />
                    Find passengers
                  </div>
                ),
              },
              {
                key: 'shop',
                label: (
                  <div className="flex gap-2 items-center sm:text-base text-xs">
                    <FaShoppingBag className="sm:block hidden" />
                    Reward by shopping
                  </div>
                ),
              },
              {
                key: 'reward',
                label: (
                  <div className="flex gap-2 items-center sm:text-base text-xs">
                    <FaBox className="sm:block hidden" />
                    Reward by shipping
                  </div>
                ),
              },
            ]}
            onTabClick={(key) => {
              const newSearchParams = new URLSearchParams();
              if (searchParams.get('from_city')) {
                newSearchParams.set(
                  'from_city',
                  searchParams.get('from_city')!,
                );
              }
              if (searchParams.get('to_city')) {
                newSearchParams.set('to_city', searchParams.get('to_city')!);
              }
              router.push(`/search/${key}?${newSearchParams.toString()}`);
            }}
            size="large"
          />
        </div>
        <div className="bg-white rounded">
          <PathForm type={getActiveKey() as SearchType} />
        </div>
        <div>{children}</div>
      </Content>
    </AntLayout>
  );
};

const SuspenseLayout: FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense>
    <SearchLayout>{children}</SearchLayout>
  </Suspense>
);

export default SuspenseLayout;

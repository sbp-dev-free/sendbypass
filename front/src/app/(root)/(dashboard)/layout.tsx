'use client';

import { FC, useEffect, useState } from 'react';
import { MenuProps, Menu, Layout as AntLayout, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';

import { dashboardItems } from '@/app/_dtos/sidebars';
import { usePathname } from 'next/navigation';
import { destroyToken } from '@/app/_utils/token';
import clsx from 'clsx';
import Link from 'next/link';
import { GetProfileType } from '@/app/_components/Profile/types';
import useFetcher from '@/app/_hooks/useFetcher';
import URLS from '@/app/_configs/urls';
import { RootLayoutProps } from '../../layout';

interface LayoutProps extends RootLayoutProps {}

const Layout: FC<LayoutProps> = ({ children = null }) => {
  const [current, setCurrent] = useState('dashboard');
  const { data: profile, isLoading } = useFetcher<GetProfileType>({
    url: URLS.profile(),
    isProtected: true,
  });
  const pathname = usePathname();
  const filteredDashboardItems =
    profile?.type === 'BUSINESS'
      ? (dashboardItems || []).filter((item) => item && item.key !== 'trips')
      : dashboardItems || [];

  useEffect(() => {
    if (pathname.startsWith('/dashboard')) {
      setCurrent('dashboard');
    }
    if (pathname.startsWith('/requirements')) {
      setCurrent('requirements');
    }
    if (pathname.startsWith('/trips')) {
      setCurrent('trips');
    }
    if (pathname.startsWith('/profile')) {
      setCurrent('profile');
    }
  }, [pathname]);

  const onClick: MenuProps['onClick'] = async (e) => {
    setCurrent(e.key);
    if (e.key === 'logout') {
      destroyToken();
      window.location.href = '/';
    }
  };
  return (
    <AntLayout className="min-h-full">
      <Sider className="hidden md:block">
        <Menu
          className="h-full"
          items={filteredDashboardItems}
          mode="inline"
          onClick={onClick}
          selectedKeys={[current]}
        />
      </Sider>

      <Content
        className={clsx('', {
          'p-2': pathname !== '/profile',
        })}
      >
        {profile &&
          profile?.type === 'PERSONAL' &&
          (!profile?.first_name || !profile?.last_name) &&
          !isLoading && (
            <div className="text-white px-4 py-2 bg-[#EB9A0B] flex justify-center gap-2 mb-2">
              <Typography className="text-white font-normal">
                Please ensure your profile includes your first and last name
                before adding a trip.{' '}
                {pathname !== '/profile' && (
                  <Link
                    href="/profile"
                    target="_blank"
                    className="text-inherit text-base font-bold"
                  >
                    Go to profile
                  </Link>
                )}
              </Typography>
            </div>
          )}
        {children}
      </Content>
    </AntLayout>
  );
};

export default Layout;

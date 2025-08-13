'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ControlBarItems } from '@/app/_dtos/controlBar';
import clsx from 'clsx';
import URLS from '@/app/_configs/urls';
import useFetcher from '@/app/_hooks/useFetcher';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { usePendingRequests } from '@/app/_hooks/usePendingRequests';
import { usePendingOrders } from '@/app/_hooks/usePendingOrders';

const ControlBar: FC = () => {
  const pathname = usePathname();
  const { data: profile } = useFetcher<any>({
    url: URLS.profile(),
    isProtected: true,
  });
  const { requestsBadge } = usePendingRequests();
  const { ordersBadge } = usePendingOrders();

  return (
    <div className="w-full sm:hidden flex px-2 justify-around bg-[#F8F1FA] shadow-2xl z-20 fixed bottom-0 items-center">
      {profile?.email ? (
        <Link
          href="/profile"
          className="flex flex-col items-center gap-1 h-full w-[52px]"
        >
          <Avatar
            className={clsx('bg-gray-300 border-2', {
              'border-[#67548E] text-[#67548E]': pathname === '/profile',
              'border-[#7A757F] text-[#7A757F]': pathname !== '/profile',
            })}
            src={profile?.image}
            icon={<UserOutlined />}
            size="default"
          />
          <span
            className={clsx('text-xs', {
              'text-[#1D1B20] font-bold': pathname === '/profile',
              'text-[#7A757F]': pathname !== '/profile',
            })}
          >
            Profile
          </span>
        </Link>
      ) : (
        <Link
          href="/login"
          className="flex flex-col items-center gap-1 h-full w-[52px]"
        >
          <UserOutlined
            className={`text-xl ${pathname === '/login' ? 'text-[#1D1B20] font-bold' : 'text-[#7A757F]'}`}
          />
          <span
            className={clsx('text-xs', {
              'text-[#1D1B20] font-bold': pathname === '/login',
              'text-[#7A757F]': pathname !== '/login',
            })}
          >
            Login
          </span>
        </Link>
      )}
      {ControlBarItems.filter(
        (item) => !(item.label === 'Trips' && profile?.type === 'BUSINESS'),
      ).map((item) => {
        const isActive = item.url === pathname;

        return (
          <Link
            className={`relative w-[52px] flex flex-col gap-1 items-center justify-center h-full py-3 text-xs
            ${isActive ? 'text-[#1D1B20] font-bold' : 'text-[#7A757F]'}
            `}
            key={item.url}
            href={item.url}
          >
            {item.icon}
            <span className="relative">
              {item.label} {item.label === 'Requests' && requestsBadge}
              {item.label === 'Orders' && ordersBadge}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default ControlBar;

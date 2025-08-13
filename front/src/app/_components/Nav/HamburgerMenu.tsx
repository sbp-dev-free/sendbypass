'use client';

import URLS from '@/app/_configs/urls';
import { RewardSidebar, SentSidebar, ShopSidebar } from '@/app/_dtos/sidebars';
import useFetcher from '@/app/_hooks/useFetcher';
import { GetProfileType } from '@/app/_components/Profile/types';
import { destroyToken } from '@/app/_utils/token';
import { HiOutlineMenu } from 'react-icons/hi';
import { Drawer, Menu, MenuProps } from 'antd';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { publicItems } from '@/app/_dtos/sidebars/public';
import Link from 'next/link';
import { LogoutOutlined } from '@ant-design/icons';

export const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('');
  const pathname = usePathname();

  const { data: profile } = useFetcher<GetProfileType>({
    url: URLS.profile(),
    isProtected: true,
  });

  const dynamicPublicItems = profile
    ? [
        ...publicItems,
        {
          key: 'logout',
          label: (
            <Link href="/" replace>
              Logout
            </Link>
          ),
          icon: <LogoutOutlined />,
        },
      ]
    : publicItems;

  useEffect(() => {
    if (pathname === '/dashboard') {
      setCurrent('dashboard');
    }
    if (
      pathname === '/requirements' ||
      pathname === '/trips' ||
      pathname === '/profile'
    ) {
      setCurrent(pathname.slice(1));
    }

    if (pathname.includes('/requests')) {
      setCurrent('my-trips');
    }
    if (pathname.includes('/received/shipping')) {
      setCurrent('shipping-received');
    }
  }, [pathname]);

  const onClick: MenuProps['onClick'] = async (e) => {
    setCurrent(e.key);
    if (e.key === 'logout') {
      destroyToken();

      window.location.href = '/';
    }
    setOpen(false);
  };

  const handleToggle = () => setOpen(!open);

  return (
    <div>
      <HiOutlineMenu className="text-xl" onClick={handleToggle} />
      <Drawer
        title={<div className="capitalize">Menu</div>}
        onClose={handleToggle}
        open={open}
        placement="left"
      >
        <Menu
          className="!border-none"
          items={dynamicPublicItems}
          onClick={onClick}
          selectedKeys={[current]}
        />

        {pathname === '/search/reward' && <RewardSidebar />}
        {pathname === '/search/send' && <SentSidebar />}
        {pathname === '/search/shop' && <ShopSidebar />}
      </Drawer>
    </div>
  );
};

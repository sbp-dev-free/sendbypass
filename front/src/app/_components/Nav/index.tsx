'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useFetcher from '@/app/_hooks/useFetcher';
import URLS from '@/app/_configs/urls';
import { Button, Divider } from 'antd';
import Avatar from 'antd/es/avatar/avatar';
import clsx from 'clsx';
import { UserOutlined } from '@ant-design/icons';
import { usePendingRequests } from '@/app/_hooks/usePendingRequests';
import { usePendingOrders } from '@/app/_hooks/usePendingOrders';
import Logo from './Logo';
import { HamburgerMenu } from './HamburgerMenu';

const commonMenuItems = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'search', label: 'Connect Hub', href: '/search/send' },
  { key: 'about', label: 'About us', href: '/about-us' },
  { key: 'contact', label: 'Contact us', href: '/contact' },
  { key: 'security', label: 'Security', href: '/security' },
  { key: 'faq', label: 'FAQ', href: '/faq' },
];

const authenticatedItems = [
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { key: 'requests', label: 'Requests', href: '/requests' },
  { key: 'orders', label: 'Orders', href: '/orders' },
];
const Nav: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [current, setCurrent] = useState('home');
  const pathname = usePathname();

  const { data: profile } = useFetcher<any>({
    url: URLS.profile(),
    isProtected: true,
  });

  const { requestsBadge } = usePendingRequests();
  const { ordersBadge } = usePendingOrders();

  useEffect(() => {
    if (pathname === '/') setCurrent('home');
    else if (pathname.startsWith('/dashboard')) setCurrent('dashboard');
    else if (pathname.startsWith('/about-us')) setCurrent('about');
    else if (pathname.startsWith('/profile')) setCurrent('profile');
    else if (pathname.startsWith('/contact')) setCurrent('contact');
    else if (pathname.startsWith('/requests')) setCurrent('requests');
    else if (pathname.startsWith('/orders')) setCurrent('orders');
    else if (pathname.startsWith('/search')) setCurrent('search');
    else if (pathname.startsWith('/faq')) setCurrent('faq');
    else if (pathname.startsWith('/security')) setCurrent('security');
  }, [pathname]);

  const renderMenuItems = (items: any) =>
    items.map((item: any) => (
      <Link
        key={item.key}
        href={item.href}
        className={`px-1 py-2 text-xs lg:text-sm whitespace-nowrap relative ${
          current === item.key
            ? 'text-[#67548E] text-base font-semibold'
            : 'text-[#1D1B20] hover:text-[#67548E] font-normal'
        }`}
      >
        {item.label}
        {item.key === 'requests' && requestsBadge}
        {item.key === 'orders' && ordersBadge}
      </Link>
    ));

  return (
    <nav className="bg-[#F2ECF4] fixed w-full top-0 z-50 h-[80px] flex items-center">
      <div
        className={clsx(
          'flex items-center justify-between px-4 py-2 w-full container mx-auto',
        )}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center justify-start sm:justify-end xl:gap-12">
            <Logo />
            <div className="hidden sm:flex items-center md:space-x-2">
              {renderMenuItems(commonMenuItems)}
            </div>
          </div>

          <div className="items-center justify-between space-x-4 hidden sm:flex">
            {profile?.email && (
              <div className="hidden sm:flex items-center md:space-x-2">
                {renderMenuItems(authenticatedItems)}
                <Divider type="vertical" className="border-[#67548E]/20 h-6" />
              </div>
            )}

            {profile?.email ? (
              <Link
                href="/profile"
                className="hidden sm:flex items-center space-x-2"
              >
                <span
                  className={clsx(
                    'hidden font-normal truncate w-auto lg:block lg:max-w-full',
                    {
                      'text-[#67548E] font-semibold': current === 'profile',
                      'text-[#1D1B20]': current !== 'profile',
                    },
                  )}
                >
                  {profile.email}
                </span>
                <Avatar
                  className={clsx('bg-gray-300 border-2', {
                    'border-[#67548E] text-[#67548E]': current === 'profile',
                    'border-gray-400 text-gray-400': current !== 'profile',
                  })}
                  src={profile?.image}
                  icon={<UserOutlined />}
                  size="large"
                />
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm text-gray-700 whitespace-nowrap"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
        <div className="sm:hidden">
          <Button
            type="link"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="focus:outline-none text-gray-700"
          >
            <HamburgerMenu />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;

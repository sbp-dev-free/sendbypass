'use client';

import Logo from '@/app/_components/Nav/Logo';
import Typography from 'antd/es/typography/Typography';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { BiChevronLeft } from 'react-icons/bi';
import { HiOutlineMenu } from 'react-icons/hi';
import { publicItems } from '@/app/_dtos/sidebars/public';
import { Drawer, Menu, MenuProps } from 'antd';

const CheckEmailPage: FC = () => {
  const [email, setEmail] = useState<string | null>('');

  useEffect(() => {
    setEmail(sessionStorage.getItem('email'));
  }, []);

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('');
  const handleToggle = () => setOpen(!open);
  const onClick: MenuProps['onClick'] = async (e) => {
    setCurrent(e.key);
    setOpen(false);
  };

  return (
    <div className="w-full h-full flex flex-col p-[24px]">
      <div className="mb-[48px] flex justify-between">
        <Logo />
        <HiOutlineMenu
          className="text-xl block lg:hidden"
          onClick={handleToggle}
        />
        <Drawer
          title={<div className="capitalize">Menu</div>}
          onClose={handleToggle}
          open={open}
          placement="left"
        >
          <Menu
            className="!border-none"
            items={publicItems}
            onClick={onClick}
            selectedKeys={[current]}
          />
        </Drawer>
      </div>
      <div className="space-y-2 mb-6">
        <Link
          href="/login"
          className="inline-flex items-center text-gray-500 text-lg"
        >
          <BiChevronLeft size={24} />
          <span>Back</span>
        </Link>
      </div>
      <div className="flex grow items-center w-full justify-center gap-8 flex-col p-2 xl:p-6 shadow-md bg-white rounded-lg">
        <Typography className="text-lg text-gray-700">
          link will be sent to the entered email.
        </Typography>
        <Typography className="text-lg font-bold text-gray-600">
          {email}
        </Typography>
        <Image
          src="/img/auth/sent-email.png"
          width={169}
          height={185}
          alt="email sent icon"
        />
      </div>
    </div>
  );
};

export default CheckEmailPage;

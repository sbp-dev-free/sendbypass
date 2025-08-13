'use client';

import { FC, useState } from 'react';
import {
  Form,
  Typography,
  Input,
  Button,
  message,
  Drawer,
  Menu,
  MenuProps,
} from 'antd';
import useEnsureMounted from '@/app/_hooks/useEnsureMounted';
import Logo from '@/app/_components/Nav/Logo';

import Link from 'next/link';
import { BiChevronLeft } from 'react-icons/bi';
import axios from 'axios';
import URLS from '@/app/_configs/urls';
import { useRouter } from 'next/navigation';
import { HiOutlineMenu } from 'react-icons/hi';
import { publicItems } from '@/app/_dtos/sidebars/public';

const ForgotPasswordPage: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const isMounted = useEnsureMounted();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('');
  const handleToggle = () => setOpen(!open);
  const onClick: MenuProps['onClick'] = async (e) => {
    setCurrent(e.key);
    setOpen(false);
  };

  if (!isMounted) {
    return null;
  }

  const handleSendResetPassword = async (values: any) => {
    setIsLoading(true);
    try {
      await axios.post(URLS.forgotPassword(), values);
      sessionStorage.setItem('email', values.email);
      push('/check-email');
    } catch (error: any) {
      messageApi.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full h-full flex flex-col p-[24px]">
      <div className="mb-[48px] flex  justify-between">
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
        <Typography className="text-[#67548E] text-xl">
          Forgot password
        </Typography>
      </div>
      <div className="flex grow items-center w-full justify-center flex-col p-2 xl:p-6 shadow-md bg-white rounded-lg">
        {contextHolder}
        <Form
          onFinish={handleSendResetPassword}
          className="text-center w-full px-4 2xl:px-24"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please enter your email!' }]}
          >
            <Input size="large" placeholder="Email or Phone number" />
          </Form.Item>
          <Form.Item>
            <Button
              size="large"
              className="w-full"
              htmlType="submit"
              type="primary"
              loading={isLoading}
            >
              Send link
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

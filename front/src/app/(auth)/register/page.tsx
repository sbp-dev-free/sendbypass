'use client';

import { FC, useState } from 'react';
import {
  Form,
  Typography,
  Input,
  Button,
  message,
  Image,
  Divider,
  MenuProps,
  Drawer,
  Menu,
} from 'antd';
import useEnsureMounted from '@/app/_hooks/useEnsureMounted';
import Logo from '@/app/_components/Nav/Logo';
import Link from 'next/link';
import axios from 'axios';
import URLS from '@/app/_configs/urls';
import { useRouter } from 'next/navigation';
import { HiOutlineMenu } from 'react-icons/hi';
import { publicItems } from '@/app/_dtos/sidebars/public';

const { Text } = Typography;

const RegisterPage: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('');
  const handleToggle = () => setOpen(!open);
  const onClick: MenuProps['onClick'] = async (e) => {
    setCurrent(e.key);
    setOpen(false);
  };
  const { push } = useRouter();

  const isMounted = useEnsureMounted();

  if (!isMounted) {
    return null;
  }

  const handleRegister = async (values: any) => {
    setIsLoading(true);
    try {
      sessionStorage.setItem('email', values.email);
      await axios.post(URLS.register(), values);
      push('/check-email');
    } catch (error: any) {
      messageApi.error(error.message);
    }
    setIsLoading(false);
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
        <Typography className="text-[#67548E] text-xl">
          Register an account
        </Typography>
        <Typography className="text-lg text-gray-500">
          Register to use Sendbypass full service.{' '}
        </Typography>
      </div>
      <div className="flex grow items-center w-full justify-center flex-col p-2 xl:p-6 shadow-md bg-white rounded-lg">
        {contextHolder}
        <Form onFinish={handleRegister} className="w-full px-4">
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please enter your email!' }]}
          >
            <Input size="large" placeholder="Email or Phone number" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input size="large" placeholder="Password" type="password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'The new password that you entered do not match!',
                    ),
                  );
                },
              }),
            ]}
          >
            <Input
              size="large"
              placeholder="Confirm Password"
              type="password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              size="large"
              className="w-full"
              htmlType="submit"
              type="primary"
              loading={isLoading}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
        <Divider className="border-gray-300">
          <span className="text-gray-500 mx-4 lg:mx-12">Or</span>
        </Divider>
        <div className="px-4 w-full">
          <Button
            size="large"
            className="border border-gray-300 w-full text-gray-700"
            type="link"
            href="https://google.com"
            icon={<Image src="/img/auth/google-logo.png" preview={false} />}
          >
            Google
          </Button>
        </div>
        <div className="text-center mt-4">
          <Text>
            Do you have an account? <Link href="/login">Log in</Link>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

'use client';

import { FC, useEffect, useState } from 'react';
import {
  Form,
  Typography,
  Input,
  Button,
  message,
  Divider,
  Image,
  Drawer,
  Menu,
  MenuProps,
} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/app/_components/Nav/Logo';
import axios from 'axios';
import URLS from '@/app/_configs/urls';
import { setTokens } from '@/app/_utils/token';
import { HiOutlineMenu } from 'react-icons/hi';
import { publicItems } from '@/app/_dtos/sidebars/public';

const { Text } = Typography;
const LoginPage: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('');
  const handleToggle = () => setOpen(!open);
  const onClick: MenuProps['onClick'] = async (e) => {
    setCurrent(e.key);
    setOpen(false);
  };
  const handleRedirect = () => {
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirectUrl');
    if (redirectUrl) {
      push(decodeURIComponent(redirectUrl));
    } else {
      window.location.href = '/';
    }
  };

  const handleLogin = async (values: any) => {
    setIsLoading(true);
    try {
      const response: any = await axios.post(URLS.login(), values);
      if (response?.data) {
        setTokens({
          access: response.data.access,
          refresh: response.data.refresh,
        });
      }
      if (response?.message === 'Invalid credentials') {
        messageApi.error('Invalid credentials');
        setIsLoading(false);
        return;
      }

      messageApi.success('Successfully logged in');
      setTimeout(() => {
        handleRedirect();
      }, 1000);
    } catch (error) {
      messageApi.error('Invalid credentials');
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/api/login-status');
        if (response.data.status) {
          messageApi.success('Successfully logged in');
          await axios.post('/api/login-status', { status: false });
          handleRedirect();
        }
      } catch (error) {
        console.log('Error checking login status:', error);
      }
    };

    const interval = setInterval(checkLoginStatus, 2000);

    return () => {
      clearInterval(interval);
      setIsLoading(false);
    };
  }, []);

  const openGoogleLogin = async () => {
    setIsLoading(true);

    const width = 600;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirectUrl');

    let googleLoginUrl = 'https://api.sendbypass.com/v1/google_login/';
    if (redirectUrl) {
      googleLoginUrl += `?redirect_url=${encodeURIComponent(redirectUrl)}`;
    }

    window.open(
      googleLoginUrl,
      'GoogleLogin',
      `width=${width},height=${height},top=${top},left=${left}`,
    );
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
          Login to account
        </Typography>
        <Typography className="text-lg text-gray-500">
          Log in to use Sendbypass full service.{' '}
        </Typography>
      </div>
      <div className="flex grow items-center w-full justify-center flex-col p-2 xl:p-6 shadow-md bg-white rounded-lg">
        {contextHolder}
        <Form onFinish={handleLogin} className="w-full px-4">
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

          <Form.Item>
            <Button
              size="large"
              loading={isLoading}
              className="w-full"
              htmlType="submit"
              type="primary"
            >
              Login
            </Button>
          </Form.Item>
          <Button
            type="link"
            href="/reset-password"
            className="flex justify-center"
          >
            Forgot password?
          </Button>
        </Form>
        <Divider className="border-gray-300">
          <span className="text-gray-500 mx-4 lg:mx-12">Or</span>
        </Divider>
        <div className="px-4 w-full">
          <Button
            size="large"
            className="border border-gray-300 w-full text-gray-700"
            type="link"
            icon={<Image src="/img/auth/google-logo.png" preview={false} />}
            onClick={openGoogleLogin}
          >
            Google
          </Button>
        </div>
        <div className="text-center mt-4">
          <Text>
            Have you not registered yet? <Link href="/register">Register</Link>
          </Text>
          <div className="mt-6">
            By logging in to Sendbypass, you agree to our{' '}
            <Link href="/terms-of-service">Terms of services</Link> and
            <Link href="/privacy-policy"> Privacy policy</Link>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

'use client';

import { FC, useState } from 'react';
import {
  Form,
  Typography,
  Input,
  Button,
  message,
  MenuProps,
  Drawer,
  Menu,
} from 'antd';
import Logo from '@/app/_components/Nav/Logo';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import URLS from '@/app/_configs/urls';
import { calculatePasswordStrength } from '@/app/_utils/passwordStrength';
import { useForm } from 'antd/es/form/Form';
import { HiOutlineMenu } from 'react-icons/hi';
import { publicItems } from '@/app/_dtos/sidebars/public';

const ResetPasswordPage: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { params } = useParams();
  const { push } = useRouter();
  const [form] = useForm();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('');
  const handleToggle = () => setOpen(!open);
  const onClick: MenuProps['onClick'] = async (e) => {
    setCurrent(e.key);
    setOpen(false);
  };

  const handleResetPassword = async (values: any) => {
    setIsLoading(true);
    try {
      const uid = params?.[0];
      const token = params?.[1];
      if (uid && token) {
        await axios.post(URLS.resetPassword(uid, token), values);
        messageApi.success('Your password succesfully changed.');
        setTimeout(() => {
          push('/login');
        }, 400);
      }
    } catch (error: any) {
      messageApi.error(error.message);
    }
    setIsLoading(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    const strength = calculatePasswordStrength(newPassword);
    setPasswordStrength(strength);
    form.setFieldValue('password', newPassword);
  };

  const getStrengthColor = (strength: number) => {
    if (strength < 40) return 'red';
    if (strength < 70) return 'orange';
    return 'green';
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
          Set new password{' '}
        </Typography>
        <Typography className="text-lg text-gray-500">
          Must be at least 8 characters.
        </Typography>
      </div>
      <div className="flex grow items-center w-full justify-center flex-col p-2 xl:p-6 shadow-md bg-white rounded-lg">
        {contextHolder}
        <Form
          form={form}
          onFinish={handleResetPassword}
          className="text-center w-full px-4 2xl:px-24"
        >
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter your password!' },
              { min: 8, message: 'Must be at least 8 characters.' },
            ]}
          >
            <Input
              size="large"
              placeholder="Password"
              type="password"
              onChange={handlePasswordChange}
            />
            <div className="flex space-x-1 mt-2">
              <div
                className="h-1 flex-grow"
                style={{
                  backgroundColor:
                    passwordStrength >= 25
                      ? getStrengthColor(passwordStrength)
                      : '#e0e0e0',
                }}
              />
              <div
                className="h-1 flex-grow"
                style={{
                  backgroundColor:
                    passwordStrength >= 50
                      ? getStrengthColor(passwordStrength)
                      : '#e0e0e0',
                }}
              />
              <div
                className="h-1 flex-grow"
                style={{
                  backgroundColor:
                    passwordStrength >= 75
                      ? getStrengthColor(passwordStrength)
                      : '#e0e0e0',
                }}
              />
              <div
                className="h-1 flex-grow"
                style={{
                  backgroundColor:
                    passwordStrength >= 100
                      ? getStrengthColor(passwordStrength)
                      : '#e0e0e0',
                }}
              />
            </div>
          </Form.Item>
          <Form.Item
            name="confirm_password"
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
              Rest password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

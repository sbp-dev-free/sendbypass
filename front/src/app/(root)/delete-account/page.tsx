'use client';

import { FC, useState, useEffect } from 'react';
import { Typography, Button, message } from 'antd';
import URLS from '@/app/_configs/urls';
import axios from 'axios';
import { injectAccessToken } from '@/app/_utils/fetcher';
import { useRouter } from 'next/navigation';

const DeleteAccountPage: FC = () => {
  const [countdown, setCountdown] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { push } = useRouter();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const newConfig = await injectAccessToken(true);
      if (!newConfig) {
        setIsLoading(false);
        return;
      }
      await axios.delete(URLS.deleteAccount(), newConfig);
      messageApi.success('Account successfully deleted');
      setTimeout(() => {
        push('/');
      }, 2000);
    } catch (error) {
      messageApi.error('Failed to delete account. Please try again.');
      console.error('Error', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {contextHolder}
      <div className="container mx-auto mt-12 flex flex-col grow">
        <div className="p-4 bg-white rounded-xl lg:mb-12">
          <Typography.Title level={1} className="font-bold text-gray-800 !mb-0">
            Delete Account
          </Typography.Title>
          <p className="text-xs font-normal">
            Permanently remove your account and all associated data.
          </p>
          <p className="text-sm font-normal lg:my-8 mt-8 mb-48">
            Deleting your account is permanent and cannot be undone. All your
            data, including your profile, settings, and history, will be
            permanently erased.
          </p>
          <div className="flex flex-col lg:flex-row lg:justify-end items-center gap-4 mt-8">
            <Button
              type="primary"
              size="large"
              className="bg-white text-[#67548E] text-sm w-full lg:w-auto"
              href="/"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              className={`transition-colors duration-300 border-none text-sm w-full lg:w-auto ${
                countdown > 0
                  ? 'bg-[#65558F14] text-[#CBC4D0]'
                  : 'bg-[#BF0024] text-white'
              }`}
              disabled={countdown > 0}
              onClick={handleDeleteAccount}
              loading={isLoading}
            >
              {`Delete my Account${countdown > 0 ? `(${countdown})` : ''} `}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteAccountPage;

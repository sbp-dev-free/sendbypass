'use client';

import Logo from '@/app/_components/Nav/Logo';
import URLS from '@/app/_configs/urls';
import { destroyToken } from '@/app/_utils/token';
import { message, Spin, Typography } from 'antd';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BiChevronLeft } from 'react-icons/bi';

const VerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { push } = useRouter();
  const { params } = useParams();
  const [messageApi, contextHolder] = message.useMessage();

  const isNotValidParam =
    !params?.length || params.length < 2 || params.length > 2;

  useEffect(() => {
    if (isNotValidParam) {
      return notFound();
    }
  }, [isNotValidParam]);

  useEffect(() => {
    const handleVerifyEmail = async () => {
      setIsLoading(true);

      try {
        if (params?.[0] && params?.[1]) {
          await axios.post(URLS.verifyEmail(params[0], params[1]));
          messageApi.success('Your account successfully verified.');
          destroyToken();

          setTimeout(() => {
            push('/login');
          }, 1000);
        }
      } catch (error: any) {
        if (error?.response) {
          if (error?.response?.data === 'No invalid token or id') {
            messageApi.error('You are already verified');
          } else {
            messageApi.error(error?.response?.data);
          }
        }

        setTimeout(() => {
          push('/login');
        }, 1500);
      } finally {
        setIsLoading(false);
      }
    };
    handleVerifyEmail();
  }, []);

  return (
    <div className="h-screen flex flex-col gap-6 justify-center items-center">
      {contextHolder}
      <div className="w-full h-full flex flex-col p-[24px]">
        <div className="mb-[48px]">
          <Logo />
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
            Your account {isLoading ? 'is verifying' : 'successfully verified'}
          </Typography>
          <Image
            src="/img/auth/sent-email.png"
            width={169}
            height={185}
            alt="email sent icon"
          />
          <Spin size="large" spinning={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

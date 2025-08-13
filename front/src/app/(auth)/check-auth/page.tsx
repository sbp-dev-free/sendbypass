'use client';

import URLS from '@/app/_configs/urls';
import { setTokens } from '@/app/_utils/token';
import { Spin } from 'antd';
import axios from 'axios';
import { notFound, useSearchParams } from 'next/navigation';
import { FC, Suspense, useEffect, useState } from 'react';

const CheckAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const params = useSearchParams();
  const state = params.get('state') || '';
  const code = params.get('code') || '';
  const error = params.get('error') || '';

  const isNotValidParam = !state || !code;

  useEffect(() => {
    if (isNotValidParam) {
      return notFound();
    }
  }, [isNotValidParam]);

  useEffect(() => {
    const handleCheckToken = async () => {
      setIsLoading(true);
      try {
        const { data }: any = await axios.post(URLS.googleRedirect(), {
          state,
          code,
          error,
        });

        if (data.token.access && data.token.refresh) {
          await axios.post('/api/login-status', { status: true });
          setTokens({ access: data.token.access, refresh: data.token.refresh });
        }
        window.close();
      } catch (error) {
        console.log('token', error);
      }
      setIsLoading(false);
    };
    handleCheckToken();
  }, [code, state, error]);

  return (
    <div className="h-screen flex flex-col gap-6 justify-center items-center">
      <Spin size="large" spinning={isLoading} />
    </div>
  );
};

const SuspenseCheckAuth: FC = () => (
  <Suspense>
    <CheckAuth />
  </Suspense>
);

export default SuspenseCheckAuth;

'use client';

import useSWR from 'swr';
import { AxiosRequestConfig } from 'axios';
import fetcher, { FetcherParams } from '../_utils/fetcher';

const useFetcher = <T>({
  url,
  isProtected = false,
  redirect = true,
  shouldFetch = true,
  config,
}: FetcherParams) => {
  return useSWR<T>(
    {
      url,
      shouldFetch,
      isProtected: isProtected as boolean,
      redirect: redirect as boolean,
      config: config as AxiosRequestConfig,
    },
    fetcher as any,
  );
};

export default useFetcher;

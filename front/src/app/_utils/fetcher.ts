'use client';

import axios, { AxiosRequestConfig, HttpStatusCode } from 'axios';
import merge from 'lodash/merge';
import Cookies from 'js-cookie';
import { destroyToken } from './token';

export interface FetcherParams {
  url: string;
  shouldFetch?: boolean;
  isProtected?: boolean;
  redirect?: boolean;
  config?: AxiosRequestConfig;
}

export const injectAccessToken = async (
  redirect: boolean = true,
  config?: AxiosRequestConfig,
): Promise<AxiosRequestConfig | null> => {
  const token = Cookies.get('access');
  if (!token) {
    console.error('no token');
    return null;
  }

  const newConfig: AxiosRequestConfig = merge(config, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return newConfig;
};

const fetcher = async ({
  url,
  shouldFetch = true,
  isProtected = false,
  redirect = true,
  config,
}: FetcherParams) => {
  if (!shouldFetch) {
    return null;
  }

  if (!isProtected) {
    return axios
      .get(url, config)
      .then((res) => res.data)
      .catch((error) => {
        console.error('fetcher error not protected: ', error);
        return null;
      });
  }

  // protected
  const newConfig = await injectAccessToken(redirect, config);
  if (!newConfig) {
    return null;
  }

  try {
    const res = await axios.get(url, newConfig);
    return res.data;
  } catch (e) {
    console.error('fetcher error protected: ', e);
    if (
      axios.isAxiosError(e) &&
      e.response?.status === HttpStatusCode.Unauthorized
    ) {
      destroyToken();
    }
  }

  return null;
};

export default fetcher;

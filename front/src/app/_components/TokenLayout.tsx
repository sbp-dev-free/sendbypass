'use client';

import axios from 'axios';
import { ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { destroyToken, getToken, setToken } from '../_utils/token';
import URLS from '../_configs/urls';

export const TokenLayout = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const interval = setInterval(async () => {
      const token = getToken('access') ?? '';

      const now = Date.now();

      if (token) {
        const { exp: tokenExp } = jwtDecode(token);
        if (
          tokenExp &&
          new Date(tokenExp * 1000).getTime() - new Date().getTime() < 5000
        ) {
          try {
            const {
              data: { access },
            } = await axios.post(URLS.refresh(), {
              refresh: getToken('refresh'),
            });
            const { exp: tokenExp } = jwtDecode(access);
            if (tokenExp) {
              setToken('access', access, Math.ceil(tokenExp - now / 1000));
            }
          } catch (error) {
            destroyToken();
          }
        }
      }
    }, 1000);

    if (getToken('refresh') && !getToken('access')) {
      const getRefreshToken = async () => {
        const {
          data: { access },
        } = await axios.post(URLS.refresh(), {
          refresh: getToken('refresh'),
        });
        const { exp: tokenExp } = jwtDecode(access);
        const now = Date.now();
        if (tokenExp) {
          setToken('access', access, Math.ceil(tokenExp - now / 1000));
        }
      };
      getRefreshToken();
    }

    return () => clearInterval(interval);
  }, []);
  return children;
};

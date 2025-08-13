import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const setToken = (name: string, token: string, expire: number) => {
  Cookies.set(name, token, {
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    expires: expire / (24 * 60 * 60),
  });
};

export const setTokens = ({
  access,
  refresh,
}: {
  access: string;
  refresh: string;
}) => {
  const { exp: tokenExp } = jwtDecode(access);
  const { exp: refreshExp } = jwtDecode(refresh);
  const now = Date.now();
  if (tokenExp) {
    setToken('access', access as string, Math.ceil(tokenExp - now / 1000));
  }
  if (refreshExp) {
    setToken('refresh', refresh, Math.ceil(refreshExp - now / 1000));
  }
};

export const getToken = (name: string) => {
  return Cookies.get(name);
};

export const destroyToken = () => {
  Cookies.remove('access', {
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
  });
  Cookies.remove('refresh', {
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
  });
};

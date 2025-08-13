import { ReadonlyURLSearchParams } from 'next/navigation';

const paramsToObject = (
  searchParams: ReadonlyURLSearchParams
): Record<string, string | string[]> => {
  const params: Record<string, string | string[]> = {};

  searchParams.forEach((value, key) => {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        (params[key] as string[]).push(value);
      } else {
        params[key] = [params[key] as string, value];
      }
    } else {
      params[key] = value;
    }
  });

  return params;
};

export default paramsToObject;

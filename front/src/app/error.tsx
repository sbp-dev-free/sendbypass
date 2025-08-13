'use client';

import { Result } from 'antd';
import Link from 'next/link';

const ErrorPage = () => (
  <Result
    status="500"
    title="500"
    subTitle="Sorry, something went wrong."
    extra={<Link href="/">Back Home</Link>}
  />
);

export default ErrorPage;

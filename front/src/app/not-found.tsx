'use client';

import { Result } from 'antd';
import Link from 'next/link';

const ErrorPage = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Link href="/">Back Home</Link>}
  />
);

export default ErrorPage;

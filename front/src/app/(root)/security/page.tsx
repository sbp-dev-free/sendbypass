import { FC } from 'react';
import { Security } from '@/app/_components/security';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sendbypass | Security',
};

const SecurityPage: FC = () => {
  return <Security />;
};

export default SecurityPage;

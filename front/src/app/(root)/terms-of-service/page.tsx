import { StaticPageFrame } from '@/app/_components/StaticPageFrame';
import { TermsOfService } from '@/app/_components/terms-of-service';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sendbypass | Terms of service',
};

const TermsAndConditions = () => {
  return (
    <StaticPageFrame title="Terms of Service">
      <TermsOfService />
    </StaticPageFrame>
  );
};

export default TermsAndConditions;

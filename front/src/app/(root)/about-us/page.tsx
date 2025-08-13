import { FC } from 'react';
import { AboutUs } from '@/app/_components/about-us';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sendbypass | About Us',
};

const AboutUsPage: FC = () => {
  return <AboutUs />;
};

export default AboutUsPage;

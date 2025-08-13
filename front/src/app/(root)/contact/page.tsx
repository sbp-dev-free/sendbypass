import { FC } from 'react';
import { ContactUs } from '@/app/_components/contact-us';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sendbypass | Contact Us',
};

const ContactPage: FC = () => {
  return <ContactUs />;
};

export default ContactPage;

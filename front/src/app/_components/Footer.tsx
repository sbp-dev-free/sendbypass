'use client';

import Title from 'antd/es/typography/Title';
import { Footer as AntFooter } from 'antd/es/layout/layout';
import { Divider, Typography } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Facebook } from '../icons/Facebook';
import { Instagram } from '../icons/Instagram';
import { Linkedin } from '../icons/Linkedin';
import Logo from './Nav/Logo';

const { Paragraph, Text } = Typography;

export const Footer = () => {
  const pathname = usePathname();

  const hasFooter =
    pathname === '/' ||
    pathname === '/contact' ||
    pathname === '/faq' ||
    pathname === '/terms-of-service' ||
    pathname === '/privacy-policy' ||
    pathname === '/security' ||
    pathname === '/about-us';

  return (
    <AntFooter
      className={clsx('bg-[#FEF7FF] px-6 z-10', {
        'pt-0 ': !hasFooter,
        'pt-10': hasFooter,
      })}
    >
      <div
        className={clsx('', {
          'container mx-auto': hasFooter,
        })}
      >
        <div
          className={clsx(
            'flex flex-col gap-5 lg:flex-row lg:justify-between justify-center',
            {
              hidden: !hasFooter,
            },
          )}
        >
          <div className="flex flex-col gap-2 lg:gap-4 lg:w-1/4">
            <Logo />
            <Paragraph>
              You can use the services you need while traveling. Send your
              packages at a reasonable price and in the shortest time, buy from
              outside your country and receive them at your destination
            </Paragraph>
          </div>
          <div className="space-y-4">
            <Title level={4}>Contact</Title>
            <div>
              <div className="flex items-center gap-2">
                <div className="size-1 rounded-full bg-[#CBC4CF]" />
                <Title level={5} className="mb-0 whitespace-nowrap">
                  Phone :
                </Title>
                <Text>+370 625 49672</Text>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1 rounded-full bg-[#CBC4CF]" />
                <Title level={5} className="mb-0 whitespace-nowrap">
                  Email :
                </Title>
                <Text>info@sendbypass.com</Text>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1 rounded-full bg-[#CBC4CF]" />
                <Title level={5} className="mb-0 whitespace-nowrap">
                  Address :
                </Title>
                <Text>
                  J. Balčikonio g. 19, Vilnius, Vilniaus m. sav. Lithuania
                </Text>
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:min-w-[300px]">
            <Title level={4}>Company</Title>
            <div>
              <div className="flex items-center gap-2">
                <div className="size-1 rounded-full bg-[#CBC4CF]" />
                <Link href="/about-us">
                  <Text className="mb-0">About us</Text>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1 rounded-full bg-[#CBC4CF]" />
                <Link href="/security">
                  <Text className="mb-0">Security</Text>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1 rounded-full bg-[#CBC4CF]" />
                <Link href="/faq">
                  <Text className="mb-0">FAQ</Text>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-col md:flex-row gap-4 items-center justify-between md:h-[56px] bg-[#F2ECF4] rounded-lg py-1 px-3">
          <div className="flex items-center gap-2 [&>*]:text-[#67548E]">
            <Link
              target="_blank"
              href="https://www.facebook.com/share/1ALJ919RC2/"
            >
              <Facebook />
            </Link>
            <Link
              target="_blank"
              href="https://www.instagram.com/sendbypass?igsh=MWpyNDB3enBmaWFtcA=="
            >
              <Instagram />
            </Link>
            <Link
              target="_blank"
              href="https://www.linkedin.com/company/sendbypass"
            >
              <Linkedin />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link className="text-[#49454E] whitespace-nowrap" href="/contact">
              Contact us
            </Link>
            <Link
              className="text-[#49454E] whitespace-nowrap"
              href="/terms-of-service"
            >
              Terms of service
            </Link>
            <Link
              className="text-[#49454E] whitespace-nowrap"
              href="/privacy-policy"
            >
              Privacy policy
            </Link>
            <Divider
              type="vertical"
              className="border-gray-400 hidden md:block"
            />
            <Text className="hidden md:block">Sendbypass © 2024.</Text>
          </div>
          <Text className="md:hidden block">Sendbypass © 2024.</Text>
        </div>
      </div>
    </AntFooter>
  );
};

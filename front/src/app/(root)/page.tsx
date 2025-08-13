'use client';

import { FC, useLayoutEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Carousel, Tabs, Card, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { FaShoppingBag, FaBox } from 'react-icons/fa';
import { FaArrowRight, FaPlaneUp } from 'react-icons/fa6';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PathForm, { SearchTypeEnum } from '../_components/path/Form';
import Workflow from '../_components/home/Workflow';

import '../styles/tabs.Module.css';
import { BlogCard } from '../_components/home/BlogCard';
import { BLOGS } from '../_dtos/blogs';

const { Paragraph, Text } = Typography;

const Home: FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const { push } = useRouter();
  const handleClickOnCard = () => {
    push('/security');
  };

  return (
    <div className="bg-[#FEF7FF]">
      <Content>
        <div className="container mx-auto pt-4 pb-12 flex flex-col gap-y-4">
          {!isMounted ? (
            <div className="w-full h-[200px] md:h-[300px] lg:h-[400px] xl:h-[650px] animate-pulse bg-[#67548E]/15 rounded-lg" />
          ) : (
            <Carousel
              autoplay
              adaptiveHeight
              className="block relative text-center"
              autoplaySpeed={4000}
              speed={1000}
            >
              <Image
                alt="banner 1"
                className="rounded"
                src="/img/banners/1.png"
                width={5000}
                height={5000}
                quality={100}
              />

              <Image
                alt="banner 2"
                className="rounded w-full"
                src="/img/banners/2.png"
                width={5000}
                height={5000}
                quality={100}
              />

              <Image
                alt="banner 3"
                className="rounded w-full"
                src="/img/banners/3.png"
                width={5000}
                height={5000}
                quality={100}
              />
            </Carousel>
          )}
          {!isMounted ? (
            <div className="w-full h-[120px] animate-pulse bg-[#67548E]/15 rounded-lg" />
          ) : (
            <div className="bg-white rounded-lg">
              <Tabs
                centered
                defaultActiveKey="send"
                items={[
                  {
                    key: 'send',
                    label: (
                      <div className="flex gap-2 items-center flex-wrap sm:text-base text-xs">
                        <FaPlaneUp className="sm:block hidden" />
                        Find passengers
                      </div>
                    ),
                    children: <PathForm type={SearchTypeEnum.Enum.send} />,
                  },
                  {
                    key: 'shop',
                    label: (
                      <div className="flex gap-2 items-center flex-wrap sm:text-base text-xs">
                        <FaShoppingBag className="sm:block hidden" />
                        Reward by shopping{' '}
                      </div>
                    ),
                    children: <PathForm type={SearchTypeEnum.Enum.shop} />,
                  },
                  {
                    key: 'reward',
                    label: (
                      <div className="flex gap-2 items-center flex-wrap sm:text-base text-xs">
                        <FaBox className="sm:block hidden" />
                        Reward by shipping{' '}
                      </div>
                    ),
                    children: <PathForm type={SearchTypeEnum.Enum.reward} />,
                  },
                ]}
                size="large"
              />
            </div>
          )}
          {!isMounted ? (
            <div className="w-full h-[90px] animate-pulse bg-[#67548E]/15 rounded-lg" />
          ) : (
            <div className="bg-white p-8 flex justify-center text-center rounded-lg">
              <div className="w-full">
                <Text className=" text-[#67548E] font-bold sm:text-lg text-sx">
                  SendBypass is an online platform that connects passengers,
                  shoppers, and senders to transport your luggage or purchases
                  from any location to any destination.
                </Text>
              </div>
            </div>
          )}
          {!isMounted ? (
            <div className="sm:flex-row flex-col gap-4 flex justify-between">
              <div className="w-full h-[400px] md:h-[300px] lg:h-[400px] xl:h-[600px] animate-pulse bg-[#67548E]/15 rounded-lg" />
              <div className="w-full h-[400px] md:h-[300px] lg:h-[400px] xl:h-[600px] animate-pulse bg-[#67548E]/15 rounded-lg" />
              <div className="w-full h-[400px] md:h-[300px] lg:h-[400px] xl:h-[600px] animate-pulse bg-[#67548E]/15 rounded-lg" />
            </div>
          ) : (
            <div className="sm:flex-row flex-col gap-4 flex justify-between">
              <Card
                actions={[
                  <Link href="/trips/create">
                    <Button className="w-full" size="large" type="primary">
                      Add Your Trip
                    </Button>
                  </Link>,
                ]}
                className="w-full bg-transparent"
                classNames={{
                  header: 'px-0',
                  body: 'py-0',
                  actions: 'block bg-transparent',
                }}
                cover={
                  <Image
                    alt="find a fellow cover"
                    src="/img/cards/passenger.png"
                    className="rounded-none"
                    width={1000}
                    height={1000}
                  />
                }
                title={
                  <div className="text-center p-2 bg-white rounded-t-lg">
                    <Text className="block text-[#67548E] font-black text-xl">
                      As a passenger
                    </Text>
                    <Text className="block text-[#67548E] font-medium text-wrap">
                      Earn money and travel for free
                    </Text>
                  </div>
                }
              />

              <Card
                actions={[
                  <Link href="/requirements/create">
                    <Button className="w-full" size="large" type="primary">
                      Add Your Luggage
                    </Button>
                  </Link>,
                ]}
                className="w-full bg-transparent"
                classNames={{
                  header: 'px-0',
                  body: 'py-0',
                  actions: 'block bg-transparent',
                }}
                cover={
                  <Image
                    alt="find a fellow cover"
                    src="/img/cards/sender.png"
                    className="rounded-none"
                    width={1000}
                    height={1000}
                  />
                }
                title={
                  <div className="text-center p-2 bg-white rounded-t-lg">
                    <Text className="block text-[#67548E] font-black text-xl">
                      As a sender
                    </Text>
                    <Text className="block text-[#67548E] font-medium text-wrap">
                      Send your luggage quickly and affordably
                    </Text>
                  </div>
                }
              />

              <Card
                actions={[
                  <Link href="/requirements/create">
                    <Button className="w-full" size="large" type="primary">
                      Add Your Order
                    </Button>
                  </Link>,
                ]}
                className="bg-transparent w-full"
                classNames={{
                  header: 'px-0',
                  body: 'py-0',
                  actions: 'block bg-transparent',
                }}
                cover={
                  <Image
                    alt="find a fellow cover"
                    src="/img/cards/shopper.png"
                    className="rounded-none"
                    width={1000}
                    height={1000}
                  />
                }
                title={
                  <div className="text-center p-2 bg-white rounded-t-lg">
                    <Text className="block text-[#67548E] font-black text-xl">
                      As a shopper
                    </Text>
                    <Text className="block text-[#67548E] font-medium text-wrap">
                      Buy everything from anywhere
                    </Text>
                  </div>
                }
              />
            </div>
          )}
          {!isMounted ? (
            <div className="w-full h-[490px] animate-pulse bg-[#67548E]/15 rounded-lg" />
          ) : (
            <div className="border border-white rounded-lg px-20 xl:min-h-[490px]">
              <div className="mt-8">
                <Paragraph className="text-center text-[#67548E] font-bold text-3xl">
                  How Sendbypass Works
                </Paragraph>

                <Workflow />
              </div>
            </div>
          )}
          {!isMounted ? (
            <div className="w-full h-[300px] animate-pulse bg-[#67548E]/15 rounded-lg" />
          ) : (
            <div className="flex sm:flex-row flex-col sm:justify-evenly justify-center my-12">
              <button
                type="button"
                onClick={handleClickOnCard}
                className="flex flex-col items-center text-center sm:w-1/3 mb-12"
              >
                <Image
                  alt="verified"
                  className="self-center object-scale-down size-44"
                  src="/img/cards/verified.png"
                  width={1000}
                  height={1000}
                />
                <Text className="font-bold mb-2 sm:text-xl text-2sm text-nowrap text-[#67548E]">
                  Verified Passenger, Shoppers and Sender
                </Text>
                <Text>
                  Trust is our top priority at Sendbypass, and we work hard to
                  ensure that our community treats all members with the utmost
                  respect.
                </Text>
              </button>

              <button
                type="button"
                onClick={handleClickOnCard}
                className="flex flex-col items-center text-center sm:w-1/3 mb-8"
              >
                <Image
                  alt="guaranteed"
                  className="self-center object-scale-down size-44"
                  src="/img/cards/guaranteed.png"
                  width={1000}
                  height={1000}
                />
                <Text className="font-bold mb-2 sm:text-2xl text-2sm text-[#67548E]">
                  Guaranteed Delivery
                </Text>
                <Text>
                  If a traveler cancels your order or delivers an item in bad
                  condition, we will issue a full refund and aim to match you
                  with a new passenger.
                </Text>
              </button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <div className="uppercase font-bold text-3xl text-[#1D1B1F] pl-4">
                Blog
              </div>
              <span className="text-[#1D1B1F] pl-4">
                Discover insights, tips, and inspiration
              </span>
            </div>
            <Button
              type="link"
              className="text-[#67548E]"
              icon={<FaArrowRight />}
              iconPosition="end"
              href="https://sendbypass.com/blog/"
            >
              More
            </Button>
          </div>
          {!isMounted ? (
            <div className="lg:hidden w-full h-[200px] animate-pulse bg-[#67548E]/15 rounded-lg" />
          ) : (
            <Carousel
              arrows
              centerMode
              infinite={false}
              slidesToScroll={1.2}
              draggable
              dots={false}
              className="lg:hidden"
            >
              {BLOGS.map((blog) => (
                <BlogCard
                  key={blog.id}
                  title={blog.title}
                  image={blog.image}
                  href={blog.href}
                />
              ))}
            </Carousel>
          )}
          {!isMounted ? (
            <div className="hidden lg:flex gap-4 items-center justify-between">
              <div className="w-full h-[300px] animate-pulse bg-[#67548E]/15 rounded-lg" />
              <div className="w-full h-[300px] animate-pulse bg-[#67548E]/15 rounded-lg" />
              <div className="w-full h-[300px] animate-pulse bg-[#67548E]/15 rounded-lg" />
              <div className="w-full h-[300px] animate-pulse bg-[#67548E]/15 rounded-lg" />
            </div>
          ) : (
            <div className="hidden lg:flex items-center justify-between">
              {BLOGS.map((blog) => (
                <BlogCard
                  key={blog.id}
                  title={blog.title}
                  image={blog.image}
                  href={blog.href}
                />
              ))}
            </div>
          )}
        </div>
      </Content>
    </div>
  );
};

export default Home;

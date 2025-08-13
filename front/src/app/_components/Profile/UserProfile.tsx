'use client';

import { Facebook } from '@/app/icons/Facebook';
import { Instagram } from '@/app/icons/Instagram';
import { Linkedin } from '@/app/icons/Linkedin';
import { Telegram } from '@/app/icons/Telegram';
import { PiWhatsappLogo, PiWechatLogo } from 'react-icons/pi';
import { FaViber } from 'react-icons/fa6';
import { LiaLine } from 'react-icons/lia';
import { X } from '@/app/icons/X';
import { Avatar, Rate, Tag, Tooltip, Typography } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { BsPatchCheckFill } from 'react-icons/bs';
import { CgSmartphone } from 'react-icons/cg';
import { LuAtSign, LuMapPin } from 'react-icons/lu';
import { RiLink } from 'react-icons/ri';
import useFetcher from '@/app/_hooks/useFetcher';
import URLS from '@/app/_configs/urls';
import { UserOutlined } from '@ant-design/icons';
import { LanguageResultType, User } from './types';

const options: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const socialIconRender = (social: string) => {
  switch (social) {
    case 'twitter':
      return <X />;
    case 'facebook':
      return <Facebook />;
    case 'instagram':
      return <Instagram />;
    case 'telegram':
      return <Telegram />;
    case 'whatsapp':
      return <PiWhatsappLogo size={22} />;
    case 'viber':
      return <FaViber size={20} />;
    case 'wechat':
      return <PiWechatLogo size={23} />;
    case 'line':
      return <LiaLine size={24} />;
    case 'linkedin':
      return <Linkedin />;
    default:
      return <X />;
  }
};

export const UserProfile = ({ user }: User) => {
  const {
    first_name,
    business_name,
    addresses,
    background,
    bio,
    current_location,
    email,
    image,
    last_name,
    phone_number,
    register_time,
    speak_languages,
    stats,
    status,
    website,
    socials,
    type,
  } = user;
  const { data: languages } = useFetcher<LanguageResultType>({
    url: URLS.languages(),
    isProtected: true,
  });

  const commaSeperatedSpeakLanguages = languages?.results
    ?.filter((language) => speak_languages?.includes(language.iso))
    .map((language) => language.name)
    .join(', ');

  const address = addresses?.find((address) => address.id === current_location);

  return (
    <div className="">
      <div className="relative w-[800px] h-[200px]">
        <Image
          src={background ? (background as string) : '/img/profile_default.png'}
          alt=""
          fill
          className="object-cover"
        />
        <Avatar
          src={image}
          icon={<UserOutlined className="text-[#CBC4CF] text-[32px]" />}
          alt=""
          className="absolute w-[100px] h-[100px] border-2 border-[#CBC4CF] bg-[#F8F1FA] -bottom-6 left-10 rounded-full"
        />
      </div>
      <div className="px-6 py-10 space-y-5">
        <div className="flex flex-col-reverse lg:flex-row gap-2 items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Typography.Title level={3}>
                {type === 'PERSONAL'
                  ? `${first_name} ${last_name}`
                  : business_name}
              </Typography.Title>
              {status === 'VERIFIED' && (
                <BsPatchCheckFill
                  size={22}
                  className={`-mt-3 ${type === 'BUSINESS' ? 'text-[#B88C6A]' : 'text-[#005DB8]'}`}
                />
              )}
            </div>
            {address?.city && (
              <Typography.Text className="text-[#49454E]">
                {address?.city}, {address?.country}
              </Typography.Text>
            )}
            <div>
              <Typography.Text className="text-[#7A757F]">
                {new Date(register_time ?? '').toLocaleDateString(
                  'en-US',
                  options,
                )}
              </Typography.Text>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <Typography.Text className="text-[#7A757F]">
              <span className="text-[#49454E]">{stats?.avg_rate}</span>
              <span className="text-[#7A757F]">
                /{stats?.total_successful_orders}
              </span>
            </Typography.Text>
            <Rate disabled value={stats?.avg_rate} />
          </div>
        </div>
        <div>
          <Typography.Text>{bio}</Typography.Text>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            {phone_number?.phone && (
              <Tooltip
                placement="topLeft"
                title={
                  phone_number.socials && phone_number.socials.length > 0 ? (
                    <div>
                      {phone_number.socials &&
                        phone_number?.socials?.map((social) => (
                          <Tag
                            key={social}
                            color="default"
                            className="capitalize"
                          >
                            {social}
                          </Tag>
                        ))}
                    </div>
                  ) : undefined
                }
                color="#67548E"
              >
                <div className="flex items-center gap-1">
                  <CgSmartphone size={18} />
                  <Typography.Text className="text-[#1D1B20] font-semibold">
                    {phone_number?.zip_code?.zip_code &&
                      `+(${phone_number.zip_code.zip_code})`}{' '}
                    {phone_number?.phone}
                  </Typography.Text>
                </div>
              </Tooltip>
            )}
            <div className="flex items-center gap-1">
              <LuAtSign size={18} />
              <Typography.Text className="text-[#1D1B20] font-semibold">
                {email}
              </Typography.Text>
            </div>
            {website && (
              <div className="flex items-center gap-1">
                <RiLink size={18} />
                <Typography.Text className="text-[#1D1B20] font-semibold">
                  {website}
                </Typography.Text>
              </div>
            )}
            {address?.city && (
              <div className="flex items-center gap-1">
                <LuMapPin size={18} />
                <Typography.Text className="text-[#1D1B20] font-semibold">
                  {address?.city}, {address?.country}, {address?.description}
                </Typography.Text>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <Typography.Text className="text-[#7A757F] text-sm">
                Language you speak
              </Typography.Text>
              <Typography.Text className="text-[#1D1B20] font-semibold block text-xs">
                {commaSeperatedSpeakLanguages}
              </Typography.Text>
            </div>
            <div className="flex items-center gap-2 [&>*]:text-[#1D1B20]">
              {socials?.map((social) => (
                <Link href={social.link}>{socialIconRender(social.type)}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

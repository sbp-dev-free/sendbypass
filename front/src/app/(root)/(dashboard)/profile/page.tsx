'use client';

import Title from 'antd/es/typography/Title';
import { FC, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import axios from 'axios';
import { injectAccessToken } from '@/app/_utils/fetcher';
import {
  Address,
  Profile,
  Socials,
  UserProfile,
} from '@/app/_components/Profile';

import '@/app/styles/profile.Module.css';
import Typography from 'antd/es/typography/Typography';
import {
  Badge,
  Button,
  Modal,
  Tabs,
  Space,
  MenuProps,
  Dropdown,
  message,
} from 'antd';

import useFetcher from '@/app/_hooks/useFetcher';
import { GetProfileType } from '@/app/_components/Profile/types';
import URLS from '@/app/_configs/urls';
import { LuLock } from 'react-icons/lu';
import Link from 'next/link';
import { FiMoreVertical } from 'react-icons/fi';

const ProfilePage: FC = () => {
  const [open, setOpen] = useState(false);
  const [isBusinessProfileModalOpen, setIsBusinessProfileModalOpen] =
    useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const { data: profile, mutate } = useFetcher<GetProfileType>({
    url: URLS.profile(),
    isProtected: true,
  });

  const items = [
    {
      key: '1',
      label: 'Personal information',
      children: <Profile />,
    },
    {
      key: '2',
      label: (
        <Badge
          dot={!Boolean(profile?.socials.length)}
          className="relative"
          count={
            !profile?.socials.length ? (
              <div className="w-2 h-2 rounded-full bg-red-500 absolute top-0 -right-2" />
            ) : undefined
          }
        >
          Social media
        </Badge>
      ),
      children: <Socials mutate={mutate} />,
    },
    {
      key: '3',
      label: (
        <Badge
          dot={!profile?.addresses.length}
          className="relative"
          count={
            !profile?.addresses.length ? (
              <div className="w-2 h-2 rounded-full bg-red-500 absolute top-0 -right-2" />
            ) : undefined
          }
        >
          Address
        </Badge>
      ),
      children: <Address mutate={mutate} />,
    },
  ];

  const showModal = () => {
    setOpen(true);
  };

  const showBusinessProfileModal = () => {
    setIsBusinessProfileModalOpen(true);
  };

  const menu: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Button
          type="link"
          className="text-[#67548E] text-left px-0 "
          onClick={showModal}
        >
          View Profile
        </Button>
      ),
    },
    {
      key: '2',
      label: (
        <Button
          type="link"
          className="text-[#67548E] text-left px-0 pt-0"
          onClick={showBusinessProfileModal}
        >
          Switch to Business account
        </Button>
      ),
    },
    {
      key: '3',
      label: (
        <Link
          href="/delete-account"
          className="text-[#67548E] w-full block text-left"
        >
          Delete Account
        </Link>
      ),
    },
  ];

  const handleCancel = () => {
    setOpen(false);
  };

  const updateProfile = async () => {
    const newConfig = await injectAccessToken(true);
    if (!newConfig) {
      return;
    }
    setLoading(true);
    try {
      await axios.patch(URLS.profile(), { type: 'BUSINESS' }, newConfig);
      messageApi.success('Successfully edited.');
      setLoading(false);
      setIsBusinessProfileModalOpen(false);
      setIsSuccessModal(true);
    } catch (err) {
      console.log('err', err);
      messageApi.error('Something wrong happened');
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModal(false);
    mutate();
  };

  return (
    <>
      {contextHolder}
      {profile?.status === 'pe' && (
        <div className="text-white px-4 py-2 bg-[#EB9A0B] flex justify-center gap-2">
          <LuLock size={20} />
          <Typography className="text-white font-normal">
            Your profile under review, Your changes will be posted after
            approval{' '}
            <Link
              href="/security"
              target="_blank"
              className="underline text-inherit font-medium"
            >
              Learn more
            </Link>
          </Typography>
        </div>
      )}
      <div className="space-y-8 lg:p-4">
        <div className="h-full bg-white rounded-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <Title level={3}>Profile</Title>
              <Typography>Carefully fill out all three sections.</Typography>
            </div>
            <Dropdown
              menu={{ items: menu }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button className="text-[#67548E] w-auto border-none shadow-none">
                <Space className="flex items-center">
                  <span className="hidden lg:inline">More</span>
                  <FiMoreVertical />
                </Space>
              </Button>
            </Dropdown>
          </div>
          <Tabs
            defaultActiveKey="1"
            type="line"
            className="mt-12"
            size="large"
            items={items}
          />
        </div>
        <Modal
          centered
          open={open}
          onCancel={handleCancel}
          cancelButtonProps={{ className: 'hidden' }}
          okButtonProps={{ className: 'hidden' }}
          closable={false}
          width={800}
          classNames={{ content: '!p-0 !m-0 overflow-hidden' }}
        >
          <UserProfile user={profile as GetProfileType} />
        </Modal>
        <Modal
          centered
          open={isBusinessProfileModalOpen}
          onCancel={() => setIsBusinessProfileModalOpen(false)}
          cancelButtonProps={{ className: 'hidden' }}
          okButtonProps={{ className: 'hidden' }}
          closable={false}
          width={440}
          classNames={{ content: '!p-0 !m-0 overflow-hidden' }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-base font-bold text-[#1D1B1F]">
                Switch to Business account
              </div>
              <Button
                type="default"
                style={{
                  borderColor: '#DED8E1',
                  color: '#1890ff',
                }}
                className="w-[32px] h-[32px] p-0"
                onClick={() => setIsBusinessProfileModalOpen(false)}
              >
                <IoCloseOutline className="text-[#67548E] text-xl px-0" />
              </Button>
            </div>
            <div className="mb-4 font-normal text-[#49454F] text-sm">
              Are you sure you want to switch from a personal account to a
              business account?
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="primary"
                size="large"
                className="bg-[#65558F14] text-[#67548E] w-full lg:w-auto"
                onClick={() => setIsBusinessProfileModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={updateProfile}
                type="primary"
                size="large"
                className="w-full lg:w-auto"
                loading={loading}
              >
                Send request
              </Button>
            </div>
          </div>
        </Modal>
        <Modal
          centered
          open={isSuccessModal}
          onCancel={handleCloseSuccessModal}
          cancelButtonProps={{ className: 'hidden' }}
          okButtonProps={{ className: 'hidden' }}
          closable={false}
          width={700}
          classNames={{ content: '!p-0 !m-0 overflow-hidden' }}
        >
          <div className="p-6">
            <div className="flex">
              <div className="w-full flex justify-center mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <path
                    opacity="0.4"
                    d="M10.9804 14.38C10.9804 11.9505 12.9489 9.98212 15.3783 9.98018H17.3798C18.541 9.98018 19.6536 9.51918 20.4782 8.70224L21.8768 7.30178C23.5904 5.57844 26.3758 5.57066 28.0992 7.28234L28.101 7.28428L28.1186 7.29984L29.519 8.7003C30.3418 9.51918 31.4564 9.97822 32.6176 9.97822H34.623C37.0524 9.97822 39.0228 11.9486 39.0228 14.378V16.3776C39.0228 17.5407 39.4818 18.6533 40.3006 19.478L41.7012 20.8784C43.4244 22.5922 43.4342 25.3774 41.7226 27.1008L40.3026 28.5208C39.4838 29.3436 39.0248 30.458 39.0248 31.6174V33.6246C39.0208 36.054 37.0504 38.0186 34.623 38.0166H32.6136C31.4524 38.0166 30.338 38.4776 29.5152 39.2966L28.1148 40.695C26.405 42.4204 23.6196 42.432 21.8962 40.7222L21.8904 40.7184L20.4744 39.3024C19.6516 38.4834 18.5371 38.0244 17.3759 38.0226H15.3783C12.9489 38.0226 10.9804 36.054 10.9804 33.6246V31.6134C10.9804 30.4522 10.5194 29.3396 9.70056 28.5168L8.30204 27.1164C6.57674 25.4066 6.56508 22.6252 8.27286 20.8998C8.27286 20.8998 8.2787 20.896 8.28064 20.8922L9.69666 19.4741C10.5155 18.6514 10.9765 17.5368 10.9765 16.3737V14.38"
                    stroke="#67548E"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.0078 24.2445L22.9622 28.2047L31.1082 20.0547"
                    stroke="#67548E"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <Button
                type="default"
                style={{
                  borderColor: '#DED8E1',
                  color: '#1890ff',
                }}
                className="w-[32px] h-[32px] p-0"
                onClick={handleCloseSuccessModal}
              >
                <IoCloseOutline className="text-[#67548E] text-xl px-0" />
              </Button>
            </div>
            <div className="text-[22px] font-bold text-[#1D1B1F] text-center mb-2">
              Success! Your request has been sent.
            </div>
            <div className="text-base font-bold text-[#1D1B1F] text-center">
              Check your email
            </div>
            <div className="text-sm font-normal text-[#49454F] mb-4 text-center">
              We will send you an email to verify your information and complete
              the switch to a business account.
            </div>
            <div className="text-sm font-normal text-[#49454F] text-center">
              Please check your inbox at
            </div>
            <div className="text-sm font-bold text-[#49454F] mb-16 text-center">
              {profile?.email}
            </div>
            <div className="text-center text-[#7A7580]">
              If you haven&apos;t gotten the email yet; take a look in your
              <strong> spam/junk </strong>
              folder.
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ProfilePage;

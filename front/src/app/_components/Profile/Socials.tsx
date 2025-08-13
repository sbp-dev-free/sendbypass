'use client';

import URLS from '@/app/_configs/urls';
import { socialOptions } from '@/app/_dtos/socials';
import useFetcher from '@/app/_hooks/useFetcher';
import { injectAccessToken } from '@/app/_utils/fetcher';
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Select,
  Space,
  Spin,
} from 'antd';
import Typography from 'antd/es/typography/Typography';
import axios from 'axios';
import { useState } from 'react';
import { BiTrash } from 'react-icons/bi';
import { useForm } from 'antd/es/form/Form';
import { useRouter } from 'next/navigation';
import { SocialsResultType } from './types';
import { NoResult } from './NoResult';

export const Socials = ({ mutate: _mutate }: { mutate: () => void }) => {
  const [isAddSocialOpen, setIsAddSocialOpen] = useState(false);
  const [isDeleteSocialLoading, setIsDeleteSocialLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const { push } = useRouter();
  const [form] = useForm();

  const {
    data: socials,
    isLoading,
    mutate,
  } = useFetcher<SocialsResultType>({
    url: URLS.socials(),
    isProtected: true,
    shouldFetch: true,
  });

  const handleAddToSocial = () => {
    setIsAddSocialOpen(true);
  };

  const handleCancelAddToSocial = () => {
    setIsAddSocialOpen(false);
  };

  const handleAddSocial = async ({ link, type }: any) => {
    const newConfig = await injectAccessToken(true);
    if (!newConfig) {
      return;
    }

    try {
      await axios.post(URLS.socials(), { link, type }, newConfig);
      mutate();
      setIsAddSocialOpen(false);
      messageApi.success('Successfull added.');
      form.resetFields();
    } catch (error) {
      messageApi.error('Something wrong happened');
    } finally {
      if (socials?.results.length === 0) {
        _mutate();
      }
    }
  };

  const handleDeleteSocial = async (e: unknown, id: number) => {
    setIsDeleteSocialLoading(true);
    const newConfig = await injectAccessToken(true);
    if (!newConfig) {
      return;
    }
    try {
      await axios.delete(URLS.social(String(id)), newConfig);
      mutate();
      messageApi.success('Successfull deleted.');
      push('/profile');
    } catch (error) {
      messageApi.error('Something wrong happened');
    } finally {
      if (socials?.results.length && socials?.results.length <= 1) {
        _mutate();
      }
    }
    setIsDeleteSocialLoading(false);
  };

  return (
    <div>
      {contextHolder}
      <div className="relative flex flex-col lg:flex-row items-start gap-8 lg:gap-0">
        {isLoading && !socials?.results.length && !isAddSocialOpen && (
          <Spin size="large" className="flex justify-center w-full" />
        )}
        {!isLoading && !socials?.results.length && !isAddSocialOpen && (
          <div className="flex flex-col justify-center items-center w-full py-8">
            <NoResult />
            <Typography className="text-[#49454E] text-lg font-semibold">
              No Social media
            </Typography>
            <Typography className="text-[#7A757F]">
              You can add some social networks here.
            </Typography>
          </div>
        )}
        {!!socials?.results.length && (
          <div className="w-full space-y-3 mb-12">
            {socials?.results.map((social) => (
              <div className="flex items-center mb-3 px-3 py-1 w-full bg-slate-100 rounded-md hover:bg-slate-200 transition-colors duration-200">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-0.5 h-full bg-[#65558F29] lg:hidden" />
                  <Button
                    icon={<BiTrash size={20} />}
                    className="text-[#67548E] my-1 lg:mb-0 lg:mr-2"
                    type="link"
                    onClick={() => handleDeleteSocial(null, social.id)}
                    loading={isDeleteSocialLoading}
                  />
                  <div className="w-0.5 h-full bg-[#65558F29] lg:hidden" />
                </div>
                <Divider type="vertical" className="border-gray-400" />
                <div className="flex items-center gap-4 w-full">
                  <div className="flex items-center gap-2">
                    {
                      socialOptions.find(
                        (option) => option.value === social.type,
                      )?.emoji
                    }
                    <Typography className="text-[#49454E] text-base font-normal">
                      {social.type}
                    </Typography>
                  </div>
                  <Divider type="vertical" className="border-gray-400" />
                  <Typography className="text-[#49454E] text-base font-normal">
                    {social.link}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {isAddSocialOpen && (
        <Form
          onFinish={handleAddSocial}
          form={form}
          className="flex flex-col lg:flex-row gap-2 mb-4 w-full"
        >
          <div className="flex mb-3 w-full">
            <div className="flex flex-col items-center justify-center">
              <div className="w-0.5 h-full bg-[#65558F29] lg:hidden" />
              <Button
                icon={<BiTrash size={20} />}
                className="text-[#67548E] my-1 lg:mb-0 lg:mr-2 lg:-mt-6"
                type="link"
                onClick={handleCancelAddToSocial}
                loading={isDeleteSocialLoading}
              />
              <div className="w-0.5 h-full bg-[#65558F29] lg:hidden" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
              <Form.Item name="type" className="w-full">
                <Select
                  placeholder="Platform"
                  maxCount={1}
                  size="large"
                  options={socialOptions}
                  optionRender={(option) => (
                    <Space>
                      <span
                        role="img"
                        aria-label={option.data.label}
                        className="[&>*]:size-[14px]"
                      >
                        {option.data.emoji}
                      </span>
                      <span>{option.data.label}</span>
                    </Space>
                  )}
                />
              </Form.Item>
              <Form.Item name="link">
                <Input placeholder="Link" size="large" />
              </Form.Item>
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            className="bg-[#67548E]"
            htmlType="submit"
          >
            Update
          </Button>
        </Form>
      )}
      <div className="flex items-center justify-between">
        <Button
          type="primary"
          size="large"
          className="bg-[#67548E] bg-opacity-15 text-[#67548E]"
          onClick={handleAddToSocial}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

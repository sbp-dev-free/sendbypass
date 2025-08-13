'use client';

import { useState } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import Image from 'next/image';
import axios from 'axios';
import URLS from '@/app/_configs/urls';

export const NeverMissUpdate = () => {
  const [form] = Form.useForm();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values: { email: string }) => {
    if (!checked) {
      messageApi.error('You must agree to receive emails before submitting.');
      return;
    }
    setLoading(true);

    try {
      await axios.post(URLS.subscribe(), { email: values.email });
      messageApi.success('You have subscribed successfully!');
      form.resetFields();
      setChecked(false);
    } catch (error: any) {
      messageApi.error('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-[16px] lg:space-y-[8px]">
      {contextHolder}
      <Image
        src="/img/static-pages/about-us/dots.svg"
        width={30}
        height={30}
        alt="dots"
        className="pt-[8px]"
      />
      <div className="flex flex-col gap-16 lg:px-[40px] lg:gap-0 lg:flex-row lg:items-center lg:justify-between">
        <div className="lg:w-[440px]">
          <p className="text-title-large text-on-surface">
            Never miss an update
          </p>
          <p className="text-body-medium text-on-surface">
            Receive the latest Sendbypass news, blog posts, and product updates
            in your inbox. We’ll rarely send more than one email a month.
          </p>
        </div>
        <div className="lg:w-[420px] space-y-[8px]">
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            className="w-full"
          >
            <div className="flex gap-[8px]">
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email!' },
                  {
                    type: 'email',
                    message: 'Please enter a valid email address!',
                  },
                ]}
                className="w-full grow"
              >
                <Input autoComplete="off" />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!checked || loading}
                loading={loading}
              >
                Register
              </Button>
            </div>
            <label htmlFor="agree" className="flex gap-[8px] items-center">
              <Checkbox
                id="agree"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
              <span className="text-body-small text-on-surface">
                I agree to receive marketing emails from Sendbypass.
              </span>
            </label>
          </Form>
        </div>
      </div>
    </div>
  );
};

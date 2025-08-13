'use client';

import { useState } from 'react';
import { Button, Checkbox, Form, Input, Select, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Link from 'next/link';
import axios from 'axios';
import URLS from '@/app/_configs/urls';
import { StaticPageFrame } from '../StaticPageFrame';

const TOPIC_OPTIONS = [
  { label: 'Bug report', value: 'BUG' },
  { label: 'Get Help', value: 'HELP' },
  { label: 'Feature request', value: 'FEATURE_REQUEST' },
  { label: 'Security report', value: 'SECURITY_REPORT' },
  { label: 'Business Account', value: 'BUSINESS' },
  { label: 'Invest', value: 'INVEST' },
  { label: 'Other', value: 'OTHER' },
];

export const ContactUs = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values: any) => {
    if (!values.agree) {
      messageApi.error('You must agree to the terms before submitting.');
      return;
    }
    setLoading(true);

    try {
      await axios.post(URLS.tickets(), {
        name: values.name,
        email: values.email,
        phone_number: values.phone,
        message: values.message,
        topic: values.topic,
        subscribe: values.subscribe || false,
        consent: values.agree,
      });
      messageApi.success('Your message has been sent successfully!');
      form.resetFields();
    } catch (error: any) {
      messageApi.error('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StaticPageFrame title="Contact Us">
      {contextHolder}
      <div className="flex flex-col-reverse gap-[20px] items-start md:pt-[40px] md:flex-row text-body-large text-on-surface">
        <div className="flex-1 space-y-[16px] w-full md:pr-[20px]">
          <div className="pl-[12px] space-y-[4px]">
            <h4 className="text-title-large text-on-surface">Let’s Talk!</h4>
            <p className="text-body-small text-outline">
              If you have questions, feedback, or need to report an issue, just
              send us a message — we’re here to help!
            </p>
          </div>
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please enter your name!' }]}
            >
              <Input size="large" placeholder="Your name" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input size="large" placeholder="Email" />
            </Form.Item>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Form.Item
                name="topic"
                rules={[{ required: true, message: 'Please select a topic!' }]}
              >
                <Select
                  size="large"
                  placeholder="Select a topic"
                  options={TOPIC_OPTIONS}
                />
              </Form.Item>
              <Form.Item name="phone" className="lg:col-span-2">
                <Input size="large" placeholder="Phone number" />
              </Form.Item>
            </div>
            <Form.Item
              name="message"
              rules={[
                { required: true, message: 'Please enter your message!' },
              ]}
            >
              <TextArea placeholder="Your message" rows={4} />
            </Form.Item>
            <Form.Item name="agree" valuePropName="checked" className="-mb-2">
              <Checkbox>
                I&apos;ve read and agree to Sendbypass’s Terms & Conditions and
                Privacy Policy.
              </Checkbox>
            </Form.Item>
            <Form.Item name="subscribe" valuePropName="checked">
              <Checkbox>Keep me updated on news and offers</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="h-[46px] w-[140px]"
                loading={loading}
              >
                Send
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="flex-1 p-[8px] space-y-[24px] w-full border border-surface-container rounded-large">
          <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2304.36047118581!2d25.276048813478457!3d54.72087397260595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dd91491301a5f1%3A0xad6b4f3c18d82fbf!2sJ.%20Bal%C4%8Dikonio%20g.%2019%2C%20Vilnius%2C%2008314%20Vilniaus%20m.%20sav.%2C%20Lithuania!5e0!3m2!1sen!2s!4v1738588278667!5m2!1sen!2s"
            className="w-full h-[218px] md:h-[324px]"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="px-[8px] pb-[16px] space-y-[16px] md:space-y-[24px]">
            <div className="flex gap-[16px] items-start">
              <div className="space-y-[4px]">
                <h5 className="text-title-medium text-on-surface">
                  Headquarters
                </h5>
                <p className="text-body-medium text-on-surface-variant">
                  J. Balčikonio g. 19, Vilnius, Vilniaus m. sav. Lithuania
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-[16px] md:gap-[162px] md:items-center">
              <div className="space-y-[4px]">
                <h5 className="text-title-medium text-on-surface">Email</h5>
                <Link
                  href="mailto:Info@Sendbypass.com"
                  className="text-body-medium text-[#1D1B1F]"
                >
                  Info@Sendbypass.com
                </Link>
              </div>
              <div className="space-y-[4px]">
                <h5 className="text-title-medium text-on-surface">Phone</h5>
                <Link
                  href="tel:+37062549672"
                  className="text-body-medium text-[#1D1B1F]"
                >
                  +370 625 49672
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaticPageFrame>
  );
};

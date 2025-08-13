'use client';

import {
  Avatar,
  Badge,
  Button,
  GetProp,
  Image,
  Input,
  List,
  message,
  Modal,
  Popover,
  Rate,
  Space,
  Steps,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import Text from 'antd/es/typography/Text';
import { UserOutlined } from '@ant-design/icons';
import URLS from '@/app/_configs/urls';
import axios from 'axios';
import { injectAccessToken } from '@/app/_utils/fetcher';
import { ChangeEvent, useEffect, useState } from 'react';
import { stepItems } from '@/app/_dtos/steps';
import { getStatusColor } from '@/app/_utils/statusColor';
import { FaUpload } from 'react-icons/fa6';
import clsx from 'clsx';
import { OrderItemProps } from './types';
import { UserProfile } from '../Profile';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const orderStatusDescription = (
  current: number,
  role: string,
  requirement: string,
) => {
  if (role === 'CUSTOMER') {
    switch (current) {
      case 0:
        return 'You should pay to traveler';
      case 1:
        return `You should ${requirement === 'SHIPPING' ? 'deliver' : 'purchase'} to traveler`;
      case 2:
        return 'You are waiting to deliver item at destination';
      case 3:
        return 'Your item has been delivered to destination';
      default:
        return '';
    }
  }
  if (role === 'TRAVELER') {
    switch (current) {
      case 0:
        return 'You are waiting for payment from customer';
      case 1:
        return `You are waiting to ${requirement === 'SHIPPING' ? 'deliver' : 'purchase'} from customer`;
      case 2:
        return 'You are waiting to deliver item at destination';
      case 3:
        return 'Your item has been delivered to destination';
      default:
        return '';
    }
  }
};

export const OrderItem = ({ order, mutate }: OrderItemProps) => {
  const [openUserProfileModal, setOpenUserProfileModal] = useState(false);
  const [deliveryOtp, setDeliveryOtp] = useState('');
  const [comment, setComment] = useState('');
  const [rate, setRate] = useState(0);
  const [messageApi, messageContext] = message.useMessage();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>();

  const {
    title,
    user,
    current,
    destination,
    requirement,
    properties,
    stepId,
    role,
    status,
  } = order;

  const popUpStatus = (index: number) => {
    switch (index) {
      case 0:
        return 'Payment';
      case 1:
        return requirement === 'SHIPPING' ? 'Deliver to passenger' : 'Purchase';
      case 2:
        return 'Deliver at destination';
      case 3:
        return 'Done';
      default:
        return 'Payment';
    }
  };

  useEffect(() => {
    if (properties?.[stepId]?.image) {
      setPreviewImage(properties?.[stepId].image);
    }
  }, [properties?.[stepId]?.image, stepId]);

  const handlePay = async () => {
    const newConfig = await injectAccessToken(true);
    if (!newConfig) {
      messageApi.error('service: failed to inject access token');
      return;
    }
    try {
      await axios.patch(
        URLS.editOrderStep(String(stepId)),
        {
          status: 'DONE',
        },
        newConfig,
      );
      mutate();
    } catch (error) {
      messageApi.error('An error happend!');
    }
  };

  const handleVerfiyDeliveryCode = async () => {
    const newConfig = await injectAccessToken(true);
    if (!newConfig) {
      messageApi.error('service: failed to inject access token');
      return;
    }
    try {
      await axios.patch(
        URLS.editOrderStep(stepId as any),
        {
          status: 'DONE',
          properties: {
            code: deliveryOtp,
          },
        },
        newConfig,
      );
      mutate();
    } catch (error) {
      messageApi.error('An error happend!');
    }
    setDeliveryOtp('');
  };

  const handleVerifyDeliveryCodeChange = (e: ChangeEvent<HTMLInputElement>) =>
    setDeliveryOtp(e.target.value);

  const handleToggleUserProfile = () => {
    setOpenUserProfileModal(!openUserProfileModal);
  };
  const handleChangeRate = (value: number) => {
    setRate(value);
  };
  const handleChangeComment = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleSubmitComment = async () => {
    const newConfig = await injectAccessToken(true);
    if (!newConfig) {
      messageApi.error('service: failed to inject access token');
      return;
    }
    try {
      await axios.patch(
        URLS.editOrderStep(String(stepId)),
        {
          status: 'DONE',
          properties: {
            rate,
            comment,
          },
        },
        newConfig,
      );
      mutate();
    } catch (error) {
      messageApi.error('An error happend!');
    }
    setComment('');
    setRate(0);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleSendShoppingImage = async () => {
    const newConfig = await injectAccessToken(true);
    if (!newConfig) {
      messageApi.error('service: failed to inject access token');
      return;
    }

    const image = fileList?.[0].originFileObj || '';
    const formData = new FormData();
    formData.append('status', 'DONE');
    formData.append('properties[image]', image);

    try {
      await axios.patch(
        URLS.editOrderStep(String(stepId)),
        formData,
        newConfig,
      );
      mutate();
    } catch (error) {
      messageApi.error('An error happend!');
    }
  };

  const handleSubmitShoppingImage = async () => {
    const newConfig = await injectAccessToken(true);
    if (!newConfig) {
      messageApi.error('service: failed to inject access token');
      return;
    }

    try {
      await axios.patch(
        URLS.editOrderStep(String(stepId)),
        { status: 'DONE' },
        newConfig,
      );
      mutate();
    } catch (error) {
      messageApi.error('An error happend!');
    }
  };

  return (
    <Badge.Ribbon
      text={<div className="text-xs font-bold py-1">{status}</div>}
      placement="start"
      color={getStatusColor(status)}
      className="mt-4"
    >
      <Badge.Ribbon
        text={<div className="text-xs font-bold py-1">{requirement}</div>}
        placement="start"
        className="mt-12"
        color="cyan"
      />
      <Badge.Ribbon
        text={
          <div className="text-xs font-bold py-1 uppercase">{destination}</div>
        }
        placement="start"
        className="mt-20"
        color="purple"
      />
      <Badge.Ribbon
        text={
          <div className="text-xs font-bold py-1 uppercase">
            {orderStatusDescription(current, role, requirement)}
          </div>
        }
        color={current === 3 ? 'green' : 'orange'}
      />

      <List.Item className="flex flex-col xl:flex-row xl:pl-28 shadow-sm bg-white rounded-lg mb-3">
        {messageContext}
        <div className="flex flex-col lg:flex-row items-center justify-center w-full xl:w-auto py-4 gap-2">
          <Avatar
            src={user.image}
            size={64}
            icon={<UserOutlined />}
            onClick={handleToggleUserProfile}
            className="cursor-pointer"
          />
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleToggleUserProfile}
              className="max-w-32 truncate underline underline-offset-2 text-blue-500"
            >
              {user.email}
            </button>
            <div className="max-w-32 truncate">
              <Text type="secondary">Title:&nbsp;</Text>
              <Text>{title}</Text>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center w-auto xl:w-2/3">
          <Steps
            current={current}
            labelPlacement="vertical"
            responsive
            className="w-full h-[320px] min-[580px]:h-auto"
            items={stepItems.map((item, index) => {
              if (current >= index + 1 || current === index) {
                const dateTime = properties?.[index]?.date?.split('T');
                const date = dateTime?.[0];
                const time = dateTime?.[1].slice(0, 5);

                return {
                  title:
                    current === index ? (
                      <div />
                    ) : (
                      <div className="text-xs">
                        <div>{time} (UTC)</div>
                        <div className="">{date}</div>
                      </div>
                    ),
                  icon: (
                    <Popover content={<span>{popUpStatus(index)}</span>}>
                      {item.icon}
                    </Popover>
                  ),
                };
              }
              return {
                title: '',
                icon: (
                  <Popover content={<span>{popUpStatus(index)}</span>}>
                    {item.icon}
                  </Popover>
                ),
              };
            })}
          />
        </div>
        <div className={clsx('flex justify-center w-[400px]')}>
          {current === 0 && role === 'CUSTOMER' && (
            <Button
              onClick={handlePay}
              type="primary"
              size="middle"
              disabled={!stepId}
            >
              Continue
            </Button>
          )}
          {current === 1 && (
            <div className="mt-4">
              {role === 'CUSTOMER' && properties?.[current]?.code && (
                <div>
                  <div className="text-gray-600 text-center">
                    <div>
                      Delivery code:{' '}
                      <span className="text-lg font-bold">
                        {properties?.[1]?.code}
                      </span>
                    </div>
                    <div className="max-w-[200px]">
                      Please remember to provide the code to the passenger when
                      delivering the goods.
                    </div>
                  </div>
                </div>
              )}
              {role === 'TRAVELER' &&
                !properties?.[current]?.code &&
                requirement !== 'SHOPPING' && (
                  <div className="mt-4">
                    <div>
                      <Space.Compact style={{ width: '100%' }}>
                        <Input
                          value={deliveryOtp}
                          onChange={handleVerifyDeliveryCodeChange}
                        />
                        <Button
                          type="primary"
                          onClick={handleVerfiyDeliveryCode}
                          disabled={!deliveryOtp}
                        >
                          Submit
                        </Button>
                      </Space.Compact>
                      <div className="text-center text-sm text-gray-700 mt-2">
                        Please obtain the package receipt code from the
                        passenger and input it into the box.
                      </div>
                    </div>
                  </div>
                )}
              {role === 'CUSTOMER' &&
                requirement === 'SHOPPING' &&
                Boolean(properties?.[current]?.image) && (
                  <div className="flex items-center gap-3 h-full mt-4">
                    <Image
                      src={properties?.[current]?.image}
                      width={80}
                      height={80}
                      className="rounded-xl"
                    />
                    <div className="space-y-2 text-center">
                      <div className="text-sm">Is it your requirement?</div>
                      <Button
                        type="primary"
                        onClick={handleSubmitShoppingImage}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
              {role === 'TRAVELER' &&
                requirement === 'SHOPPING' &&
                !Boolean(properties?.[current]?.image) && (
                  <div className="flex items-center gap-4 w-full mt-4">
                    <Upload
                      maxCount={1}
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={handleChange}
                    >
                      <div className="flex items-center gap-2">
                        <span>Upload</span> <FaUpload />
                      </div>
                    </Upload>
                    <Button
                      type="primary"
                      onClick={handleSendShoppingImage}
                      disabled={!fileList?.length}
                    >
                      Send
                    </Button>
                    {previewImage && (
                      <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                          visible: previewOpen,
                          onVisibleChange: (visible) => setPreviewOpen(visible),
                          afterOpenChange: (visible) =>
                            !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                      />
                    )}
                  </div>
                )}
            </div>
          )}
          {current === 2 && (
            <div className="mt-4">
              {role === 'CUSTOMER' ? (
                <div className="text-gray-600 text-center">
                  <div>
                    Delivery code:{' '}
                    <span className="text-lg font-bold">
                      {properties?.[2]?.code}
                    </span>
                  </div>
                  <div className="max-w-[200px]">
                    When receiving the goods, please provide the code to the
                    passenger.
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <Space.Compact style={{ width: '100%' }}>
                    <Input
                      value={deliveryOtp}
                      onChange={handleVerifyDeliveryCodeChange}
                    />
                    <Button
                      type="primary"
                      onClick={handleVerfiyDeliveryCode}
                      disabled={!deliveryOtp}
                    >
                      Submit
                    </Button>
                  </Space.Compact>
                  <div className="text-center text-sm text-gray-700 mt-2">
                    Please obtain the delivery code from the passenger and input
                    it into the field.
                  </div>
                </div>
              )}
            </div>
          )}
          {current === 3 && !properties?.[current].comment && (
            <div className="space-y-2 mt-6">
              <Rate value={rate} onChange={handleChangeRate} />
              <Input value={comment} onChange={handleChangeComment} />
              <Button
                type="primary"
                onClick={handleSubmitComment}
                disabled={!comment || !rate}
              >
                Submit
              </Button>
            </div>
          )}
          {current === 3 && properties?.[current].comment && (
            <div className="space-y-2">
              <Rate value={properties?.[current].rate} disabled />
              <Typography className="text-sm line-clamp-2">
                {properties?.[current].comment}
              </Typography>
            </div>
          )}
        </div>
        <Modal
          centered
          open={openUserProfileModal}
          onCancel={handleToggleUserProfile}
          cancelButtonProps={{ className: 'hidden' }}
          okButtonProps={{ className: 'hidden' }}
          closable={false}
          width={800}
          classNames={{ content: '!p-0 !m-0 overflow-hidden' }}
        >
          <UserProfile user={user} />
        </Modal>
      </List.Item>
    </Badge.Ribbon>
  );
};

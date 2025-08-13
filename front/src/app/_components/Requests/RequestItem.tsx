'use client';

import { UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Image,
  List,
  message,
  Modal,
  Tooltip,
  Typography,
} from 'antd';
import { Request } from '@/app/_dtos/request';
import Text from 'antd/es/typography/Text';
import { injectAccessToken } from '@/app/_utils/fetcher';
import axios from 'axios';
import URLS from '@/app/_configs/urls';
import { useState } from 'react';
import { FaBan, FaCheck } from 'react-icons/fa6';
import clsx from 'clsx';
import { getStatusColor } from '@/app/_utils/statusColor';
import { UserProfile } from '../Profile';

interface RequestItemProps {
  request: Request;
  mutate: () => void;
  isSent?: boolean;
}

export const RequestItem = ({
  request,
  isSent = false,
  mutate,
}: RequestItemProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false);
  const [openUserProfileModal, setOpenUserProfileModal] = useState(false);
  const [messageApi, messageContextHolder] = message.useMessage();

  const handleAcceptRequest = async (id: string) => {
    setIsLoading(true);
    const newConfig = await injectAccessToken(true);
    if (!newConfig) {
      messageApi.error('service: failed to inject access token');
      return;
    }
    try {
      await axios.patch(
        URLS.editRequest(id),
        {
          status: 'ACCEPTED',
        },
        newConfig,
      );
      mutate();
    } catch (error) {
      message.error('Something wrong happend!');
    }
    setIsLoading(false);
  };

  const handleToggleUserProfile = () => {
    setOpenUserProfileModal(!openUserProfileModal);
  };

  const handleSubmitCancel = async () => {
    setIsRejectLoading(true);
    const newConfig = await injectAccessToken(true);
    if (!newConfig) {
      messageApi.error('service: failed to inject access token');
      return;
    }
    if (isSent) {
      try {
        await axios.patch(
          URLS.editRequest(String(request.id)),
          {
            status: 'CANCELED',
          },
          newConfig,
        );
        messageApi.success('Successfuly canceled.');

        mutate();
      } catch (error) {
        messageApi.error('An error happend!');
      }
    } else {
      try {
        await axios.patch(
          URLS.editRequest(String(request.id)),
          {
            status: 'REJECTED',
          },
          newConfig,
        );
        messageApi.success('Successfuly rejected.');
        mutate();
      } catch (error) {
        messageApi.error('An error happend!');
      }
    }

    setIsRejectLoading(false);
  };
  const isRejected =
    request.status === 'CANCELED' || request.status === 'REJECTED';

  return (
    <Badge.Ribbon
      color="purple"
      placement="start"
      className="ml-2"
      text={
        <div className="text-xs font-bold py-1 uppercase">
          {request.requirement_data.destination.location_data.city}
        </div>
      }
    >
      <Badge.Ribbon
        color={getStatusColor(request.status)}
        placement="start"
        className="ml-2 mt-8 z-10"
        text={
          <div className="text-xs font-bold py-1 uppercase">
            {request.status}
          </div>
        }
      />
      <List.Item
        className={clsx('rounded-lg border px-4 py-4 space-y-4 shadow-md', {
          'bg-gray-100 border-gray-300': isRejected,
          'bg-white border-gray-100': !isRejected,
        })}
      >
        {messageContextHolder}
        <div className="flex items-end justify-between w-full gap-2 mt-3">
          <div className="max-w-32 truncate">
            <Text className="text-2xl font-semibold">
              {request.requirement_data.name}
            </Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Avatar
              src={
                (request.role === 'CUSTOMER'
                  ? request.traveler_data
                  : request.customer_data
                ).image
              }
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
                {
                  (request.role === 'CUSTOMER'
                    ? request.traveler_data
                    : request.customer_data
                  ).email
                }
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Text>Proposed wage:</Text>
          <Text className="text-xl font-semibold">
            {request.deal.cost} <sup>$</sup>
          </Text>
        </div>
        {request.role === 'TRAVELER' && (
          <div
            className={clsx('p-4 rounded-md md:h-[290px]', {
              'bg-white': isRejected,
              'bg-gray-100': !isRejected,
            })}
          >
            <div className="flex items-center justify-between">
              <Typography className="text-lg font-bold uppercase text-gray-400">
                Requirement
              </Typography>
            </div>
            <div className="flex justify-center w-full">
              <Avatar
                size={74}
                src={
                  request.requirement_data.image ? (
                    <Image src={request.requirement_data.image} />
                  ) : undefined
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 my-2 gap-2">
              <div className="flex items-center gap-1">
                <div className="text-sm text-gray-500">Type:</div>
                <div className="capitalize">
                  {request.requirement_data.properties.type.toLowerCase()}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="text-sm text-gray-500">Wage:</div>
                <div>
                  {request.requirement_data.cost.wage} <sup>$</sup>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="text-sm text-gray-500">Height:</div>
                <div>{request.requirement_data.properties.height} cm</div>
              </div>
              <div className="flex items-center gap-1">
                <div className="text-sm text-gray-500">Width:</div>
                <div>{request.requirement_data.properties.width} cm</div>
              </div>
              <div className="flex items-center gap-1">
                <div className="text-sm text-gray-500">Length:</div>
                <div>{request.requirement_data.properties.length} cm</div>
              </div>
              <div className="flex items-center gap-1">
                <div className="text-sm text-gray-500">Weight:</div>
                <div>{request.requirement_data.properties.weight} kg</div>
              </div>

              <div className="flex items-center gap-1">
                <div className="text-sm text-gray-500">Submit time:</div>
                <div>{new Date(request.submit_time).toLocaleDateString()}</div>
              </div>
            </div>
            {request.requirement_data.comment && (
              <Tooltip
                title={request.requirement_data.comment}
                color="#67548E"
                placement="topLeft"
              >
                <div className="text-sm font-semibold mt-4 line-clamp-3 cursor-pointer">
                  <div>{request.requirement_data.comment}</div>
                </div>
              </Tooltip>
            )}
          </div>
        )}
        {request.role === 'CUSTOMER' && (
          <div
            className={clsx('p-4 rounded-md md:h-[290px]', {
              'bg-white': isRejected,
              'bg-gray-100': !isRejected,
            })}
          >
            <div className="flex items-center justify-between mb-4">
              <Typography className="text-lg font-bold uppercase text-gray-400">
                Trip
              </Typography>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 my-2 gap-2">
              <div className="flex items-center gap-1">
                <div className="text-sm text-gray-500">Service weight:</div>
                <div>{request.service_data.properties.weight} kg</div>
              </div>
              <div className="flex items-center gap-1">
                <div className="text-sm text-gray-500">Airline:</div>
                <div className="capitalize">
                  {request.service_data.trip_data.flight.airline}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="text-sm text-gray-500">Status:</div>
                <div className="capitalize">
                  {request.service_data.trip_data.status.toLowerCase()}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="text-sm text-gray-500">Ticket:</div>
                <div>{request.service_data.trip_data.ticket_number}</div>
              </div>
              <div className="flex items-center gap-1">
                <div className="text-sm text-gray-500">Landing date:</div>
                <div>
                  {new Date(
                    request.service_data.trip_data.flight.source.to,
                  ).toLocaleDateString()}{' '}
                  (UTC)
                </div>
              </div>
            </div>
            {request.service_data.trip_data.description && (
              <Tooltip
                title={request.service_data.trip_data.description}
                color="#67548E"
                placement="topLeft"
              >
                <div className="text-sm font-semibold mt-4 line-clamp-3 cursor-pointer">
                  {request.service_data.trip_data.description}
                </div>
              </Tooltip>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 w-full">
          <Button
            icon={<FaBan className="text-xl" />}
            type="primary"
            className={clsx(
              'bg-rose-600 disabled:text-gray-400 disabled:bg-gray-300',
              {
                'w-full': !isSent,
                'w-full md:w-1/2': isSent,
              },
            )}
            onClick={handleSubmitCancel}
            loading={isRejectLoading}
            disabled={isRejected}
          >
            {isSent ? 'Cancel' : 'Reject'}
          </Button>
          {!isSent && (
            <Button
              icon={<FaCheck className="text-xl" />}
              onClick={() => handleAcceptRequest(request.id.toString())}
              type="primary"
              loading={isLoading}
              className="bg-green-600 w-full disabled:text-gray-400 disabled:bg-gray-300"
              disabled={isRejected}
            >
              Accept
            </Button>
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
          <UserProfile
            user={
              request.role === 'CUSTOMER'
                ? request.traveler_data
                : (request.customer_data as any)
            }
          />
        </Modal>
      </List.Item>
    </Badge.Ribbon>
  );
};

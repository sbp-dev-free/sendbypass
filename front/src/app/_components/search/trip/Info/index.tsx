import { FC, useState, useRef, useEffect } from 'react';
import { useToggle } from 'react-use';
import { Rate, Avatar, Modal, Divider, Tooltip } from 'antd';
import Text from 'antd/es/typography/Text';
import { UserOutlined } from '@ant-design/icons';
import { FaPlaneDeparture } from 'react-icons/fa';

import { UserProfile } from '@/app/_components/Profile';
import clsx from 'clsx';
import { BsPatchCheckFill } from 'react-icons/bs';
import { MdOutlineAirplaneTicket, MdOutlineFlightClass } from 'react-icons/md';
import { TripType } from '@/app/_dtos/newTrip';

interface TripInfoProps {
  trip: TripType;
  isModal?: boolean;
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

const TripInfo: FC<TripInfoProps> = ({ trip, isModal = false }) => {
  const [openUserProfileModal, setOpenUserProfileModal] = useToggle(false);
  const [isModalDesc, setIsModalDesc] = useState(false);
  const [isTextTruncated, setIsTextTruncated] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const handleToggleUserProfile = () => {
    setOpenUserProfileModal();
  };
  const showModalDesc = () => {
    setIsModalDesc(true);
  };

  const handleClose = () => {
    setIsModalDesc(false);
  };

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      setIsTextTruncated(element.scrollWidth > element.clientWidth);
    }
  }, [trip.description]);

  return (
    <div
      className={clsx(
        'flex flex-col gap-6 items-center lg:justify-center lg:items-start h-full ',
        { 'w-full': isModal, 'w-full lg:w-1/2': !isModal },
      )}
    >
      <div className="flex flex-col lg:flex-row items-start justify-start w-full py-4 gap-2">
        <Avatar
          src={trip.user_data.image}
          size={54}
          icon={<UserOutlined />}
          onClick={!isModal ? handleToggleUserProfile : undefined}
          className={clsx('cursor-default border-2 border-[#CBC4CF]', {
            'cursor-pointer': !isModal,
          })}
        />
        <div className="space-y-1">
          <div className="flex items-start gap-2">
            <button
              type="button"
              onClick={!isModal ? handleToggleUserProfile : undefined}
              className={clsx(
                'cursor-default max-w-32 truncate text-[#1D1B20] text-sm font-bold',
                {
                  'cursor-pointer': !isModal,
                },
              )}
            >
              {trip.user_data.first_name} {trip.user_data.last_name}{' '}
            </button>
            {Boolean(trip.user_data.status === 've') && (
              <BsPatchCheckFill size={22} className="text-[#005DB8]" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Text className="text-[#1D1B20] text-sm font-bold">
              {trip.user_data.stats.avg_rate ? (
                trip.user_data.stats.avg_rate
              ) : (
                <span className="text-gray-500 text-xs font-medium">
                  Not Rated
                </span>
              )}
            </Text>
            <Tooltip
              title={trip.user_data.stats.total_successful_orders}
              color="#67548E"
              placement="right"
            >
              <Rate
                allowHalf
                defaultValue={trip.user_data.stats.avg_rate}
                disabled
              />
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="w-full flex justify-between">
          <div className="flex gap-x-1">
            <div className="text-[#1D1B20] text-sm font-bold">
              {trip.flight.source.location_data.airport.iata_code}
            </div>
            <div className="text-[#7A7580] text-sm">
              {trip.flight.source.location_data.city}
            </div>
          </div>
          <div className="flex gap-x-1">
            <div className="text-[#7A7580] text-sm">
              {trip.flight.destination.location_data.city}
            </div>
            <div className="text-[#1D1B20] text-sm font-bold">
              {trip.flight.destination.location_data.airport.iata_code}
            </div>
          </div>
        </div>
        <div className="w-full flex items-center gap-2">
          <div className="mx-2 relative flex items-center w-full before:w-2 before:h-2 before:border-2 before:border-[#67548E] before:absolute before:inset-y-1/2 before:-left-1 before:-translate-x-1/2 before:rounded-full before:-translate-y-1/2 after:w-2 after:h-2 after:border-2 after:border-[#67548E] after:absolute after:inset-y-1/2 after:-right-1 after:translate-x-1/2 after:rounded-full after:-translate-y-1/2">
            <Divider className="border-[#CBC4CF] text-gray-700 my-0" dashed>
              <Tooltip
                title={
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <MdOutlineFlightClass size={20} />
                      {trip.ticket_number}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <MdOutlineAirplaneTicket size={20} />
                      {trip.flight.number}
                    </div>
                  </div>
                }
                color="#67548E"
              >
                <FaPlaneDeparture className="cursor-pointer" />
              </Tooltip>
            </Divider>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="text-[#7A757F] font-bold text-sm">
              {trip.flight.source.location_data.airport.name}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#1D1B20] text-sm font-bold">
                {dateFormatter.format(new Date(trip.flight.source.to))}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-[#7A757F] font-bold text-sm">
              {trip.flight.destination.location_data.airport.name}
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-[#1D1B20] text-sm font-bold">
                {dateFormatter.format(new Date(trip.flight.destination.to))}
              </span>
            </div>
          </div>
        </div>
        <div className="flex mt-3 gap-x-2">
          <div ref={textRef} className="truncate font-normal">
            {trip.description}
          </div>
          {isTextTruncated && (
            <button
              type="button"
              className="text-[#67548E] font-medium border-none bg-transparent p-0"
              onClick={showModalDesc}
            >
              More
            </button>
          )}
        </div>
      </div>
      <Modal
        title="Trip Description"
        open={isModalDesc}
        onCancel={handleClose}
        footer={null}
      >
        <p>{trip.description}</p>
      </Modal>
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
        <UserProfile user={trip.user_data} />
      </Modal>
    </div>
  );
};

export default TripInfo;

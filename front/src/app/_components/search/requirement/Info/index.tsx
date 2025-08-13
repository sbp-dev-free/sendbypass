import { FC, useState } from 'react';
import round from 'lodash/round';
import has from 'lodash/has';
import get from 'lodash/get';
import { Divider, Image, Avatar, Modal } from 'antd';
import Text from 'antd/es/typography/Text';
import { UserOutlined } from '@ant-design/icons';
import { FaPlaneDeparture, FaWeightHanging } from 'react-icons/fa';
import Requirement from '@/app/_dtos/requirement';
import { UserProfile } from '@/app/_components/Profile';
import clsx from 'clsx';
import { RiExpandDiagonalFill } from 'react-icons/ri';
import { BsArrowUpRightSquare } from 'react-icons/bs';
import Link from 'next/link';
import { DEFAULT_CURRENCY } from '@/app/_dtos/currency';

interface RequirementInfoProps {
  requirement: Requirement;
  isModal?: boolean;
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

const RequirementInfo: FC<RequirementInfoProps> = ({
  requirement,
  isModal = false,
}) => {
  const [openUserProfileModal, setOpenUserProfileModal] = useState(false);

  const handleToggleUserProfile = () => {
    setOpenUserProfileModal(!openUserProfileModal);
  };

  return (
    <div className="flex flex-col gap-6 items-center w-full h-full">
      <div className="flex flex-row gap-4 justify-center w-full">
        <div className="flex flex-col lg:flex-row items-start justify-start w-full gap-2">
          <Avatar
            src={requirement.user_data.image}
            size={54}
            icon={<UserOutlined />}
            onClick={handleToggleUserProfile}
            className="cursor-pointer border-2 border-[#CBC4CF]"
          />
          <div className="space-y-1">
            <div
              className={`text-lg font-bold line-clamp-1 flex items-center gap-2 ${
                has(requirement, 'properties.link') ? 'underline' : ''
              }`}
            >
              {requirement.name}
              {has(requirement, 'properties.link') && (
                <Link
                  href={get(requirement, 'properties.link', '#') as string}
                  target="_blank"
                  className="text-[#1D1B1F] underline"
                >
                  <BsArrowUpRightSquare />
                </Link>
              )}
            </div>
            <div className="flex items-center divide-x-2 divide-gray-300">
              <Text className="text-[#7A7580] text-sm font-bold capitalize pr-2">
                {requirement.properties.type === 'ELECTRONIC_GADGET'
                  ? 'Electronic Gadget'
                  : requirement.properties.type.toLowerCase()}
              </Text>

              {requirement.cost.item_price &&
                requirement.type !== 'SHIPPING' && (
                  <Text className="text-[#7A7580] text-sm font-bold pl-2">
                    Product price{' '}
                    <span className="text-[#1D1B1F]">
                      {DEFAULT_CURRENCY.symbol}
                      {requirement.cost.item_price}
                    </span>
                  </Text>
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between xl:flex-row gap-4 w-full">
        <div className="w-full">
          <div className="flex justify-between">
            <div className="flex gap-x-1">
              <div className="text-[#1D1B20] text-sm font-bold">
                {requirement.source.location_data.country_iso2}
              </div>
              <div className="text-[#7A7580] text-sm">
                {requirement.source.location_data.city}
              </div>
            </div>
            <div className="flex gap-x-1">
              <div className="text-[#7A7580] text-sm">
                {requirement.destination.location_data.city}
              </div>
              <div className="text-[#1D1B20] text-sm font-bold">
                {requirement.destination.location_data.country_iso2}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="mx-2 relative flex items-center w-full before:w-2 before:h-2 before:border-2 before:border-[#67548E] before:absolute before:inset-y-1/2 before:-left-1 before:-translate-x-1/2 before:rounded-full before:-translate-y-1/2 after:w-2 after:h-2 after:border-2 after:border-[#67548E] after:absolute after:inset-y-1/2 after:-right-1 after:translate-x-1/2 after:rounded-full after:-translate-y-1/2">
              <Divider className="border-[#CBC4CF] text-gray-700 my-0" dashed>
                <FaPlaneDeparture />
              </Divider>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="text-[#7A7580] text-sm">
                {requirement.source.location_data.country}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#1D1B20] text-sm font-bold">
                  {dateFormatter.format(new Date(requirement.source.to))}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-[#7A7580] text-sm flex items-center justify-end">
                {requirement.destination.location_data.country}
              </div>
              <div className="flex items-center justify-end gap-2">
                <span className="text-[#1D1B20] text-sm font-bold">
                  {dateFormatter.format(new Date(requirement.destination.to))}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          className={clsx('', {
            'w-full flex flex-col md:flex-row items-center justify-center xl:justify-end':
              !isModal,
            'w-full flex flex-col-reverse items-center': isModal,
          })}
        >
          <div
            className={clsx('', {
              'mb-2 lg:mb-0 lg:mr-2': !isModal,
              'mt-4': isModal,
            })}
          >
            <div
              className={clsx('', {
                'flex items-center flex-wrap justify-center gap-2': isModal,
                'flex items-center gap-[6px]': !isModal,
              })}
            >
              <div className="flex flex-col items-center gap-[6px] justify-center w-[80px] h-[90px] border border-[#ECE6F0] px-[12px] py-[20px] rounded-lg">
                <div>
                  <FaWeightHanging className="text-xl text-[#67548E]" />
                </div>
                <div className="text-[12px] text-[#49454F] font-medium">
                  Weight
                </div>
                <div className="text-[12px] text-[#1D1B1F] font-medium">{`${round(requirement.properties.weight, 2)} kg`}</div>
              </div>
              <div className="flex items-center justify-center h-[90px] border border-[#ECE6F0] p-[8px] rounded-lg">
                <div className="flex flex-col items-center gap-[6px] px-[12px] py-[20px]">
                  <div>
                    <RiExpandDiagonalFill className="text-xl text-[#67548E]" />
                  </div>
                  <div className="text-[12px] text-[#49454F] font-medium">
                    Length
                  </div>
                  <div className="text-[12px] text-[#49454F] font-medium">
                    {`${round(requirement.properties.length, 2)} cm`}
                  </div>
                </div>
                <Divider type="vertical" className="h-full" />
                <div className="flex flex-col items-center gap-[6px] px-[12px] py-[20px]">
                  <div>
                    <RiExpandDiagonalFill className="text-xl text-[#67548E] rotate-45" />
                  </div>
                  <div className="text-[12px] text-[#49454F] font-medium">
                    Width
                  </div>
                  <div className="text-[12px] text-[#49454F] font-medium">
                    {`${round(requirement.properties.width, 2)} cm`}
                  </div>
                </div>
                <Divider type="vertical" className="h-full" />
                <div className="flex flex-col items-center gap-[6px] px-[12px] py-[20px]">
                  <div>
                    <RiExpandDiagonalFill className="text-xl text-[#67548E] rotate-[135deg]" />
                  </div>
                  <div className="text-[12px] text-[#49454F] font-medium">
                    Height
                  </div>
                  <div className="text-[12px] text-[#49454F] font-medium">
                    {`${round(requirement.properties.height, 2)} cm`}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Image
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
            src={requirement.image as unknown as string}
            height={isModal ? 140 : 120}
            width={isModal ? 140 : 120}
            preview={!isModal}
            className={clsx(' rounded-lg', {
              'md:min-w-[120px]': !isModal,
              'md:min-w-[140px]': isModal,
            })}
          />
        </div>
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
        <UserProfile user={requirement.user_data} />
      </Modal>
    </div>
  );
};

export default RequirementInfo;

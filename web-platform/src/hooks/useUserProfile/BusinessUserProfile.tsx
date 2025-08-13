import { FC } from "react";

import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import Skeleton from "@mui/material/Skeleton";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

import { Dot, Icon } from "@/components";
import { BUSINESS_TYPE } from "@/constants/profile";
import { PROFILE_STATUS } from "@/enums/globals";
import { useAddressData, useSocials } from "@/hooks";
import { useGetLanguagesQuery } from "@/services/language";
import { checkProfileType, cn } from "@/utils";

import { BusinessUserProfileModalProps } from "./types";

export const UserBusinessProfile: FC<BusinessUserProfileModalProps> = ({
  user,
}) => {
  const { data: languages, isLoading, isFetching } = useGetLanguagesQuery();

  const loading = isLoading || isFetching;
  const {
    addresses,
    background,
    image,
    email,
    phone_number,
    current_location,
    register_time,
    stats,
    status,
    speak_languages,
    socials,
    type,
    biz_id,
    tagline,
    biz_category,
  } = user ?? {};

  const { renderSocials } = useSocials(socials ?? undefined);

  const { verboseAddress } = useAddressData(addresses, current_location);
  const rate = (stats as any)?.total_successful_orders;
  const isVerified = status === PROFILE_STATUS.VERIFIED;

  const mappedLanguages = languages?.results
    ?.filter((item) => speak_languages?.includes(item.iso))
    .map((item) => {
      return item.name;
    });

  return (
    <div className="w-full px-16 md:px-0 lg:w-[970px] rounded-large overflow-hidden bg-surface-container-lowest">
      <div className="relative h-[115px] md:h-[200px]">
        <Image
          src={background ?? "/images/profile-bg-default.jpeg"}
          alt="profile background"
          width={800}
          height={200}
          className="object-cover w-full h-[115px] md:h-[200px] rounded-large md:rounded-none"
        />
        <Avatar
          sx={{ width: 100, height: 100 }}
          alt={email}
          src={image ?? ""}
          className="border-2 border-outline-variant absolute bottom-[76px] left-24"
        />
      </div>
      <div className="px-24 pt-40 pb-24 space-y-16">
        <div className="flex flex-col-reverse gap-16 justify-between items-start md:gap-0 md:flex-row">
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <h6 className="text-title-large text-on-surface">{biz_id}</h6>
              {isVerified && (
                <Icon
                  name="Check badge 2"
                  className={`text-[24px] ${checkProfileType(type)}`}
                />
              )}
            </div>
            {tagline && (
              <p className="text-label-medium text-on-surface-variant">
                {tagline}
              </p>
            )}
            <div className="text-label-medium text-outline items-start flex flex-col md:flex-row  gap-6 md:items-center">
              <p className="first-letter:uppercase self-start md:whitespace-nowrap">
                {BUSINESS_TYPE[biz_category!]} Company
              </p>
              <Dot className="hidden md:block" />
              <p className="first-letter:uppercase md:whitespace-nowrap">
                {verboseAddress}
              </p>
              <Dot className="hidden md:block" />
              <span className="self-start md:whitespace-nowrap">
                <span>Joined</span>
                {dayjs(register_time).format("DD MMM , YYYY")}
              </span>
            </div>
          </div>
          <div className="flex gap-8 items-center self-end md:self-auto">
            {rate === 0 ? (
              <span className="text-outline-variant text-body-small">
                Not rated
              </span>
            ) : (
              <span>
                <span className="text-on-surface-variant text-label-large">
                  {rate}
                </span>
                <span className="text-body-medium text-outline">/5</span>
              </span>
            )}
            <Rating
              value={rate ?? undefined}
              size="small"
              disabled
              icon={
                <Icon name="Star bold" className="text-warning text-[16px]" />
              }
              emptyIcon={
                <Icon
                  name={rate === 0 ? "Star bold" : "Star"}
                  className={cn("text-warning text-[16px]", {
                    "text-outline-variant": rate === 0,
                  })}
                />
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-16 items-start md:flex-row md:gap-y-0 md:gap-x-16">
          <ul className="md:w-1/2 space-y-8">
            {phone_number?.phone && (
              <li className="flex gap-4 items-center">
                <Icon
                  name="Smart phone"
                  className="text-on-surface-variant text-[18px]"
                />
                <div className="text-on-surface text-label-medium">
                  +{phone_number?.zone_code?.zip_code} {phone_number?.phone}
                </div>
              </li>
            )}
            <li className="flex gap-4 items-center">
              <Icon
                name="add username"
                className="text-on-surface-variant text-[18px]"
              />
              <span className="text-label-medium text-on-surface">{email}</span>
            </li>
            {verboseAddress && (
              <li className="flex gap-4 items-center">
                <Icon
                  name="Location"
                  className="text-on-surface-variant text-[18px]"
                />
                <span className="text-label-medium text-on-surface">
                  {verboseAddress}
                </span>
              </li>
            )}
          </ul>
          <div className="md:w-1/2 space-y-[10px]">
            <div className="pl-8">
              <div className="text-body-small text-outline">
                Language you speak
              </div>
              {!loading ? (
                <>
                  {mappedLanguages && mappedLanguages.length > 0 && (
                    <div className="text-label-medium text-on-surface">
                      {mappedLanguages.join(", ")}
                    </div>
                  )}
                </>
              ) : (
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  className="rounded-small h-16 w-2/3"
                />
              )}
            </div>
            <div className="flex gap-4 items-center">{renderSocials()}</div>
          </div>
        </div>
      </div>
      <Link
        href={`/business-profile/${biz_id}`}
        className="h-[52px] flex justify-between px-24 bg-surface-container-low items-center cursor-pointer mb-16 md:mb-0 rounded-medium md:rounded-none"
      >
        <span className="text-label-medium text-on-surface">
          View all information
        </span>

        <Icon name="arrow left md" className="text-on-surface" />
      </Link>
    </div>
  );
};

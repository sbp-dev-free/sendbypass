import { FC } from "react";

import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import Skeleton from "@mui/material/Skeleton";
import dayjs from "dayjs";
import Image from "next/image";

import { Icon, ResponsiveTooltip } from "@/components";
import { SOCIAL_PLATFORMS } from "@/constants/profile";
import { PROFILE_STATUS } from "@/enums/globals";
import { useAddressData, useSocials } from "@/hooks";
import { useGetLanguagesQuery } from "@/services/language";
import { checkProfileType, cn } from "@/utils";

import { UseUserProfileModal } from "./types";

const formatDate = (date: Date) => {
  return dayjs(date).format("ddd DD MMM");
};

const renderPhoneRelatedSocials = (icons?: string[]) => {
  const socials = SOCIAL_PLATFORMS.filter((item) =>
    icons?.includes(item.value),
  );

  return socials?.map((social, index) => {
    return (
      <Icon
        key={index}
        name={social.icon}
        className="text-[24px] text-surface-bright"
      />
    );
  });
};

export const UserProfile: FC<UseUserProfileModal> = ({ user }) => {
  const { data: languages, isLoading, isFetching } = useGetLanguagesQuery();
  const loading = isLoading || isFetching;
  const {
    addresses,
    background,
    bio,
    first_name,
    last_name,
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
  } = user ?? {};

  const { renderSocials } = useSocials(socials ?? undefined);

  const { verboseAddress } = useAddressData(addresses, current_location);
  const rate = stats?.total_successful_orders;
  const isVerified = status === PROFILE_STATUS.VERIFIED;

  const mappedLanguages = languages?.results
    ?.filter((item) => speak_languages?.includes(item.iso))
    .map((item) => {
      return item.name;
    });

  return (
    <div className="w-full px-16 md:px-0 lg:w-[800px] rounded-large overflow-hidden bg-surface-container-lowest">
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
              <h6 className="text-title-large text-on-surface">
                {first_name} {last_name}
              </h6>
              {isVerified && (
                <Icon
                  name="Check badge 2"
                  className={`text-[24px] ${checkProfileType(type)}`}
                />
              )}
            </div>
            {verboseAddress && (
              <p className="text-label-medium text-on-surface-variant">
                {verboseAddress}
              </p>
            )}
            {register_time && (
              <p className="space-x-4 text-body-small text-outline">
                <span>Joined</span>
                <span>{formatDate(new Date(register_time))}</span>
              </p>
            )}
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
        <div className="text-body-small text-on-surface-variant">{bio}</div>
        <div className="flex flex-col gap-y-16 items-start md:flex-row md:gap-y-0 md:gap-x-16">
          <ul className="md:w-1/2 space-y-8">
            {phone_number?.phone && (
              <li className="flex gap-4 items-center">
                <Icon
                  name="Smart phone"
                  className="text-on-surface-variant text-[18px]"
                />
                {phone_number?.socials && phone_number?.socials.length > 0 ? (
                  <ResponsiveTooltip
                    title={
                      <div className="flex items-center">
                        {renderPhoneRelatedSocials(phone_number?.socials)}
                      </div>
                    }
                    placement="top"
                    slotProps={{
                      popper: {
                        modifiers: [
                          {
                            name: "preventOverflow",
                            options: {
                              boundary: "window",
                            },
                          },
                        ],
                      },
                      tooltip: {
                        sx: {
                          backgroundColor: "rgb(var(--inverse-surface))",
                        },
                      },
                      arrow: {
                        sx: {
                          color: "rgb(var(--inverse-surface))",
                        },
                      },
                    }}
                    arrow
                  >
                    <span className="text-label-medium text-on-surface">
                      +{phone_number?.zone_code?.zip_code} {phone_number?.phone}
                    </span>
                  </ResponsiveTooltip>
                ) : (
                  <span className="text-label-medium text-on-surface">
                    +{phone_number?.zone_code?.zip_code} {phone_number?.phone}
                  </span>
                )}
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
    </div>
  );
};

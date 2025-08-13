"use client";

import { FC } from "react";

import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";

import { Icon } from "@/components/shared";
import { useUserProfileModal } from "@/hooks";
import { checkProfileType, cn } from "@/utils";

import { PassengerInfoProps } from "./types";

export const PassengerInfo: FC<PassengerInfoProps> = ({
  name,
  rate,
  image,
  isVerified,
  user,
}) => {
  const { toggleProfile, UserProfile } = useUserProfileModal({ user });

  return (
    <div className="flex gap-16 items-center">
      <Avatar
        sx={{ width: 40, height: 40 }}
        alt={name}
        src={image}
        className="border-2 cursor-pointer border-outline-variant"
        onClick={toggleProfile}
      />
      <div className="space-y-2">
        <div className="flex gap-x-4 items-center">
          <span className="text-label-large text-on-surface">{name}</span>
          {isVerified && (
            <Icon
              name="Check badge 2"
              className={`text-[20px] ${checkProfileType(user?.type)}`}
            />
          )}
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-label-large text-on-surface-variant">
            {rate === 0 ? (
              <span className="text-outline-variant text-body-small">
                Not rated
              </span>
            ) : (
              rate
            )}
          </span>
          <Rating
            value={rate}
            disabled
            size="small"
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
      {UserProfile}
    </div>
  );
};

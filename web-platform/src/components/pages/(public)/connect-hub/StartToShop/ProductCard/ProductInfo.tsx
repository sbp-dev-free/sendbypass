"use client";

import { FC } from "react";

import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Link from "next/link";

import { Icon } from "@/components/shared";
import { useUserProfileModal } from "@/hooks";
import { cn, DEFAULT_CURRENCY } from "@/utils";

import { ProductInfoProps } from "./types";

export const ProductInfo: FC<ProductInfoProps> = (productInfo) => {
  const { user, name, link, price, category, shipping, show } = productInfo;

  const { toggleProfile, UserProfile } = useUserProfileModal({ user });

  return (
    <div className="flex gap-16 items-center">
      {show && (
        <Avatar
          sx={{ width: 40, height: 40 }}
          alt={user.email}
          src={user.image}
          className="border-2 cursor-pointer border-outline-variant"
          onClick={toggleProfile}
        />
      )}
      <div className="space-y-2">
        <div className="flex items-center">
          {link && !shipping ? (
            <Link
              href={link ?? ""}
              target="_blank"
              className={cn("text-title-medium text-on-surface line-clamp-1", {
                underline: true,
              })}
            >
              {name}
            </Link>
          ) : (
            <div
              className={cn("text-title-medium text-on-surface line-clamp-1", {
                underline: link && !shipping,
              })}
            >
              {name}
            </div>
          )}
          {link && !shipping && (
            <Link href={link ?? ""} target="_blank">
              <Icon
                name="Right Up Square"
                className="text-[20px] text-on-surface"
              />
            </Link>
          )}
        </div>
        <div className="flex gap-12 items-center">
          {!shipping && (
            <>
              <div className="space-x-4 text-label-medium-prominent text-on-surface">
                <span>Product price</span>
                <span>
                  {" "}
                  {DEFAULT_CURRENCY.symbol}
                  {price}
                </span>
              </div>
              <Divider flexItem orientation="vertical" />
            </>
          )}
          <span className="capitalize text-label-medium-prominent text-outline">
            {category.toLowerCase()}
          </span>
        </div>
      </div>
      {UserProfile}
    </div>
  );
};

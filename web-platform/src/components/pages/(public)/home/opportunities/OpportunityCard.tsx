"use client";

import { FC } from "react";

import Button from "@mui/material/Button";
import { useRouter } from "nextjs-toploader/app";

import { Icon } from "@/components/shared/Icon";
import { AUTH_ROUTES, ROUTES } from "@/constants";
import { getToken } from "@/utils";

import { OpportunityCardProps } from "./types";

const renderTitle = (id: number) => {
  switch (id) {
    case 1:
      return "Trip";
    case 2:
      return "Purchase";
    case 3:
      return "Luggage";
    default:
      return "Trip";
  }
};

export const OpportunityCard: FC<OpportunityCardProps> = ({
  id,
  title,
  icon,
  caption,
  href,
}) => {
  const { push } = useRouter();

  const isLoggedIn = getToken("access");

  const handleRedirect = () => {
    if (!isLoggedIn) {
      push(`${AUTH_ROUTES.signin}?redirect=${ROUTES.home}`);
      return;
    }
    push(href ?? ROUTES.home);
  };

  return (
    <div className="flex flex-col gap-20 items-center p-16 w-full border-2 transition-all duration-300 border-primary-opacity-8 rounded-large hover:border-surface-container-lowest hover:bg-surface-container-lowest hover:shadow-light-5">
      <div className="space-y-16 text-center">
        <Icon name={icon} className="text-[40px] text-primary" />
        <h6 className="text-title-medium text-on-surface">{title}</h6>
        <span className="text-body-small text-on-surface-variant">
          {caption}
        </span>
      </div>
      <Button
        variant="tonal"
        fullWidth
        className="h-[56px]"
        onClick={handleRedirect}
      >
        Add Your {renderTitle(id)}
      </Button>
    </div>
  );
};

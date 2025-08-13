"use client";

import Button from "@mui/material/Button";
import { useRouter } from "nextjs-toploader/app";

import { Icon } from "@/components/shared/Icon";
import { AUTH_ROUTES, PRIVATE_ROUTES, ROUTES } from "@/constants";
import { getToken } from "@/utils";

export const JoinUsButton = () => {
  const { push } = useRouter();
  const isLoggedIn = getToken("access");

  const handleJoinUs = () => {
    if (isLoggedIn) return push(PRIVATE_ROUTES.profile);
    push(`${AUTH_ROUTES.signin}?redirect=${ROUTES.home}`);
  };

  return (
    <Button
      variant="tonal"
      startIcon={<Icon name="plus" />}
      className="!bg-primary-container !h-[48px] !w-[110px] !rounded-full !whitespace-nowrap"
      onClick={handleJoinUs}
    >
      Join us
    </Button>
  );
};

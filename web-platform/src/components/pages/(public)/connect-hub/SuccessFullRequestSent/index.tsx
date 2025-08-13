import { FC } from "react";

import Button from "@mui/material/Button";
import { useRouter } from "nextjs-toploader/app";

import { CheckBadge } from "@/components/icons";
import { PRIVATE_ROUTES } from "@/constants";

import { SuccessFullRequestSentProps } from "./types";

export const SuccessFullRequestSent: FC<SuccessFullRequestSentProps> = ({
  onClose,
}) => {
  const { push } = useRouter();

  const handleGoToRequests = () => {
    push(PRIVATE_ROUTES.requests);
  };

  return (
    <div className="flex flex-col gap-40 justify-center items-center p-24 text-center rounded-large bg-surface-container-lowest">
      <div className="space-y-16">
        <div className="flex flex-col items-center">
          <CheckBadge />
          <h1 className="text-title-large text-on-surface">Success!</h1>
        </div>
        <p className="text-title-medium text-on-surface">
          Your request was sent.
        </p>
        <p className="text-body-medium text-on-surface-variant">
          Follow up on your existing request or submit a new one.{" "}
        </p>
      </div>
      <div className="flex gap-12 items-center w-full">
        <Button variant="tonal" fullWidth onClick={onClose}>
          Explore more
        </Button>
        <Button fullWidth onClick={handleGoToRequests}>
          Your Requests
        </Button>
      </div>
    </div>
  );
};

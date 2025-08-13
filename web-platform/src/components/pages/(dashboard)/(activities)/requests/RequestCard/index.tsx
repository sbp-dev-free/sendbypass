import { Request, RequestSide } from "@/enums/requests";

import { NeedHeader } from "./NeedsHeader";
import { RequestTrip } from "./RequestTrip";
import { ServiceHeader } from "./ServiceHeader";
import { RequestCardProps } from "./types";

export const RequestCard = ({
  requests: requestsWrapper,
}: RequestCardProps) => {
  const { requests, activity, side, type } = requestsWrapper;
  const isService = type === Request.SERVICE;

  const needHeader = {
    inbox: side === RequestSide.INBOX,
    isService: type === Request.SERVICE,
    count: requests.length,
    activity: activity,
  };

  const serviceHeader = {
    inbox: side === RequestSide.INBOX,
    isService: type === Request.SERVICE,
    count: requests.length,
    activity: activity,
  };

  const renderRequests = () => {
    return requests.map((request) => {
      return (
        <RequestTrip
          key={request.id}
          request={request}
          activity={activity}
          isService={isService}
          inbox={side === RequestSide.INBOX}
        />
      );
    });
  };

  return (
    <div className="space-y-8 rounded-medium bg-surface-container-low">
      {isService ? (
        <ServiceHeader {...serviceHeader} />
      ) : (
        <NeedHeader {...needHeader} />
      )}
      <div className="px-8 pb-8 space-y-8">{renderRequests()}</div>
    </div>
  );
};

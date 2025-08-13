"use client";

import Skeleton from "@mui/material/Skeleton";
import { useSearchParams } from "next/navigation";

import { FolderFileWarning1 } from "@/components/icons";
import { Request, RequestSide } from "@/enums/requests";
import { useGetRequestsQuery } from "@/services/requests";

import { RequestCard } from "./RequestCard";

export const Requests = () => {
  const searchParams = useSearchParams();
  const { side, activity } = Object.fromEntries(searchParams.entries());

  const {
    data: requests,
    isLoading,
    isFetching,
  } = useGetRequestsQuery({
    side: side !== "all" ? (side as RequestSide) : undefined,
    activity: activity ? (activity as Request) : Request.SERVICE,
  });

  const renderRequests = () => {
    if (isLoading || isFetching) {
      return (
        <>
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton
              key={index}
              animation="wave"
              variant="rectangular"
              className="!min-h-[188px] rounded-small"
            />
          ))}
        </>
      );
    }

    if (!requests?.results.length && !isLoading && !isFetching) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="space-y-16 flex flex-col items-center justify-center">
            <FolderFileWarning1 />
            <div className="text-center">
              <div className="text-title-small text-on-surface">
                No Requests yet
              </div>
              <p className="text-body-small text-outline">
                Start by adding your first need to get things moving!
              </p>
            </div>
          </div>
        </div>
      );
    }

    return requests?.results.map((request) => {
      return <RequestCard key={request.activity.id} requests={request} />;
    });
  };

  return <div className="p-12 space-y-12 h-full">{renderRequests()}</div>;
};

import { useMemo } from 'react';
import useFetcher from '@/app/_hooks/useFetcher';
import URLS from '@/app/_configs/urls';
import { PaginatedRequests } from '../_dtos/request';

export const usePendingRequests = () => {
  const { data: requestsResponse } = useFetcher<PaginatedRequests>({
    url: URLS.requests(),
    isProtected: true,
  });

  const pendingRequests = useMemo(() => {
    const requests = requestsResponse?.results || [];
    const pendingRequestsArray: any[] = [];
    requests.forEach((request: any) => {
      if (request.status === 'PENDING') {
        pendingRequestsArray.push(request);
      }
    });
    return pendingRequestsArray;
  }, [requestsResponse]);

  const requestsBadge = useMemo(() => {
    return pendingRequests?.length > 0 ? (
      <div className="w-2 h-2 rounded-full bg-red-500 absolute -top-2 lg:top-1 right-0 z-10" />
    ) : null;
  }, [pendingRequests]);

  return { pendingRequests, requestsBadge };
};

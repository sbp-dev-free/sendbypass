import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { CiExport, CiImport } from 'react-icons/ci';
import Link from 'next/link';
import { ItemType } from 'antd/es/menu/interface';
import { PaginatedRequests } from '../_dtos/request';
import useFetcher from './useFetcher';
import URLS from '../_configs/urls';
import { RequirementTypeEnum } from '../_dtos/requirementTypes';

export const useMenuData = () => {
  const pathname = usePathname();

  const { data: requestsResponse } = useFetcher<PaginatedRequests>({
    url: URLS.requests(),
    isProtected: true,
  });

  const pendingRequests = useMemo(() => {
    const requests = requestsResponse?.results || [];
    const pendingRequestsMap = new Map();
    requests.forEach((request: any) => {
      if (request.status === 'PENDING') {
        pendingRequestsMap.set(
          `${request.requirement_data.type}-${request.role}`,
          true,
        );
      }
    });
    return pendingRequestsMap;
  }, [requestsResponse]);

  const menuItems: ItemType[] = useMemo(() => {
    const hasPendingRequest = (type: string, role: string) => {
      return pendingRequests.get(`${type}-${role}`);
    };
    return [
      {
        key: 'all',
        label: (
          <Link className="flex items-center gap-2 w-[320px]" href="/requests">
            All
          </Link>
        ),
      },
      {
        key: 'shipping',
        label: pathname.includes('shipping') ? (
          <div className="text-[#67548E]">Shipping</div>
        ) : (
          'Shipping'
        ),
        type: 'group',
        children: [
          {
            key: 'shipping-sent',
            label: (
              <Link
                className="flex items-center gap-2 relative w-[320px]"
                href="/requests/sent/shipping"
              >
                <CiExport className="text-xl" />
                <span>Outbox</span>
                {hasPendingRequest(
                  RequirementTypeEnum.Enum.SHIPPING,
                  'TRAVELER',
                ) && (
                  <div className="w-2 h-2 rounded-full bg-red-500 absolute top-1 right-60 z-10" />
                )}
              </Link>
            ),
          },
          {
            key: 'shipping-received',
            label: (
              <Link
                className="flex items-center gap-2 relative w-[320px]"
                href="/requests/received/shipping"
              >
                <CiImport className="text-xl" />
                <span>Inbox</span>
                {hasPendingRequest(
                  RequirementTypeEnum.Enum.SHIPPING,
                  'CUSTOMER',
                ) && (
                  <div className="w-2 h-2 rounded-full bg-red-500 absolute top-1 right-60 z-10" />
                )}
              </Link>
            ),
          },
        ],
      },
      {
        key: 'shopping',
        label: pathname.includes('shopping') ? (
          <div className="text-[#67548E]">Shopping</div>
        ) : (
          'Shopping'
        ),
        type: 'group',
        children: [
          {
            key: 'shopping-sent',
            label: (
              <Link
                className="flex items-center gap-2 relative w-[320px]"
                href="/requests/sent/shopping"
              >
                <CiExport className="text-xl" />
                <span>Outbox</span>
                {hasPendingRequest(
                  RequirementTypeEnum.Enum.SHOPPING,
                  'TRAVELER',
                ) && (
                  <div className="w-2 h-2 rounded-full bg-red-500 absolute top-1 right-60 z-10" />
                )}
              </Link>
            ),
          },
          {
            key: 'shopping-received',
            label: (
              <Link
                className="flex items-center gap-2 relative w-[320px]"
                href="/requests/received/shopping"
              >
                <CiImport className="text-xl" />
                <span>Inbox</span>
                {hasPendingRequest(
                  RequirementTypeEnum.Enum.SHOPPING,
                  'CUSTOMER',
                ) && (
                  <div className="w-2 h-2 rounded-full bg-red-500 absolute top-1 right-60 z-10" />
                )}
              </Link>
            ),
          },
        ],
      },
    ];
  }, [pathname, pendingRequests]);

  return { menuItems };
};

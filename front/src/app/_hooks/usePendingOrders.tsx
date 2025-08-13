import { useMemo } from 'react';
import useFetcher from '@/app/_hooks/useFetcher';
import URLS from '@/app/_configs/urls';
import { PaginatedOrders } from '../_dtos/order';

export const usePendingOrders = () => {
  const { data: ordersResponse } = useFetcher<PaginatedOrders>({
    url: URLS.orders(),
    isProtected: true,
  });

  const pendingOrders = useMemo(() => {
    const orders = ordersResponse?.results || [];
    const pendingOrdersArray: any[] = [];
    orders.forEach((order: any) => {
      if (order.status === 'PENDING') {
        pendingOrdersArray.push(order);
      }
    });
    return pendingOrdersArray;
  }, [ordersResponse]);

  const ordersBadge = useMemo(() => {
    return pendingOrders.length > 0 ? (
      <div className="w-1 h-1 rounded-full bg-red-500 absolute -top-2 lg:top-1 right-0 z-10" />
    ) : null;
  }, [pendingOrders]);

  return { pendingOrders, ordersBadge };
};

"use client";

import Skeleton from "@mui/material/Skeleton";
import { useSearchParams } from "next/navigation";

import { useGetOrdersQuery } from "@/services/orders";

import { OrderCard } from "./OrderCard";

export const Orders = () => {
  const searchParams = useSearchParams();

  const {
    data: orders,
    isLoading,
    isFetching,
  } = useGetOrdersQuery({
    type: searchParams.get("type") || undefined,
    status: searchParams.get("status") || undefined,
  });

  return (
    <div className="flex flex-col gap-12 p-12">
      {isLoading || isFetching
        ? Array.from({ length: 2 }).map((_, index) => (
            <Skeleton
              key={index}
              animation="wave"
              variant="rectangular"
              className="!min-h-[188px] rounded-small"
            />
          ))
        : orders?.results?.map((order, index) => (
            <OrderCard key={index} order={order} />
          ))}
    </div>
  );
};

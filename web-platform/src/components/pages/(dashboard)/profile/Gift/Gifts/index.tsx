import { useEffect } from "react";

import Skeleton from "@mui/material/Skeleton";

import { useGetGiftsQuery } from "@/services/gifts";

import { GiftsCard } from "./GiftsCard";
import { GiftsProps } from "./types";
export const Gifts = ({ activeTab }: GiftsProps) => {
  const {
    data: giftsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetGiftsQuery({ active: activeTab }, { skip: !activeTab });

  useEffect(() => {
    refetch();
  }, [activeTab, refetch]);

  return (
    <div className="md:w-full">
      {isLoading || isFetching
        ? Array.from({ length: 2 }).map((_, index) => (
            <Skeleton
              key={index}
              animation="wave"
              variant="rectangular"
              className="!min-h-[308px] rounded-small"
            />
          ))
        : giftsData?.results?.map((gift, index) => (
            <GiftsCard key={index} {...gift} />
          ))}
    </div>
  );
};

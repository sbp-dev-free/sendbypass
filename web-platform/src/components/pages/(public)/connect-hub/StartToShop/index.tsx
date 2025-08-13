"use client";

import Skeleton from "@mui/material/Skeleton";
import { useSearchParams } from "next/navigation";

import { ROLE, TRIP_TYPE } from "@/enums/globals";
import { useGetRequirementsQuery } from "@/services/requirements";

import { EmptyResult } from "../EmptyResult";
import { KeepExploringFrame } from "../KeepExploringFrame";

import { ProductCard } from "./ProductCard";

const DEFAULT_PARAMS = {
  types: [TRIP_TYPE.SHOPPING],
  role: ROLE.TRAVELER,
};

export const StartToShop = () => {
  const searchParams = useSearchParams();
  const { from_location, to_location, cost, weight, item_types } =
    Object.fromEntries(searchParams.entries());

  const {
    data: requirements,
    isLoading,
    isFetching,
  } = useGetRequirementsQuery({
    ...DEFAULT_PARAMS,
    from_location,
    to_location,
    cost,
    weight,
    item_types,
    similar: false,
  });

  const {
    data: similarRequirements,
    isLoading: similarLoading,
    isFetching: similarFetching,
  } = useGetRequirementsQuery(
    {
      ...DEFAULT_PARAMS,
      from_location,
      to_location,
      cost,
      weight,
      item_types,
      similar: true,
    },
    { skip: Boolean(isLoading || isFetching || !requirements) },
  );

  const renderSimilaRequirements = () => {
    if (similarLoading || similarFetching) {
      return (
        <>
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton
              key={index}
              animation="wave"
              variant="rectangular"
              className="!min-h-[269px] rounded-small"
            />
          ))}
        </>
      );
    }

    if (
      similarRequirements?.results.length &&
      !similarLoading &&
      !similarFetching
    ) {
      return (
        <KeepExploringFrame>
          {similarRequirements?.results.map((requirement) => (
            <ProductCard key={requirement.id} requirement={requirement} />
          ))}
        </KeepExploringFrame>
      );
    }
  };

  const renderRequirements = () => {
    if (!requirements?.results.length && !isLoading && !isFetching) {
      return <EmptyResult />;
    }

    if (requirements?.results && !isLoading && !isFetching) {
      return requirements.results.map((requirement) => (
        <ProductCard key={requirement.id} requirement={requirement} />
      ));
    }

    return (
      <>
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton
            key={index}
            animation="wave"
            variant="rectangular"
            className="!min-h-[269px] rounded-small"
          />
        ))}
      </>
    );
  };

  return (
    <div className="space-y-8">
      {renderRequirements()}
      {renderSimilaRequirements()}
    </div>
  );
};

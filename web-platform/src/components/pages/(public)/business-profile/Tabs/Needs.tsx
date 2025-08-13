"use client";
import Skeleton from "@mui/material/Skeleton";

import { useGetRequirementsQuery } from "@/services/requirements";

import { NeedsEmpty } from "../../../(dashboard)/(activities)/needs/NeedsList/NeedsEmpty";
import { ProductCard } from "../../connect-hub/StartToShop/ProductCard";

import { NeedsProps } from "./types";
export const Needs = ({ biz_id }: NeedsProps) => {
  const {
    data: requirements,
    isLoading,
    isFetching,
  } = useGetRequirementsQuery({
    biz_id: biz_id,
  });
  const renderRequirements = () => {
    if (!requirements?.results.length && !isLoading && !isFetching) {
      return (
        <div className="bg-surface-container-lowest rounded-medium">
          <NeedsEmpty />
        </div>
      );
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
  return <div className="space-y-12">{renderRequirements()}</div>;
};

"use client";

import { ChangeEvent } from "react";

import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { ITEM_TYPE } from "@/enums/globals";

import { FilterCheckBox } from "./FilterCheckBox";

export const Category = () => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const setSearchParams = (newParams: URLSearchParams) => {
    replace(`?${newParams.toString()}`, { scroll: false });
  };

  const selectedCategories = searchParams.get("item_types")?.split(",") || [];

  const handleOnChangeCategory = (
    event: ChangeEvent<HTMLInputElement>,
    category: ITEM_TYPE,
  ) => {
    const newCategories = new Set(selectedCategories);

    event.target.checked
      ? newCategories.add(category)
      : newCategories.delete(category);

    const newParams = new URLSearchParams(searchParams.toString());
    newCategories.size > 0
      ? newParams.set("item_types", Array.from(newCategories).join(","))
      : newParams.delete("item_types");

    setSearchParams(newParams);
  };

  return (
    <div className="space-y-12">
      <div className="text-title-small text-on-surface">Category</div>
      <div className="py-4">
        {Object.values(ITEM_TYPE).map((category) => (
          <FilterCheckBox
            key={category}
            id={category.toLowerCase()}
            label={category.replace("_", " ")}
            checked={selectedCategories.includes(category)}
            onChange={(e) => handleOnChangeCategory(e, category)}
          />
        ))}
      </div>
    </div>
  );
};

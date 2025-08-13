"use client";

import { MouseEvent, useEffect } from "react";

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useReadLocalStorage } from "usehooks-ts";

import { Icon, LocationAutocomplete, TabList } from "@/components/shared";
import { Option } from "@/components/shared/LocationAutocomplete/types";
import { CONNECT_HUB_TABS } from "@/constants/connect-hub";

import { SearchBoxProps } from "./types";

const renderTabs = () => {
  return CONNECT_HUB_TABS.map(({ value, label, icon }) => (
    <TabList.Tab key={value} value={value} icon={icon}>
      {label}
    </TabList.Tab>
  ));
};

export const Desktop = ({
  currentTab,
  from,
  to,
  handleChangeTab,
  setFrom,
  setTo,
}: SearchBoxProps) => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const fromLocationParam = searchParams.get("from_location");
  const toLocationParam = searchParams.get("to_location");

  const storedLocations =
    useReadLocalStorage<{ from: Option; to: Option; tab: string }[]>(
      "searchHistory",
    );

  useEffect(() => {
    if (!from && !to) {
      let storedFrom: Option | null = null;
      let storedTo: Option | null = null;

      if (fromLocationParam) {
        const matchedFrom = storedLocations?.find(
          (entry) => entry.from.value === fromLocationParam,
        );
        if (matchedFrom) storedFrom = matchedFrom.from;
      }

      if (toLocationParam) {
        const matchedTo = storedLocations?.find(
          (entry) => entry.to.value === toLocationParam,
        );
        if (matchedTo) storedTo = matchedTo.to;
      }

      if (storedFrom) setFrom(storedFrom);
      if (storedTo) setTo(storedTo);
    }
  }, [fromLocationParam, toLocationParam, storedLocations]);

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSearch = (event: MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(window.location.search);
    if (from?.value) {
      params.set("from_location", from.value);
    } else {
      params.delete("from_location");
    }
    if (to?.value) {
      params.set("to_location", to.value);
    } else {
      params.delete("to_location");
    }
    replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <form className="hidden md:block" onSubmit={handleSearch}>
      <div className="hidden p-16 md:block">
        <TabList value={currentTab} onChange={handleChangeTab}>
          {renderTabs()}
        </TabList>
      </div>
      <Divider />
      <div className="hidden relative flex-col gap-12 justify-between items-center p-16 md:flex md:flex-row">
        <LocationAutocomplete
          value={from}
          onChange={setFrom}
          placeholder="From"
        />
        <IconButton
          color="tonal"
          className="!absolute !top-48 !right-48 md:!relative md:!top-0 md:!right-0"
          onClick={handleSwap}
        >
          <Icon name="swap-horizontal" />
        </IconButton>
        <LocationAutocomplete value={to} onChange={setTo} placeholder="To" />
        <Button variant="tonal" className="!h-[56px]" type="submit">
          Search
        </Button>
      </div>
    </form>
  );
};

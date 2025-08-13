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
import { CONNECT_HUB_MOBILE_TABS, TABS_ENUM } from "@/constants/connect-hub";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils";

import { SearchBoxModalProps } from "./types";

const renderBottomSheetTabs = () => {
  return CONNECT_HUB_MOBILE_TABS.map(({ value, label }) => (
    <TabList.Tab key={value} value={value} className={cn("gap-4 px-16 py-8")}>
      {label}
    </TabList.Tab>
  ));
};

export const SearchBoxModal = ({
  currentTab,
  from,
  to,
  handleChangeTab,
  toggle,
  setFrom,
  setTo,
}: SearchBoxModalProps) => {
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
    let route = "";
    switch (currentTab) {
      case TABS_ENUM.requestToPassengers:
        route = ROUTES.connectHub.requestToPassengers;
        break;
      case TABS_ENUM.startToShop:
        route = ROUTES.connectHub.startToShop;
        break;
      case TABS_ENUM.startToShip:
        route = ROUTES.connectHub.startToShip;
        break;
      default:
        route = ROUTES.connectHub.requestToPassengers;
    }
    const paramsString = params.toString();
    const targetUrl = paramsString ? `${route}?${paramsString}` : route;
    replace(targetUrl, { scroll: false });
    toggle();
  };

  return (
    <form onSubmit={handleSearch}>
      <div className="p-16">
        <div className="flex justify-between items-center pb-32">
          <div className="text-title-large text-on-surface">Modify search</div>
          <IconButton
            color="outlined"
            onClick={toggle}
            className="!size-32"
            sx={{ borderColor: "rbg(var(--surface-dim))" }}
          >
            <Icon name="Close remove" className="text-[16px]" />
          </IconButton>
        </div>
        <div className="flex justify-center px-16 pb-16 w-full">
          <TabList
            value={currentTab}
            onChange={(tab) => handleChangeTab(tab, false)}
          >
            {renderBottomSheetTabs()}
          </TabList>
        </div>
        <Divider />
      </div>
      <div className="relative p-16 space-y-12">
        <LocationAutocomplete
          value={from}
          onChange={setFrom}
          placeholder="From"
        />
        <IconButton
          color="tonal"
          className="!bg-primary-container !absolute !top-48 !right-48 z-10"
          onClick={handleSwap}
        >
          <Icon name="swap-horizontal" className="!rotate-90" />
        </IconButton>
        <LocationAutocomplete value={to} onChange={setTo} placeholder="To" />
      </div>
      <div className="mt-auto p-16 bg-surface-container-lowest">
        <Button fullWidth sx={{ height: "56px" }} type="submit">
          Search
        </Button>
      </div>
    </form>
  );
};

"use client";

import { useState } from "react";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "nextjs-toploader/app";
import { useLocalStorage } from "usehooks-ts";

import { Icon, LocationAutocomplete, TabList } from "@/components";
import { Option } from "@/components/shared/LocationAutocomplete/types";
import { ROUTES } from "@/constants";
import { DESKTOP_TABS } from "@/constants/home";
import { cn } from "@/utils";

import { renderTabs } from "./renderers";
import { SearchBoxProps, SearchHistoryItem } from "./types";

export const SearchBox = ({ onTabChange }: SearchBoxProps) => {
  const [tab, setTab] = useState(DESKTOP_TABS[0].value);
  const [from, setFrom] = useState<Option | null>(null);
  const [to, setTo] = useState<Option | null>(null);

  const { push } = useRouter();

  const [searchHistory, setSearchHistory] = useLocalStorage<
    SearchHistoryItem[]
  >("searchHistory", []);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isRotate, setIsRotate] = useState(false);

  const handleTabChange = (value: string) => {
    setTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  const handleSwap = () => {
    setIsRotate(!isRotate);
    setFrom((prevFrom) => {
      setTo(prevFrom);
      return to;
    });
  };

  const handleSearch = () => {
    let path = "";
    const params = new URLSearchParams();
    const fromTag = from?.value;
    const toTag = to?.value;

    if (from && to) {
      const newSearch: SearchHistoryItem = {
        from,
        to,
        tab,
      };

      const updatedHistory = [...searchHistory, newSearch];
      if (updatedHistory.length > 5) {
        updatedHistory.shift();
      }
      setSearchHistory(updatedHistory);
    }

    if (fromTag) params.append("from_location", fromTag);
    if (toTag) params.append("to_location", toTag);

    switch (tab) {
      case DESKTOP_TABS[0].value:
        path = ROUTES.connectHub.requestToPassengers;
        break;
      case DESKTOP_TABS[1].value:
        path = ROUTES.connectHub.startToShip;
        break;
      case DESKTOP_TABS[2].value:
        path = ROUTES.connectHub.startToShop;
        break;
      default:
        return;
    }

    push(`${path}?${params.toString()}`);
  };
  return (
    <div className="mt-48 mb-16 p-4 rounded-large bg-surface-container-low border-2 border-surface-container-highest space-y-6">
      <div className="flex justify-center md:justify-start">
        <TabList
          value={tab}
          onChange={handleTabChange}
          className="gap-4 md:pl-8"
        >
          {renderTabs(DESKTOP_TABS)}
        </TabList>
      </div>
      <div className="flex relative flex-col gap-12 justify-between items-center p-16 md:flex-row bg-surface-container-lowest rounded-[16px]">
        <LocationAutocomplete
          value={from}
          onChange={setFrom}
          placeholder="From"
        />
        <IconButton
          color="tonal"
          className="!absolute !bg-primary-container !top-[52px] !right-64 md:!relative md:!top-0 md:!right-0 z-10 rotate-90 md:rotate-0 "
          onClick={handleSwap}
        >
          <Icon
            name="swap-horizontal"
            className={cn("transition-all", {
              "rotate-180": isRotate,
            })}
          />
        </IconButton>
        <LocationAutocomplete value={to} onChange={setTo} placeholder="To" />
        <Button
          variant="filled"
          className="!h-[56px]"
          fullWidth={isMobile}
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
    </div>
  );
};

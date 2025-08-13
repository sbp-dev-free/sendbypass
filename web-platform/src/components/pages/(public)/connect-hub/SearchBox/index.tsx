"use client";

import { useState } from "react";

import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { Option } from "@/components/shared/LocationAutocomplete/types";
import { TABS_ENUM } from "@/constants/connect-hub";
import { ROUTES } from "@/constants/routes";

import { Desktop } from "./Desktop";
import { Mobile } from "./Mobile";

const getActiveTab = (pathname: string) => {
  switch (pathname) {
    case ROUTES.connectHub.requestToPassengers:
      return TABS_ENUM.requestToPassengers;
    case ROUTES.connectHub.startToShop:
      return TABS_ENUM.startToShop;
    case ROUTES.connectHub.startToShip:
      return TABS_ENUM.startToShip;
    default:
      return TABS_ENUM.requestToPassengers;
  }
};

export const SearchBox = () => {
  const [from, setFrom] = useState<Option | null>(null);
  const [to, setTo] = useState<Option | null>(null);

  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const [currentTab, setCurrentTab] = useState(
    getActiveTab(redirectUrl || pathname),
  );

  const handleReset = () => {
    setFrom(null);
    setTo(null);
  };

  const handleChangeTab = (tab: string, shouldNavigate: boolean = true) => {
    setCurrentTab(tab);
    if (shouldNavigate) {
      switch (tab) {
        case TABS_ENUM.requestToPassengers:
          push(ROUTES.connectHub.requestToPassengers);
          handleReset();
          break;
        case TABS_ENUM.startToShop:
          push(ROUTES.connectHub.startToShop);
          handleReset();
          break;
        case TABS_ENUM.startToShip:
          push(ROUTES.connectHub.startToShip);
          handleReset();
          break;
        default:
          break;
      }
    } else {
      handleReset();
    }
  };

  return (
    <div className="p-4 md:bg-surface-container-lowest md:rounded-small md:p-0 bg-surface-container-high rounded-large">
      <Desktop
        currentTab={currentTab}
        handleChangeTab={handleChangeTab}
        from={from}
        to={to}
        setFrom={setFrom}
        setTo={setTo}
      />
      <Mobile
        currentTab={currentTab}
        handleChangeTab={handleChangeTab}
        from={from}
        to={to}
        setFrom={setFrom}
        setTo={setTo}
      />
    </div>
  );
};

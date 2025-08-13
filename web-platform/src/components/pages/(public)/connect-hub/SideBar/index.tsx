"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { ROUTES } from "@/constants";

import { PassengersSidebar } from "./RequestToPassengers";
import { StartToShipSidebar } from "./StartToShip";
import { StartToShopSidebar } from "./StartToShop";

const renderSidebar = (pathname: string) => {
  switch (pathname) {
    case ROUTES.connectHub.requestToPassengers:
      return <PassengersSidebar />;
    case ROUTES.connectHub.startToShop:
      return <StartToShopSidebar />;
    case ROUTES.connectHub.startToShip:
      return <StartToShipSidebar />;
    default:
      return null;
  }
};

export const SideBar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const decodedRedirectUrl = redirectUrl
    ? decodeURIComponent(redirectUrl)
    : null;

  let extractedPath = decodedRedirectUrl
    ? new URL(decodedRedirectUrl, window.location.origin).pathname
    : null;

  return (
    <div className="bg-surface-container-lowest rounded-small p-12 w-full md:w-[298px] md:min-w-[298px] h-full md:h-fit">
      {renderSidebar(extractedPath || pathname)}
    </div>
  );
};

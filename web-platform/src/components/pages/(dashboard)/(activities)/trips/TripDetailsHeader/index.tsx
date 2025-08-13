"use client";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { usePathname, useRouter } from "next/navigation";

import { Icon } from "@/components";
import { PRIVATE_ROUTES } from "@/constants";

export const TripDetailsHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isDesktop = !isMobile;

  const handleAddTrip = () => {
    router.push(PRIVATE_ROUTES.trips.create);
  };

  const handleBack = () => {
    router.push(PRIVATE_ROUTES.trips.index);
  };

  const getPageContent = () => {
    switch (pathname) {
      case PRIVATE_ROUTES.trips.index:
        return {
          title: "My Trips",
          subtitle: "Enter your trip details accurately.",
          showBackButton: false,
          showAddButton: true,
        };
      case PRIVATE_ROUTES.trips.create:
        return {
          title: "Add trip",
          subtitle: "Enter your trip details accurately.",
          showBackButton: true,
          showAddButton: false,
        };
      default:
        if (
          pathname.startsWith(PRIVATE_ROUTES.trips.index) &&
          pathname !== PRIVATE_ROUTES.trips.index
        ) {
          return {
            title: "Edit trip",
            subtitle: "View and manage your trip information.",
            showBackButton: true,
            showAddButton: false,
          };
        }
        return {
          title: "My Trips",
          subtitle: "Enter your trip details accurately.",
          showBackButton: false,
          showAddButton: true,
        };
    }
  };

  const { title, subtitle, showBackButton, showAddButton } = getPageContent();

  return (
    <div className="flex justify-between items-center mb-8 md:mb-6">
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 items-center">
          {showBackButton && (
            <IconButton color="standard" onClick={handleBack} className="p-2">
              <Icon name="arrow right md" />
            </IconButton>
          )}
          <div>
            <h1 className="text-title-large text-on-surface">{title}</h1>
            <span className="mt-1 text-body-small text-on-surface-variant">
              {subtitle}
            </span>
          </div>
        </div>
      </div>

      {showAddButton && isDesktop && (
        <Button variant="filled" onClick={handleAddTrip}>
          Add trip
        </Button>
      )}

      {showAddButton && isMobile && (
        <IconButton
          onClick={handleAddTrip}
          className="md:hidden !fixed bottom-8 right-8 z-50 rounded-medium bg-primary shadow-lg"
          aria-label="Add new trip"
        >
          <Icon name="plus" />
        </IconButton>
      )}
    </div>
  );
};

"use client";

import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "nextjs-toploader/app";

import { Icon } from "@/components";
import { ROUTES } from "@/constants";
import { BELONGING_ITEMS } from "@/constants/home";

import { BelongingItem } from "./BelongingItem";

export const YourBelongings = () => {
  const { push } = useRouter();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const renderBelongingItems = () => {
    return BELONGING_ITEMS.map(({ id, ...props }) => (
      <BelongingItem key={id} {...props} />
    ));
  };

  const handleGoToAboutUs = () => {
    push(ROUTES.aboutUs);
  };

  return (
    <div className="flex flex-col-reverse gap-20 py-32 md:px-80 md:justify-between md:items-stretch md:flex-row">
      <Button
        variant="text"
        endIcon={<Icon name="Arrow Left MD" />}
        className="md:!hidden"
        fullWidth={isMobile}
        onClick={handleGoToAboutUs}
      >
        About us
      </Button>
      <div className="grid grid-cols-1 gap-8 md:gap-16 md:grid-cols-2">
        {renderBelongingItems()}
      </div>
      <div className="flex flex-col gap-16 px-32 pt-32 pb-16 md:w-[416px] justify-between">
        <div className="space-y-16">
          <div className="relative mr-auto w-2 h-40 bg-on-surface">
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 rotate-90">
              <div className="w-16 h-16 border-b-2 border-r-2 border-on-surface transform rotate-[315deg]"></div>
            </div>
          </div>

          <h5 className="font-light text-display-small text-on-surface">
            <span className="font-semibold">Your belongings</span> are our
            priority
          </h5>
        </div>
        <div>
          <Button
            variant="text"
            endIcon={<Icon name="Arrow Left MD" />}
            className="!hidden md:!inline-flex"
            onClick={handleGoToAboutUs}
          >
            About us
          </Button>
        </div>
      </div>
    </div>
  );
};

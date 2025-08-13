"use client";

import { useState } from "react";

import Container from "@mui/material/Container";

import { DESKTOP_TABS, SLIDES_TEXT } from "@/constants/home";

import HeroBanner from "./HeroBanner";
import { SearchBox } from "./SearchBox";

export const Hero = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabChange = (tabValue: string) => {
    const index = DESKTOP_TABS.findIndex((tab) => tab.value === tabValue);
    setActiveTabIndex(index >= 0 ? index : 0);
  };
  return (
    <div className="relative -mt-16 md:-mt-24">
      <div className="h-[300px] md:h-[428px]">
        <div className="h-full w-full relative md:scale-100 scale-[0.7] lg:rounded-b-medium md:overflow-hidden">
          <HeroBanner activeTabIndex={activeTabIndex as 0 | 1 | 2} />
        </div>
        <div className="absolute bottom-[22%] md:bottom-[20%] inset-x-0 z-10 space-y-12 mb-6 md:space-y-16 md:mb-0">
          {SLIDES_TEXT[activeTabIndex]}
          <div className="flex gap-8 justify-center">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-4 rounded-full transition-all duration-300 ${activeTabIndex === i - 1 ? "w-24 bg-primary" : "w-8 bg-outline-variant"}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
      <Container className="absolute inset-x-0 top-[195px] z-10 md:bottom-[-105px] md:top-[unset]">
        <div className="px-8 md:px-40">
          <SearchBox onTabChange={handleTabChange} />
        </div>
      </Container>
    </div>
  );
};

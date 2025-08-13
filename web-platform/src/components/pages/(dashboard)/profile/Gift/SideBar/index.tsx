"use client";

import { RoundedTabList, VerticalTabs } from "@/components/shared";
import { GIFT_STATUS } from "@/constants/profile";
import { useDevice } from "@/hooks";

import { GiftSidebarProps } from "./types";

export const GiftSidebar = ({ activeTab, setActiveTab }: GiftSidebarProps) => {
  const { isMobile } = useDevice();

  const handleChangeParam = (key: string, value: string) => {
    if (key === "active") {
      setActiveTab(value);
    }
  };

  return (
    <>
      {isMobile ? (
        <RoundedTabList
          className="mb-16 w-full"
          value={activeTab}
          onChange={(value) => handleChangeParam("active", value)}
        >
          {GIFT_STATUS.map(({ label, value }) => (
            <RoundedTabList.Tab key={value} value={value}>
              <div className="flex items-center gap-4">{label}</div>
            </RoundedTabList.Tab>
          ))}
        </RoundedTabList>
      ) : (
        <div className="hidden md:flex w-[204px] relative flex-shrink-0">
          <div className="sticky top-0 flex-col w-full">
            <div className="p-12 w-full bg-surface-container-lowest rounded-medium border border-surface-container-high">
              <VerticalTabs
                value={activeTab}
                onChange={(value) => handleChangeParam("active", value)}
              >
                {GIFT_STATUS.map(({ label, value, icon }) => (
                  <VerticalTabs.Tab key={value} value={value} icon={icon}>
                    <div className="flex items-center gap-4">{label}</div>
                  </VerticalTabs.Tab>
                ))}
              </VerticalTabs>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

"use client";
import { useState } from "react";

import { TabList } from "@/components/shared";
import { BUSINESS_PROFILE_Info_TABS } from "@/constants/profile";

import { BusinessProfileTabsProps } from "./types";

export const BusinessProfileTabs = ({
  tabComponents,
}: BusinessProfileTabsProps) => {
  const [currentTab, setCurrentTab] = useState<
    (typeof BUSINESS_PROFILE_Info_TABS)[number]["value"]
  >(BUSINESS_PROFILE_Info_TABS[0].value);

  const handleTabChange = (
    tab: (typeof BUSINESS_PROFILE_Info_TABS)[number]["value"],
  ) => {
    setCurrentTab(tab);
  };

  const renderTabContent = (tab: string) => {
    return tabComponents[tab] || null;
  };

  return (
    <div className="space-y-8">
      <div className="flex md:flex-row flex-col">
        <TabList
          className="justify-center md:justify-start w-fit "
          value={currentTab}
          onChange={handleTabChange as () => void}
        >
          {BUSINESS_PROFILE_Info_TABS.map((tab) => (
            <TabList.TabV2 key={tab.value} value={tab.value}>
              {tab.label}
            </TabList.TabV2>
          ))}
        </TabList>
      </div>
      {renderTabContent(currentTab)}
    </div>
  );
};

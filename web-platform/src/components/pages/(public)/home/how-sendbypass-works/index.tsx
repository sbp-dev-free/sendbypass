"use client";

import { useState } from "react";

import Image from "next/image";

import { TabList } from "@/components";
import {
  HOW_SENDBYPASS_WORKS_TABS,
  PASSENGER_TAB_CONTENT,
  SENDER_TAB_CONTENT,
  SHOPPER_TAB_CONTENT,
} from "@/constants/home";

import { TabContent } from "./TabContent";

export const HowSendbypassWorks = () => {
  const [tab, setTab] = useState(HOW_SENDBYPASS_WORKS_TABS[0].value);

  const renderTabs = () => {
    return HOW_SENDBYPASS_WORKS_TABS.map(({ value, label }) => (
      <TabList.Tab key={value} value={value}>
        {label}
      </TabList.Tab>
    ));
  };

  const renderTabContent = (tab: string) => {
    const tabContents = (() => {
      switch (tab) {
        case "shopper":
          return SHOPPER_TAB_CONTENT;
        case "passenger":
          return PASSENGER_TAB_CONTENT;
        case "sender":
          return SENDER_TAB_CONTENT;
        default:
          return [];
      }
    })();

    return tabContents.map(({ id, label }) => (
      <TabContent key={id} id={id} label={label} />
    ));
  };

  return (
    <div className="flex flex-col gap-16 items-center md:gap-24 md:p-32 md:flex-row">
      <div className="space-y-24 grow">
        <h4 className="font-light text-display-small text-on-surface">
          <span className="font-semibold">How Sendbypass</span> Works.
        </h4>
        <div className="space-y-16">
          <TabList className="gap-0 xs:gap-4" value={tab} onChange={setTab}>
            {renderTabs()}
          </TabList>
          <div className="space-y-8">{renderTabContent(tab)}</div>
        </div>
      </div>

      <div className="relative w-full md:w-[416px] h-[400px]">
        <Image
          key={tab}
          src={`/images/home/how-sendbypass-works/${tab}.svg`}
          alt="how-sendbypass-works"
          width={416}
          height={400}
          sizes="100vw"
          className="object-cover rounded-large w-full h-[400px] opacity-0 scale-95 animate-fade-scale"
        />
      </div>
    </div>
  );
};

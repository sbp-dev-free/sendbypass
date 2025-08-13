import { TabList } from "@/components/shared";
import { DESKTOP_TABS } from "@/constants/home";

export const renderTabs = (tabs: typeof DESKTOP_TABS) =>
  tabs.map(({ label, value, icon }) => (
    <TabList.TabV2
      key={value}
      classes={{ icon: "hidden md:block" }}
      value={value}
      icon={icon}
      className="md:h-[36px]"
    >
      {label}
    </TabList.TabV2>
  ));

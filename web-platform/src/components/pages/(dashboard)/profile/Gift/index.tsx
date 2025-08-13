import { useState } from "react";

import { GIFT_STATUS } from "@/constants/profile";

import { Gifts } from "./Gifts";
import { GiftSidebar } from "./SideBar";

export const Gift = () => {
  const [activeTab, setActiveTab] = useState<string>(GIFT_STATUS[0].value);
  return (
    <div className="md:flex gap-16">
      <GiftSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Gifts activeTab={activeTab} />
    </div>
  );
};

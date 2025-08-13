import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import { useToggle } from "usehooks-ts";

import { Icon, TabList } from "@/components/shared";
import { CONNECT_HUB_MOBILE_TABS } from "@/constants/connect-hub";
import { cn } from "@/utils";

import { SearchBoxModal } from "./SearchBoxModal";
import { SearchBoxProps } from "./types";

const renderTabs = (tab: string) => {
  return CONNECT_HUB_MOBILE_TABS.map(({ value, label }) => (
    <TabList.Tab
      key={value}
      value={value}
      className={cn(
        "hover:bg-transparent px-16 py-8 text-title-small text-outline w-full hover:text-outline",
        {
          "text-primary hover:text-primary hover:bg-transparent bg-transparent":
            value === tab,
        },
      )}
    >
      {label}
    </TabList.Tab>
  ));
};

export const Mobile = ({
  currentTab,
  from,
  to,
  handleChangeTab,
  setFrom,
  setTo,
}: SearchBoxProps) => {
  const [openSearchBottomSheet, toggleSearchBottomSheet] = useToggle(false);

  return (
    <div className="md:hidden">
      <div className="flex justify-center">
        <TabList
          value={currentTab}
          onChange={handleChangeTab}
          className="w-full"
        >
          {renderTabs(currentTab)}
        </TabList>
      </div>
      <div className="p-8 bg-surface-container-lowest rounded-medium">
        <div className="flex items-center">
          <div className="py-4 pr-12 pl-4 space-x-2 w-full">
            <div className="flex gap-8 items-center w-full h-24">
              <span className="text-body-small text-outline">
                {from?.label.country || "Any location"}
              </span>
              <div className="relative w-full text-center border-t border-dashed before:w-8 before:h-8 before:border-2 before:border-primary before:absolute before:inset-y-1/2 before:left-4 before:-translate-x-1/2 before:rounded-full before:-translate-y-1/2 after:w-8 after:h-8 after:border-2 after:border-primary after:absolute after:inset-y-1/2 after:right-4 after:translate-x-1/2 after:rounded-full after:-translate-y-1/2 border-outline-variant">
                <Icon
                  name="plane take off"
                  className="text-[24px] text-on-surface-variant absolute inset-x-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-40 bg-surface-container-lowest"
                />
              </div>
              <span className="text-body-small text-outline">
                {to?.label.country || "Any location"}
              </span>
            </div>
          </div>
          <IconButton
            className="!h-[84px] !w-[56px]"
            onClick={toggleSearchBottomSheet}
          >
            <Icon name="Search" />
          </IconButton>
        </div>
      </div>
      <Dialog
        open={openSearchBottomSheet}
        onClose={toggleSearchBottomSheet}
        fullScreen
      >
        <SearchBoxModal
          from={from}
          to={to}
          setFrom={setFrom}
          setTo={setTo}
          currentTab={currentTab}
          handleChangeTab={handleChangeTab}
          toggle={toggleSearchBottomSheet}
        />
      </Dialog>
    </div>
  );
};

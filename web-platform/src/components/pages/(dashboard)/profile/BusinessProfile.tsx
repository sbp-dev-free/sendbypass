"use client";
import { MouseEvent, useState } from "react";

import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { useToggle } from "usehooks-ts";

import { Drawer, Icon, TabList } from "@/components/shared";
import { PRIVATE_ROUTES } from "@/constants";
import { BUSINESS_PROFILE_TABS } from "@/constants/profile";
import { PROFILE_STATUS } from "@/enums/globals";
import { useUserProfileModal } from "@/hooks";
import { useBusinessProfileQuery, useProfileQuery } from "@/services/profile";
import { cn } from "@/utils";

import { AddressForm } from "./AddressForm";
import { BusinessProfileForm } from "./BusinessProfileForm";
import { ContactForm } from "./ContactForm";
import { Gift } from "./Gift";
import { MoreMenu } from "./MoreMenu";
import { PeopleForm } from "./PeopleForm";
import { ProfileProcess } from "./ProfileProcess";
import { ProfileStatusDrawer } from "./ProfileStatusDrawer";
import { SetPassword } from "./SetPassword";
import Verification from "./Verification";

export const BusinessProfile = () => {
  const { data: userProfile } = useProfileQuery();
  const { toggleProfile, UserProfile } = useUserProfileModal({
    user: userProfile,
  });
  const { data: profile } = useBusinessProfileQuery({
    biz_id: userProfile?.biz_id!,
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentTab, setCurrentTab] = useState<
    (typeof BUSINESS_PROFILE_TABS)[number]["value"]
  >(BUSINESS_PROFILE_TABS[0].value);
  const handleShowMore = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [openSetPassword, setOpenSetPassword] = useState(false);
  const handleTabChange = (
    tab: (typeof BUSINESS_PROFILE_TABS)[number]["value"],
  ) => {
    setCurrentTab(tab);
  };

  const [openDrawer, toggleOpenDrawer] = useToggle();
  const { push } = useRouter();
  const handleOpenSetPassword = () => setOpenSetPassword(true);
  const handleCloseSetPassword = () => setOpenSetPassword(false);

  const renderTabContent = (
    tab: (typeof BUSINESS_PROFILE_TABS)[number]["value"],
  ) => {
    switch (tab) {
      case "basic":
        return <BusinessProfileForm />;
      case "contact":
        return <ContactForm />;
      case "address":
        return <AddressForm />;
      case "people":
        return <PeopleForm />;
      case "gift":
        return <Gift />;
      case "verification":
        return <Verification toggleOpenDrawer={toggleOpenDrawer} />;
      default:
        return null;
    }
  };

  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);
  const handleClickMoreItem = (id: number) => {
    switch (id) {
      case 1:
        toggleProfile();
        break;
      case 3:
        handleOpenSetPassword();
        break;
      case 4:
        push(PRIVATE_ROUTES.deleteAccount);
        break;
      default:
        break;
    }
    handleClose();
  };

  return (
    <>
      <div
        className={cn(
          "p-16 space-y-32 bg-surface-container-lowest rounded-medium",
          {
            "mt-48": profile?.status === PROFILE_STATUS.PENDING,
          },
        )}
      >
        <div className="flex justify-between items-center">
          <div className="space-y-4 md:pl-8">
            <h1 className="text-title-large text-on-surface">
              Business Profile
            </h1>
            <p className="text-body-small text-on-surface-variant">
              Carefully fill out all three sections.
            </p>
          </div>
          <Button
            variant="text"
            endIcon={<Icon name="Info menu" />}
            className="h-[44px]"
            onClick={handleShowMore}
          >
            More
          </Button>
        </div>
        <div className="space-y-16">
          <div className="flex md:flex-row flex-col">
            <TabList
              className="justify-center md:justify-start overflow-auto no-scrollbar "
              value={currentTab}
              onChange={handleTabChange as () => void}
            >
              {BUSINESS_PROFILE_TABS.map((tab) => (
                <TabList.Tab key={tab.value} value={tab.value}>
                  {tab.label}
                </TabList.Tab>
              ))}
            </TabList>
            <ProfileProcess
              profile={profile}
              className="ml-auto w-full md:w-auto"
              onClick={toggleOpenDrawer}
            />
          </div>
          {renderTabContent(currentTab)}
        </div>
        <MoreMenu
          anchorEl={anchorEl}
          open={open}
          handleClose={handleClose}
          handleClickMoreItem={handleClickMoreItem}
          businessProfile
        />
        {UserProfile}

        <SetPassword
          open={openSetPassword}
          onClose={handleCloseSetPassword}
          email={profile?.email || ""}
        />
      </div>
      {profile && (
        <Drawer open={openDrawer} onClose={toggleOpenDrawer}>
          <ProfileStatusDrawer
            profile={profile}
            onClose={(e) => {
              handleTabChange((e as any).tab);
              toggleOpenDrawer();
            }}
          />
        </Drawer>
      )}
    </>
  );
};

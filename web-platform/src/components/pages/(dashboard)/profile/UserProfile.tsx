"use client";
import { MouseEvent, useState } from "react";

import Button from "@mui/material/Button";
import { useRouter } from "nextjs-toploader/app";
import { useToggle } from "usehooks-ts";

import { Icon, TabList } from "@/components/shared";
import { Drawer } from "@/components/shared/Drawer";
import { PRIVATE_ROUTES } from "@/constants";
import { PROFILE_TABS } from "@/constants/profile";
import { PROFILE_STATUS } from "@/enums/globals";
import { useUserProfileModal } from "@/hooks";
import { useProfileQuery } from "@/services/profile";
import { cn } from "@/utils";

import { AddressForm } from "./AddressForm";
import { ContactForm } from "./ContactForm";
import { MoreMenu } from "./MoreMenu";
import { ProfileForm } from "./ProfileForm";
import { ProfileProcess } from "./ProfileProcess";
import { ProfileStatusDrawer } from "./ProfileStatusDrawer";
import { SetPassword } from "./SetPassword";
import Verification from "./Verification";

export const UserProfile = () => {
  const [currentTab, setCurrentTab] = useState<
    (typeof PROFILE_TABS)[number]["value"]
  >(PROFILE_TABS[0].value);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openSetPassword, setOpenSetPassword] = useState(false);
  const { data: profile } = useProfileQuery();
  const { toggleProfile, UserProfile } = useUserProfileModal({ user: profile });

  const renderTabContent = (tab: string) => {
    switch (tab) {
      case "personal":
        return <ProfileForm />;
      case "contact":
        return <ContactForm />;
      case "address":
        return <AddressForm />;
      case "verification":
        return <Verification toggleOpenDrawer={toggleOpenDrawer} />;

      default:
        return null;
    }
  };
  const { push } = useRouter();

  const open = Boolean(anchorEl);

  const handleTabChange = (tab: (typeof PROFILE_TABS)[number]["value"]) => {
    setCurrentTab(tab);
  };

  const handleShowMore = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);
  const handleOpenSetPassword = () => setOpenSetPassword(true);
  const handleCloseSetPassword = () => setOpenSetPassword(false);

  const handleClickMoreItem = (id: number) => {
    switch (id) {
      case 1:
        toggleProfile();
        break;
      case 2:
        push(PRIVATE_ROUTES.switchToBusinessAccount);
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
  const [openDrawer, toggleOpenDrawer] = useToggle();

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
            <h1 className="text-title-large text-on-surface">Profile</h1>
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
              {PROFILE_TABS.map((tab) => (
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

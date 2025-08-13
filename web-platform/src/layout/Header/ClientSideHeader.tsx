"use client";

import { useEffect, useState } from "react";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useSelector } from "react-redux";
import { useToggle } from "usehooks-ts";

import { BottomSheet, Icon, SelectionModal } from "@/components";
import { AUTH_ROUTES, ROUTES } from "@/constants";
import { NEED_OPTIONS } from "@/constants/globals";
import { useHasHydrated } from "@/hooks";
import { selectUser } from "@/store/slices/authSlice";
import { cn } from "@/utils";

import { DrawerMenu } from "./DrawerMenu";
import { ProfileMenuDesktop, ProfileMenuMobile } from "./ProfileMenu";
import { SuspensedSignInButton } from "./SignInButton";

const ClientSideHeader = () => {
  const hasHydrated = useHasHydrated();
  const [open, setOpen] = useState(false);
  const [isBottomSheetOpen, toggleBottomSheet] = useToggle();
  const [isNeedTypeModal, setIsNeedTypeModal] = useState(false);
  const { push } = useRouter();
  const pathname = usePathname();

  const profile = useSelector(selectUser);
  const isUserLoggedIn = profile?.email;
  const handleToggleMenu = () => {
    setOpen(!open);
  };

  const openNeedTypeModal = () => {
    if (!isUserLoggedIn)
      return push(`${AUTH_ROUTES.signin}?redirect=${ROUTES.home}`);
    setIsNeedTypeModal(true);
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!hasHydrated)
    return (
      <div className="flex ml-auto gap-12">
        <Skeleton
          variant="rectangular"
          className="!bg-surface md:rounded-medium rounded-full w-40 !h-40 md:w-[110px] ml-auto"
        />
        <Skeleton
          variant="rectangular"
          className="!bg-surface rounded-medium w-40 !h-40 md:w-[120px]"
        />{" "}
      </div>
    );
  return (
    <>
      <div
        className={cn("hidden gap-16 items-center md:flex", {
          "gap-8": isUserLoggedIn,
        })}
      >
        {isUserLoggedIn ? (
          <ProfileMenuDesktop profile={profile} />
        ) : (
          <>
            <SuspensedSignInButton />
            <Divider orientation="vertical" className="!h-24 !w-2" />
          </>
        )}
        <Button
          variant="tonal"
          className={cn({ "!ml-12": isUserLoggedIn })}
          onClick={openNeedTypeModal}
        >
          Add Item
        </Button>
      </div>
      <div className="flex gap-4 justify-end items-center md:hidden">
        {isUserLoggedIn ? (
          <Avatar
            sx={{ width: 32, height: 32 }}
            src={profile?.image}
            className="border-2 border-outline-variant"
            onClick={toggleBottomSheet}
          />
        ) : (
          <SuspensedSignInButton />
        )}
        {isUserLoggedIn && (
          <BottomSheet open={isBottomSheetOpen} onClose={toggleBottomSheet}>
            <ProfileMenuMobile
              profile={profile}
              toggleBottomSheet={toggleBottomSheet}
            />
          </BottomSheet>
        )}
        <IconButton color="standard" onClick={handleToggleMenu}>
          <Icon name={open ? "Close remove" : "Hamburger menu"} />
        </IconButton>
      </div>
      <Drawer
        anchor="right"
        open={open}
        ModalProps={{
          keepMounted: false,
        }}
        sx={{
          "&": {
            height: "calc(100vh - 148px)",
            top: "148px",
          },
          "& .MuiBackdrop-root": {
            height: "calc(100vh - 148px)",
            top: "148px",
          },
          "& .MuiDrawer-paper": {
            width: "100%",
            height: "calc(100vh - 148px)",
            top: "148px",
            boxShadow: "none",
          },
        }}
      >
        <DrawerMenu
          openNeedTypeModal={openNeedTypeModal}
          handleToggleMenu={handleToggleMenu}
        />
      </Drawer>
      <SelectionModal
        open={isNeedTypeModal}
        onClose={() => setIsNeedTypeModal(false)}
        title="Choose your option"
        options={NEED_OPTIONS}
      />
    </>
  );
};

export default ClientSideHeader;

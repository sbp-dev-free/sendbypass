"use client";

import { ReactNode, Suspense, useState } from "react";

import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";

import { Icon } from "@/components";
import {
  SearchBox,
  SideBar,
  // SortBox,
} from "@/components/pages/(public)/connect-hub";

export default function ConnectHubLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleToggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  return (
    <Suspense>
      <div className="space-y-12">
        <SearchBox />
        <div className="flex gap-12">
          <div className="hidden md:block">
            <SideBar />
          </div>
          <div className="grow">
            <div className="flex gap-8 items-center">
              <div className="md:hidden mb-12 md:mb-0">
                <IconButton
                  color="tonal"
                  sx={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "rgb(var(--surface-container-lowest))",
                  }}
                  onClick={handleToggleFilters}
                >
                  <Icon name="Filter" className="text-[24px]" />
                </IconButton>
              </div>
              {/* <SortBox /> */}
            </div>
            {children}
          </div>
        </div>
      </div>
      <Drawer
        open={isFiltersOpen}
        onClose={handleToggleFilters}
        anchor="left"
        sx={{
          "& .MuiDrawer-paper": {
            width: "100%",
          },
        }}
        ModalProps={{
          keepMounted: false,
        }}
      >
        <div className="flex justify-between items-center py-12 px-16 rounded-small bg-surface-container-lowest">
          <div className="text-title-large text-on-surface">Filters</div>
          <IconButton
            color="outlined"
            sx={{
              width: "32px",
              height: "32px",
              backgroundColor: "rgb(var(--surface-container-lowest))",
              borderColor: "rgb(var(--surface-dim))",
            }}
            onClick={handleToggleFilters}
          >
            <Icon name="Close remove" className="text-[20px]" />
          </IconButton>
        </div>
        <SideBar />
      </Drawer>
    </Suspense>
  );
}

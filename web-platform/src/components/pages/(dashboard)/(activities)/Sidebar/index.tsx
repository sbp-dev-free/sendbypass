"use client";

import { useMemo } from "react";

import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { Chip, Icon, RoundedTabList, VerticalTabs } from "@/components";
import { NEEDS_STATUSES, SHIPPING_SHOPPING_TABS } from "@/constants";
import { useActivityStats } from "@/hooks";
import { cn } from "@/utils";

import { ActivityStats, NeedType, StatusKey } from "./types";

export const ActivitiesSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = useMemo(() => pathname.split("/").at(-1) || "", [pathname]);

  const routeHasNavbar = useMemo(
    () => ["shipping", "shopping"].includes(activeTab),
    [activeTab],
  );

  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "active";

  const setSearchParams = (newParams: URLSearchParams) => {
    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  const handleStatusChange = (status: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("status", status);
    setSearchParams(newParams);
  };
  const { stats } = useActivityStats() as { stats: ActivityStats };

  const getStatusCount = (statusValue: StatusKey): number => {
    if (!stats) return 0;

    if (
      (activeTab === "shipping" || activeTab === "shopping") &&
      (activeTab as NeedType) in stats.needs
    ) {
      const tabKey = activeTab as NeedType;
      return stats.needs[tabKey][statusValue] || 0;
    }

    if (activeTab === "trips") {
      return stats.trips[statusValue] || 0;
    }

    return 0;
  };

  return (
    <div>
      {routeHasNavbar && (
        <div className="md:hidden ">
          <RoundedTabList
            className="mb-16 w-full"
            value={activeTab}
            onChange={(val) => router.push(val)}
          >
            {SHIPPING_SHOPPING_TABS.map(({ label, value }) => (
              <RoundedTabList.Tab key={value} value={value}>
                {label}
              </RoundedTabList.Tab>
            ))}
          </RoundedTabList>
        </div>
      )}
      <div className="flex justify-between items-center my-12 md:hidden">
        <div className="flex gap-4">
          {NEEDS_STATUSES.map(({ value, label }) => (
            <Chip
              key={value}
              color={status === value ? "active" : "surface"}
              onClick={() => handleStatusChange(value)}
              label={label}
              hideIcon
            ></Chip>
          ))}
        </div>
        <IconButton
          color="filled"
          onClick={() => router.push(`${activeTab}/create`)}
        >
          <Icon name="plus" />
        </IconButton>
      </div>

      <div className="w-[204px] relative">
        <div className="hidden sticky top-0 flex-col w-full md:flex">
          {routeHasNavbar && (
            <div className="p-12 w-full bg-surface-container-lowest rounded-medium ">
              <VerticalTabs
                value={activeTab}
                onChange={(val) => router.push(val)}
              >
                {SHIPPING_SHOPPING_TABS.map(({ label, value, icon }) => (
                  <VerticalTabs.Tab key={value} value={value} icon={icon}>
                    {label}
                  </VerticalTabs.Tab>
                ))}
              </VerticalTabs>
            </div>
          )}

          <div
            className={cn(
              "w-full bg-surface-container-lowest p-12 rounded-medium",
              {
                "mt-8": routeHasNavbar,
              },
            )}
          >
            <div className="mb-6 text-label-large text-on-surface">
              Status
              <RadioGroup
                value={status}
                onChange={(event) => handleStatusChange(event.target.value)}
              >
                {NEEDS_STATUSES.map(({ value, label }) => (
                  <FormControlLabel
                    key={value}
                    value={value}
                    control={
                      <Radio
                        sx={{
                          "&.MuiButtonBase-root.MuiRadio-root": {
                            padding: "6px 6px 6px 0",
                          },
                        }}
                      />
                    }
                    label={
                      <div className="flex items-center justify-between w-full pr-2">
                        <span className="text-body-small">{label}</span>
                        <span className="text-body-small text-on-surface-variant ml-2">
                          ({getStatusCount(value as StatusKey)})
                        </span>
                      </div>
                    }
                    sx={{
                      width: "100%",
                      margin: "0",
                      "& .MuiFormControlLabel-label": {
                        width: "100%",
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

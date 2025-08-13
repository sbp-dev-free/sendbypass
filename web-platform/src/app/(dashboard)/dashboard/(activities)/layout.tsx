"use client";

import { useMemo } from "react";

import Button from "@mui/material/Button";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { Icon, TabList } from "@/components";
import { PRIVATE_ROUTES } from "@/constants";
import { ACTIVITIES_TABS } from "@/constants/activities";

type RouteNames = (typeof ACTIVITIES_TABS)[number]["value"];

export default function ActivitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = useMemo(() => pathname.split("/")[2], [pathname]);
  const currentRoute =
    useMemo(() => pathname.split("/").at(-1), [pathname]) || "";

  const handleNavigate = (routeName: RouteNames) => {
    const route =
      typeof PRIVATE_ROUTES[routeName] === "object"
        ? PRIVATE_ROUTES[routeName].index
        : PRIVATE_ROUTES[routeName];
    router.push(route);
  };

  const showAddButton = useMemo(() => {
    return ["needs", "trips", "shipping", "shopping"].includes(currentRoute);
  }, [currentRoute]);

  return (
    <div>
      <div className="hidden justify-between items-center mb-16 md:flex">
        <TabList
          className="gap-x-4 h-[44px]"
          onChange={(val) => handleNavigate(val as RouteNames)}
        >
          {ACTIVITIES_TABS.map(({ label, value }) => (
            <TabList.Tab
              key={value}
              value={value}
              className={`${activeTab === value ? "bg-secondary-opacity-8 text-secondary hover:bg-secondary-opacity-8 hover:text-secondary" : ""}`}
            >
              {label}
            </TabList.Tab>
          ))}
        </TabList>
        {showAddButton && (
          <Button
            variant="filled"
            className="md:h-[44px]"
            onClick={() => router.push(`${currentRoute}/create`)}
            startIcon={<Icon name="plus" />}
          >
            Add
          </Button>
        )}
      </div>

      {children}
    </div>
  );
}

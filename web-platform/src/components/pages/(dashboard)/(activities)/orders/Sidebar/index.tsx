"use client";

import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { Chip, RoundedTabList, VerticalTabs } from "@/components";
import { ORDERS_STATUS, ORDERS_TYPES } from "@/constants";
import { useDevice } from "@/hooks";
//import { useGetOrdersQuery } from "@/services/orders";

export const OrdersSidebar = () => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  // const { data: orders } = useGetOrdersQuery({
  //   type: searchParams.get("type") || undefined,
  //   active: searchParams.get("active") || undefined,
  // });

  const activeTab = searchParams.get("active") as string;

  const activeType = searchParams.get("type") || "all";

  const setSearchParams = (newParams: URLSearchParams) => {
    replace(`?${newParams.toString()}`, { scroll: false });
  };

  const handleChangeParam = (param: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(param, value);
    setSearchParams(newParams);
  };

  const { isMobile } = useDevice();
  //const redBullet = <div className="size-8 bg-error rounded-full" />;
  return (
    <>
      {isMobile ? (
        <div className="md:hidden">
          <RoundedTabList
            className="mb-16 w-full"
            value={activeTab}
            onChange={(value) => handleChangeParam("active", value)}
          >
            {ORDERS_STATUS.map(({ label, value }) => (
              <RoundedTabList.Tab key={value} value={value}>
                <div className="flex items-center gap-4">{label}</div>
              </RoundedTabList.Tab>
            ))}
          </RoundedTabList>
          <div className="flex justify-between items-center my-12">
            <div className="flex gap-4">
              {ORDERS_TYPES.map(({ value, label }) => (
                <Chip
                  key={value}
                  color={activeType === value ? "active" : "surface"}
                  onClick={() => handleChangeParam("type", value)}
                  label={label}
                  hideIcon
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex w-[204px] relative flex-shrink-0">
          <div className=" sticky top-0 flex-col w-full ">
            <div className="p-12 w-full bg-surface-container-lowest rounded-medium ">
              <VerticalTabs
                value={activeTab}
                onChange={(value) => handleChangeParam("active", value)}
              >
                {ORDERS_STATUS.map(({ label, value, icon }) => (
                  <VerticalTabs.Tab key={value} value={value} icon={icon}>
                    <div className="flex items-center gap-4">{label}</div>
                  </VerticalTabs.Tab>
                ))}
              </VerticalTabs>
            </div>
            <div className="p-12 mt-8 w-full bg-surface-container-lowest rounded-medium">
              <div className="mb-6 text-label-large text-on-surface">
                Type
                <RadioGroup
                  value={activeType}
                  onChange={(event) =>
                    handleChangeParam("type", event.target.value)
                  }
                >
                  {ORDERS_TYPES.map(({ value, label }) => (
                    <FormControlLabel
                      key={value}
                      value={value}
                      control={<Radio />}
                      label={<span className="text-body-small">{label}</span>}
                    />
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

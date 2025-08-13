import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import dayjs from "dayjs";
import Image from "next/image";

import { Dot, Icon } from "@/components";
import { Breadcrumbs } from "@/components/shared";
import { BUSINESS_TYPE } from "@/constants/profile";
import { PROFILE_STATUS } from "@/enums/globals";
import { checkProfileType, cn } from "@/utils";

import { About } from "./Tabs/About";
import { Needs } from "./Tabs/Needs";
import { People } from "./Tabs/People";
import { BusinessProfileTabs } from "./BusinessProfileTabs";
import { businessProfilePageProps } from "./types";

const BusinessProfilePage = ({ profile }: businessProfilePageProps) => {
  const {
    addresses,
    background,
    image,
    email,
    current_location,
    register_time,
    stats,
    name,
    tagline,
    status,
    biz_category,
    type,
    biz_id,
    agent,
  } = profile;

  const address = addresses?.find(
    (item) => item.id.toString() === current_location.toString(),
  );
  const verboseAddress = address
    ? `${address.description} , ${address.city} , ${address.country}`
    : null;
  const rate = stats?.total_successful_orders;
  const isVerified = status === PROFILE_STATUS.VERIFIED;

  const aboutTab = <About profile={profile} />;
  const needsTab = <Needs biz_id={biz_id} />;
  const peopleTab = <People {...agent} />;
  return (
    <>
      <div className="md:max-w-[990px] md:mx-auto">
        <div className="mb-12 ml-4">
          <Breadcrumbs />
        </div>
        <div className="w-full px-0 rounded-large overflow-hidden bg-surface-container-lowest mb-16 md:mb-24">
          <div className="relative h-[115px] md:h-[200px]">
            <Image
              src={background ?? "/images/profile-bg-default.jpeg"}
              alt="profile background"
              width={800}
              height={200}
              className="object-cover w-full h-[115px] md:h-[200px] rounded-large md:rounded-none"
            />
            <Avatar
              sx={{ width: 100, height: 100 }}
              alt={email}
              src={image ?? ""}
              className="border-2 border-outline-variant absolute bottom-[76px] left-24"
            />
          </div>
          <div className="px-12 pb-12 md:px-24 pt-8 md:pt-40 md:pb-24 space-y-8 md:space-y-16">
            <div className="flex flex-col-reverse gap-16 justify-between items-start md:gap-0 md:flex-row">
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <h6 className="text-title-large text-on-surface">{name}</h6>
                  {isVerified && (
                    <Icon
                      name="Check badge 2"
                      className={`text-[24px] ${checkProfileType(type)}`}
                    />
                  )}
                </div>
                {tagline && (
                  <p className="text-label-medium text-on-surface-variant">
                    {tagline}
                  </p>
                )}
                <div className="text-label-medium text-outline items-start flex flex-col md:flex-row  gap-6 md:items-center">
                  <p className="first-letter:uppercase self-start md:whitespace-nowrap">
                    {BUSINESS_TYPE[biz_category!]} Company
                  </p>
                  <Dot className="hidden md:block" />
                  <p className="first-letter:uppercase md:whitespace-nowrap">
                    {verboseAddress}
                  </p>
                  <Dot className="hidden md:block" />
                  <span className="self-start md:whitespace-nowrap">
                    <span className="pr-6">Joined</span>
                    {dayjs(register_time).format("DD MMM , YYYY")}
                  </span>
                </div>
              </div>
              <div className="flex gap-8 items-center self-end md:self-auto">
                {rate === 0 ? (
                  <span className="text-outline-variant text-body-small md:whitespace-nowrap">
                    Not rated
                  </span>
                ) : (
                  <span>
                    <span className="text-on-surface-variant text-label-large">
                      {rate}
                    </span>
                    <span className="text-body-medium text-outline">/5</span>
                  </span>
                )}
                <Rating
                  value={rate ?? undefined}
                  size="small"
                  disabled
                  icon={
                    <Icon
                      name="Star bold"
                      className="text-warning text-[16px]"
                    />
                  }
                  emptyIcon={
                    <Icon
                      name={rate === 0 ? "Star bold" : "Star"}
                      className={cn("text-warning text-[16px]", {
                        "text-outline-variant": rate === 0,
                      })}
                    />
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <BusinessProfileTabs
          tabComponents={{
            about: aboutTab,
            needs: needsTab,
            people: peopleTab,
          }}
        />
      </div>
    </>
  );
};

export default BusinessProfilePage;

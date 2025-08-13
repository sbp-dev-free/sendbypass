"use client";

import { useMemo } from "react";

import { PROFILE_STATUS } from "@/enums/globals";
import { useProfileQuery } from "@/services/profile";

import { BusinessProfile } from "./BusinessProfile";
import { PendingProfileBanner } from "./PendingProfileBanner";
import ProfileFormLoading from "./ProfileFormLoading";
import { UserProfile } from "./UserProfile";

export const Profile = () => {
  const { data: profile, isLoading } = useProfileQuery();
  const isBusinessProfile = useMemo(() => {
    return profile?.type === "BUSINESS";
  }, [profile?.type]);

  return isLoading ? (
    <ProfileFormLoading />
  ) : (
    <>
      {profile?.status === PROFILE_STATUS.PENDING && <PendingProfileBanner />}
      {isBusinessProfile ? <BusinessProfile /> : <UserProfile />}
    </>
  );
};

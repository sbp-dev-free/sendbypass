"use client";
import Avatar from "@mui/material/Avatar";

import { Icon } from "@/components/shared";
import { useProfileQuery } from "@/services/profile";
export const PeopleForm = () => {
  const { data: profile } = useProfileQuery();
  return (
    <>
      <div className="border border-surface-container-high rounded-medium p-16">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-16 ">
            <Avatar
              sx={{ width: 50, height: 50 }}
              className="border-2 border-outline-variant"
              src={profile?.agent?.image || ""}
            />

            <div>
              <div className="flex gap-x-4">
                <div className="text-on-surface text-label-large mb-2">
                  {profile?.agent?.first_name} {profile?.agent?.last_name}
                </div>
                <Icon
                  name="Check badge 2"
                  className="text-[24px] text-informative"
                />
              </div>
              <div className="text-outline text-label-large">Admin</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

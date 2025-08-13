"use client";

import { useToggle } from "usehooks-ts";

import { Modal } from "@/components";
import { TransformedBusinessProfile } from "@/services/profile/types";
import { UserData } from "@/services/types";

import { UserBusinessProfile } from "./BusinessUserProfile";
import { ProfileModalProps, UseUserProfileModalResult } from "./types";
import { UserProfile } from "./UserProfile";

export const useUserProfileModal = ({
  id,
  user,
}: ProfileModalProps): UseUserProfileModalResult => {
  const [isOpen, toggleProfile] = useToggle(false);

  const Profile = (
    <Modal open={isOpen} onClose={toggleProfile}>
      {user?.biz_id ? (
        <UserBusinessProfile
          id={id}
          user={user as TransformedBusinessProfile}
        />
      ) : (
        <UserProfile id={id} user={user as UserData} />
      )}
    </Modal>
  );

  return {
    isOpen,
    toggleProfile,
    UserProfile: Profile,
  };
};

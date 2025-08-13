import { BUSINESS_PROFILE_TABS, PROFILE_TABS } from "@/constants/profile";
import {
  ProfileResponse,
  TransformedBusinessProfile,
} from "@/services/profile/types";

export interface ProfileCompletionTab {
  title: string;
  isComplete: boolean;
  tab:
    | (typeof PROFILE_TABS)[number]["value"]
    | (typeof BUSINESS_PROFILE_TABS)[number]["value"];
}
export const useProfile = (
  profile?: ProfileResponse | TransformedBusinessProfile,
) => {
  let necessaryItems: ProfileCompletionTab[] = [];
  let optionalItems: ProfileCompletionTab[] = [];
  if (profile && "first_name" in profile) {
    necessaryItems = [
      {
        title: "Add First Name",
        isComplete: !!profile?.first_name,
        tab: "personal",
      },
      {
        title: "Add Last Name",
        isComplete: !!profile?.last_name,
        tab: "personal",
      },
      {
        title: "Add Profile Photo",
        isComplete: !!profile?.image,
        tab: "personal",
      },
      {
        title: "Add Mobile Number",
        isComplete: !!profile?.phone_number?.phone,
        tab: "contact",
      },
      {
        title: "Add Address",
        isComplete: !!profile?.addresses?.length,
        tab: "address",
      },
      {
        title: "Add Passport or ID Card (Verification)",
        isComplete:
          profile?.verification?.type === "BASIC" &&
          profile?.verification?.status === "VERIFIED",
        tab: "verification",
      },
    ];
    optionalItems = [
      {
        title: "Add Language You Speak",
        isComplete: !!profile?.speak_languages?.length,
        tab: "personal",
      },
      {
        title: "Add Social Media",
        isComplete: !!profile?.socials.length,
        tab: "contact",
      },
      {
        title: "Add Bio",
        isComplete: !!profile?.bio,
        tab: "personal",
      },
      {
        title: "Add Background Photo",
        isComplete: !!profile?.background,
        tab: "personal",
      },
    ];
  } else if (profile) {
    necessaryItems = [
      {
        title: "Add Business name",
        isComplete: !!profile?.name,
        tab: "basic",
      },
      {
        title: "Add Profile Photo",
        isComplete: !!profile?.image,
        tab: "basic",
      },
      {
        title: "Add Industry",
        isComplete: !!profile?.biz_category,
        tab: "basic",
      },
      {
        title: "Add Year founded",
        isComplete: !!profile?.founded_at,
        tab: "basic",
      },
      {
        title: "Add Languages Spoken",
        isComplete: !!profile?.speak_languages?.length,
        tab: "basic",
      },
      {
        title: "Add Link/ID",
        isComplete: !!profile?.main_link?.link,
        tab: "basic",
      },
      {
        title: "Add Phone number",
        isComplete: !!profile?.phone_number?.phone,
        tab: "basic",
      },
      {
        title: "Add Address",
        isComplete: !!profile?.addresses?.length,
        tab: "address",
      },
    ];
    optionalItems = [
      {
        title: "Add Tagline",
        isComplete: !!profile?.tagline,
        tab: "basic",
      },
      {
        title: "Add Social Media",
        isComplete: !!profile?.socials?.length,
        tab: "contact",
      },
      {
        title: "Add Email",
        isComplete: !!profile?.email,
        tab: "basic",
      },
      {
        title: "Add Overview",
        isComplete: !!profile?.overview,
        tab: "basic",
      },
      {
        title: "Add Background Photo",
        isComplete: !!profile?.background,
        tab: "basic",
      },
      {
        title: "Custom Business ID",
        isComplete: !!profile?.biz_id,
        tab: "basic",
      },
    ];
  }

  const necessaryIsComplete =
    necessaryItems.filter((el) => el.isComplete).length ===
    necessaryItems.length;

  const optionalIsComplete =
    optionalItems.filter((el) => el.isComplete).length === optionalItems.length;

  const necessaryStep = necessaryItems.filter((el) => el.isComplete).length;
  const optionalStep = optionalItems.filter((el) => el.isComplete).length;

  const mainStep = Math.floor((optionalStep + 1 + necessaryStep) / 2);

  let hint = "Complete Your Profile";
  if (necessaryIsComplete) {
    hint = "Improve Your Profile";
  }
  if (necessaryIsComplete && optionalIsComplete) {
    hint = "Profile is complete";
  }
  const mainStatus =
    necessaryIsComplete && optionalIsComplete
      ? ("complete" as const)
      : ("incomplete" as const);

  return {
    necessaryStep,
    optionalStep,
    necessaryIsComplete,
    optionalIsComplete,
    necessaryItems,
    optionalItems,
    hint,
    mainStep,
    mainStatus,
  };
};

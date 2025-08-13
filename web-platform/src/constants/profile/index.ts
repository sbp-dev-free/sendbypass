export const PROFILE_TABS = [
  {
    label: "Personal",
    value: "personal",
  },
  {
    label: "Contact",
    value: "contact",
  },
  {
    label: "Address",
    value: "address",
  },
  {
    label: "Verification",
    value: "verification",
  },
] as const;

export const BUSINESS_PROFILE_TABS = [
  {
    label: "Basic",
    value: "basic",
  },
  {
    label: "Contact",
    value: "contact",
  },
  {
    label: "Address",
    value: "address",
  },
  {
    label: "People",
    value: "people",
  },
  {
    label: "Gift",
    value: "gift",
  },
  {
    label: "Verification",
    value: "verification",
  },
] as const;

export const MORE_MENU_ITEMS = [
  {
    id: 1,
    label: "View Profile",
    icon: "User verify",
  },
  {
    id: 2,
    label: "Switch to Business account",
    icon: "Bag",
  },
  {
    id: 3,
    label: "Set Password",
    icon: "Password lock",
  },
  {
    id: 4,
    label: "Delete Account",
    icon: "Delete",
  },
];

export const SOCIAL_PLATFORMS = [
  {
    label: "Telegram",
    value: "telegram",
    icon: "Telegram Circle",
  },
  {
    label: "WhatsApp",
    value: "whatsapp",
    icon: "Whatsapp",
  },
  {
    label: "Instagram",
    value: "instagram",
    icon: "Instagram",
  },
  {
    label: "Linkedin",
    value: "linkedin",
    icon: "Linkedin Square",
  },
];

export const INDUSTRY_OPTIONS = [
  { label: "Online Retail", value: "on" },
  { label: "Fashion", value: "fa" },
  { label: "Beauty", value: "be" },
  { label: "Home Decor", value: "ho" },
  { label: "Electric", value: "el" },
  { label: "Health", value: "he" },
  { label: "Food", value: "fo" },
  { label: "Pet", value: "pe" },
  { label: "Arts", value: "ar" },
  { label: "Travel", value: "tr" },
  { label: "Gaming", value: "ga" },
  { label: "User", value: "us" },
];

export const STORE_TYPE_OPTIONS = [
  { value: "telegram", label: "Telegram" },
  { value: "instagram", label: "Instagram" },
  { value: "viber", label: "Viber" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "wechat", label: "WeChat" },
  { value: "line", label: "Line" },
  { value: "WEBSITE", label: "Website" },
];

export const BUSINESS_TYPE = {
  on: "online retail",
  fa: "fashion",
  be: "beauty",
  ho: "home Decor",
  el: "electric",
  he: "health",
  fo: "food",
  pe: "pet",
  ar: "arts",
  tr: "travel",
  ga: "gaming",
  us: "user",
} as const;

export const BUSINESS_PROFILE_Info_TABS = [
  {
    label: "About",
    value: "about",
  },
  {
    label: "Needs",
    value: "needs",
  },
  {
    label: "People",
    value: "people",
  },
] as const;

export const GIFT_STATUS = [
  {
    value: "true",
    label: "Active",
    icon: "loading",
  },
  { value: "false", label: "History", icon: "folder file open" },
] as const;

export const KYC_LEVELS = [
  {
    icon: "Diamond-2",
    color: "text-primary",
    bg: "bg-primary-opacity-8",
    level: "Beginner KYC",
    description:
      "This level grants access to the basic features of SendByPass, available for exploration within the application.",
    features_description: "Everything in No KYC level",
    features: [
      {
        "Access to basic features": true,
        "Business Account Upgrade Eligibility": false,
        "Verification badge": false,
      },
    ],
    verify: "",
    kyc_level: "BEGINNER",
  },
  {
    icon: "Pentagon",
    color: "text-warning",
    bg: "bg-warning-opacity-8",
    level: "Basic KYC",
    description:
      "Choosing this level provides access to all features and confers eligibility for a Business Account Upgrade.",
    features_description: "Everything in Basic KYC level",
    features: [
      {
        "Access to all features": true,
        "Business Account Upgrade Eligibility": true,
        "Verification badge": false,
      },
    ],
    verify: "Local ID Check",
    kyc_level: "BASIC",
  },
  {
    icon: "Polygon",
    color: "text-secondary",
    bg: "bg-secondary-opacity-8",
    level: "Advanced KYC",
    description:
      "This level provides access to all advanced features, a verification badge, and eligibility for a Business Account Upgrade, fostering greater trust among other users.",
    features_description: "Everything in Advanced KYC level",
    features: [
      {
        "Access to all advanced features": true,
        "Business Account Upgrade Eligibility": true,
        "Verification badge": true,
      },
    ],
    verify: "Verified by Onfido",
    kyc_level: "ADVANCED",
  },
];

const DASHBOARD = "/dashboard";
const CONNECT_HUB = "/connect-hub";

export const ROUTES = {
  home: "/",
  connectHub: {
    requestToPassengers: `${CONNECT_HUB}/request-to-passengers`,
    startToShop: `${CONNECT_HUB}/start-to-shop`,
    startToShip: `${CONNECT_HUB}/start-to-ship`,
  },
  termsOfService: "/terms-of-service",
  privacyPolicy: "/privacy-policy",
  security: "/security",
  faq: "/faq",
  contactUs: "/contact-us",
  aboutUs: "/about-us",
  legalConsiderations: "/legal-considerations",
  blog: "/blog",
  whatsNew: "https://sendbypass.featurebase.app/changelog",
  roadmap: "https://sendbypass.featurebase.app/roadmap",
  feedBack: "https://sendbypass.featurebase.app/",
  kycLevel: "/kyc-levels",
};

export const PRIVATE_ROUTES = {
  dashboard: DASHBOARD,
  trips: {
    index: `${DASHBOARD}/trips`,
    create: `${DASHBOARD}/trips/create`,
  },
  profile: `${DASHBOARD}/profile`,
  referral: `${DASHBOARD}/referral`,
  needs: {
    index: `${DASHBOARD}/needs/shipping`,
    create: `${DASHBOARD}/needs/shipping/create`,
    shipping: {
      index: `${DASHBOARD}/needs/shipping`,
      create: `${DASHBOARD}/needs/shipping/create`,
    },
    shopping: {
      index: `${DASHBOARD}/needs/shopping`,
      create: `${DASHBOARD}/needs/shopping/create`,
    },
  },
  requests: `${DASHBOARD}/requests`,
  orders: `${DASHBOARD}/orders`,
  deleteAccount: `${DASHBOARD}/delete-account`,
  switchToBusinessAccount: `${DASHBOARD}/switch-to-business-account`,
};

export const AUTH_ROUTES = {
  signin: "/sign-in",
  signinEmail: "/sign-in-with-email",
  signup: "/sign-up",
  signupEmail: "/sign-up-with-email",
  resetPassword: "/reset-password",
  successfullEmailSent: "/successfull-email-sent",
  successfullResetPassword: "/successfull-reset-password",
  setNewPassword: "/set-new-password",
  confirmNewPassword: "/confirm-new-password",
  welcome: "/welcome",
  readyToUse: "/ready-to-use",
  checkAuth: "/check-auth",
};

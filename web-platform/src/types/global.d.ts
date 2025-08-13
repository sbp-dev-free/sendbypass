/* eslint-disable no-unused-vars */
export {};

declare global {
  interface Window {
    gtag?: (...args: [string, string, Record<string, unknown>?]) => void;
    clarity?: (
      action?: string,
      value?: string | boolean,
      options?: Record<string, unknown>,
    ) => void;

    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}
declare module "notistack" {
  interface VariantOverrides {
    warning: false;
    success: { hasClose?: boolean; longerAction?: boolean };
    error: { hasClose?: boolean; longerAction?: boolean };
  }
}
type grantType = "granted" | "denied";

export interface ClientConsentConsent {
  ad_user_data: grantType;
  ad_personalization: grantType;
  ad_storage: grantType;
  analytics_storage: grantType;
  functionality_storage: grantType;
}

export interface ClientConsent {
  marketing: grantType;
  analytics: grantType;
  functional: grantType;
  essentials?: "granted";
}

export type ConsentType = keyof Consent;

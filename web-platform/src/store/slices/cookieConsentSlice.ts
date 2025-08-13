import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ClientConsent {
  marketing: "granted" | "denied";
  analytics: "granted" | "denied";
  functional: "granted" | "denied";
  essentials: "granted";
}

interface CookieConsentState {
  consent: ClientConsent;
  isConsentAsked: boolean;
  customCookiesSelected: boolean;
}

const defaultConsent: ClientConsent = {
  marketing: "denied",
  analytics: "denied",
  functional: "denied",
  essentials: "granted",
};

const initialState: CookieConsentState = {
  consent: defaultConsent,
  isConsentAsked: true,
  customCookiesSelected: false,
};

const cookieConsentSlice = createSlice({
  name: "cookieConsent",
  initialState,
  reducers: {
    setConsent: (state, action: PayloadAction<Partial<ClientConsent>>) => {
      state.consent = { ...state.consent, ...action.payload };
    },
    setIsConsentAsked: (state, action: PayloadAction<boolean>) => {
      state.isConsentAsked = action.payload;
    },
    setCustomCookiesSelected: (state, action: PayloadAction<boolean>) => {
      state.customCookiesSelected = action.payload;
    },
    acceptAllConsents: (state) => {
      state.consent = {
        marketing: "granted",
        analytics: "granted",
        functional: "granted",
        essentials: "granted",
      };
    },
    denyAllConsents: (state) => {
      state.consent = {
        marketing: "denied",
        analytics: "denied",
        functional: "denied",
        essentials: "granted",
      };
    },
  },
});

export const {
  setConsent,
  setIsConsentAsked,
  setCustomCookiesSelected,
  acceptAllConsents,
  denyAllConsents,
} = cookieConsentSlice.actions;

export default cookieConsentSlice.reducer;

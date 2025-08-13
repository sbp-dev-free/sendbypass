import { useCallback, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store";
import {
  acceptAllConsents,
  denyAllConsents,
  setConsent,
  setCustomCookiesSelected,
  setIsConsentAsked,
} from "@/store/slices/cookieConsentSlice";
import { ClientConsent } from "@/types";

export const useConsentManager = () => {
  const dispatch = useDispatch();
  const { consent, isConsentAsked } = useSelector(
    (state: RootState) => state.cookieConsent,
  );

  const commitConsent = useCallback(
    (updatedConsents: typeof consent) => {
      const newConsents = updatedConsents || {
        marketing: "granted",
        analytics: "granted",
        functional: "granted",
        essentials: "granted",
      };
      dispatch(setConsent(newConsents));
      const event = new CustomEvent("consentsChange", {
        detail: newConsents,
      });
      localStorage.setItem("clientConsent", JSON.stringify(newConsents));
      dispatch(setIsConsentAsked(true));
      dispatch(setCustomCookiesSelected(false));
      window.dispatchEvent(event);
    },
    [dispatch],
  );

  const acceptAll = useCallback(() => {
    dispatch(acceptAllConsents());
    commitConsent({
      marketing: "granted",
      analytics: "granted",
      functional: "granted",
      essentials: "granted",
    });
  }, [dispatch]);

  const deny = useCallback(() => {
    dispatch(denyAllConsents());

    commitConsent({
      marketing: "denied",
      analytics: "denied",
      functional: "denied",
      essentials: "granted",
    });
  }, [dispatch]);

  const mapConsentToGtag = (consent: ClientConsent) => ({
    ad_user_data: consent.marketing === "granted" ? "granted" : "denied",
    ad_personalization: consent.marketing === "granted" ? "granted" : "denied",
    ad_storage: consent.marketing === "granted" ? "granted" : "denied",
    analytics_storage: consent.analytics === "granted" ? "granted" : "denied",
    functionality_storage:
      consent.functional === "granted" ? "granted" : "denied",
  });

  useEffect(() => {
    const updateExternalServices = (newConsent: ClientConsent) => {
      if (window.gtag) {
        const gtagConsent = mapConsentToGtag(newConsent);
        window.gtag("consent", "update", gtagConsent);
      }

      if (window.clarity) {
        if (newConsent.marketing === "granted") {
          window.clarity("consent");
        } else {
          window.clarity("consent", false);
        }
      }
    };

    const handleConsentEvent = (event: Event) => {
      const { detail } = event as CustomEvent<typeof consent>;
      updateExternalServices(detail);
    };

    window.addEventListener("consentsChange", handleConsentEvent);

    return () => {
      window.removeEventListener("consentsChange", handleConsentEvent);
    };
  }, []);

  return {
    consent,
    commitConsent,
    isConsentAsked,
    acceptAll,
    deny,
  };
};

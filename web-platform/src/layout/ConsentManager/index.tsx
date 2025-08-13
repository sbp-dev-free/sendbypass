"use client";

import { useEffect } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import { Modal } from "@/components";
import { getConfigs } from "@/configs";
import { useConsentManager } from "@/hooks";
import { RootState } from "@/store";
import {
  setConsent,
  setCustomCookiesSelected,
  setIsConsentAsked,
} from "@/store/slices/cookieConsentSlice";
import { cn } from "@/utils";
export const ConsentManager = () => {
  const { acceptAll, deny, commitConsent } = useConsentManager();
  const isApp = getConfigs().isApp;

  const { consent, isConsentAsked, customCookiesSelected } = useSelector(
    (state: RootState) => state.cookieConsent,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const persist = JSON.parse(localStorage.getItem("clientConsent") || "{}");

    if (!!Object.keys(persist).length || isApp) return commitConsent(persist);

    const timeoutId = setTimeout(() => {
      if (!Object.keys(persist).length) {
        dispatch(setIsConsentAsked(false));
      }
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, []);
  return (
    <>
      <Modal
        open={!isConsentAsked && !customCookiesSelected}
        disableAutoFocus
        disableScrollLock
        disablePortal
        hideBackdrop
        PaperProps={{
          sx: {
            width: "474px",
            position: "fixed",
            bottom: 0,
            left: 0,
          },
        }}
      >
        <Box className="p-12 md:p-24 h-full flex flex-col gap-16">
          <p className="text-body-medium">
            By clicking “Accept Cookies”, you agree to the storing of cookies on
            your device to enhance site navigation, analyze site usage, and
            assist in our marketing efforts. View our Cookie Policy for more
            information.
          </p>
          <Box
            gap={1}
            className="flex flex-col md:flex-row md:justify-end mt-auto"
          >
            <Button
              variant="tonal"
              onClick={() => dispatch(setCustomCookiesSelected(true))}
              className="w-full md:w-auto"
            >
              Cookie Settings{" "}
            </Button>
            <Button
              variant="filled"
              onClick={acceptAll}
              className="w-full md:w-auto"
            >
              Accept Cookies{" "}
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={customCookiesSelected}
        onClose={
          isConsentAsked
            ? () => dispatch(setCustomCookiesSelected(false))
            : undefined
        }
        PaperProps={{
          sx: { width: "604px" },
        }}
      >
        <Box className="p-12 md:p-24 h-full flex flex-col space-y-24">
          <span className="text-title-large font-semibold text-center">
            Cookie Settings
          </span>
          <Box className="rounded-large border border-surface-container-high w-full">
            {Object.entries(consent).map(([key, value], index, array) => (
              <Box
                key={key}
                component={"label"}
                htmlFor={key}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                className={cn("px-16 py-6", {
                  "border-surface-container-high border-b":
                    index !== array.length - 1,
                  "cursor-pointer": key !== "essentials",
                })}
              >
                <span className="text-label-large capitalize">{key}</span>
                <Switch
                  id={key}
                  checked={value === "granted"}
                  disabled={key === "essentials"}
                  onChange={(e) => {
                    dispatch(
                      setConsent({
                        [key]: e.target.checked ? "granted" : "denied",
                      }),
                    );
                  }}
                />
              </Box>
            ))}
          </Box>
          <span className="text-body-small text-neutral-50 ml-8 mt-auto">
            Please Read how we handle your data in our{" "}
            <Link
              className="underline"
              href={"/privacy-policy"}
              onClick={() => dispatch(setCustomCookiesSelected(false))}
            >
              Privacy Policy{" "}
            </Link>
          </span>
          <Box className="flex w-full md:flex-row flex-col gap-8">
            <Button variant="tonal" onClick={deny} className="w-full md:w-auto">
              Deny{" "}
            </Button>
            <Button
              variant="tonal"
              onClick={acceptAll}
              sx={{ ml: "auto" }}
              className="w-full md:w-auto"
            >
              Accept all{" "}
            </Button>
            <Button
              variant="filled"
              className="w-full md:w-auto"
              onClick={() => {
                commitConsent(consent);
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

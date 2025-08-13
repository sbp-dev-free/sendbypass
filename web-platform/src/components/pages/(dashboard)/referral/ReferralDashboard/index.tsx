"use client";

import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import { enqueueSnackbar } from "notistack";

import { Icon } from "@/components/shared";
import { useGetReferralsQuery } from "@/services/referrals";
import { DEFAULT_CURRENCY } from "@/utils";

import { SocialIcons } from "../SocialIcons";
export const ReferralDashboard = () => {
  const { data: referralsData, isLoading } = useGetReferralsQuery();
  const num_registers = referralsData?.stats?.num_registers || 0;
  const num_trips = referralsData?.stats?.num_trips || 0;
  const num_needs = referralsData?.stats?.num_needs || 0;
  const num_orders = referralsData?.stats?.num_orders || 0;
  const reward = referralsData?.reward || 0;
  const code = referralsData?.code || "0";
  const referralLink = `${process.env.NEXT_PUBLIC_LOCALHOST_API_URL}/sign-up?redirect=/?&referral=${code}`;
  const qrcode = referralsData?.qrcode || "";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        enqueueSnackbar("Copied to clipboard!", {
          variant: "success",
          autoHideDuration: 10000,
        });
      },
      (err) => {
        console.log("err:", err);
        enqueueSnackbar("Failed to copy", {
          variant: "error",
          autoHideDuration: 10000,
        });
      },
    );
  };

  return (
    <>
      <div className="bg-surface-container-lowest rounded-large p-16 mb-16 md:p-0">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-1 md:p-16">
            <div
              className="flex flex-row justify-between items-center md:flex-col md:items-start
             pb-16 md:pb-0 md:gap-y-12 md:border-r md:border-surface-container-low"
            >
              <div className="md:order-2">
                <div className="text-on-surface text-label-large">
                  Successful Sign-ups
                </div>
                <div className="text-body-small text-on-surface-variant">
                  Users who successfully registered.
                </div>
              </div>
              <div className="text-title-large text-primary md:order-1">
                {isLoading ? <CircularProgress size="16px" /> : num_registers}
              </div>
            </div>
            <div className="border-b border-surface-container-low mx-8 md:hidden"></div>
          </div>

          <div className="col-span-1 md:p-16 md:pl-0">
            <div className="flex flex-row justify-between items-center md:flex-col py-16 md:py-0 md:items-start md:gap-y-12 md:border-r md:border-surface-container-low">
              <div className="md:order-2">
                <div className="text-on-surface text-label-large">
                  Added Trip
                </div>
                <div className="text-body-small text-on-surface-variant">
                  Trips added by users.
                </div>
              </div>
              <div className="text-title-large text-primary md:order-1">
                {isLoading ? <CircularProgress size="16px" /> : num_trips}
              </div>
            </div>
            <div className="border-b border-surface-container-low mx-8 md:hidden"></div>
          </div>

          <div className="col-span-1 md:p-16 md:pl-0">
            <div className="flex flex-row justify-between items-center md:flex-col py-16 md:py-0 md:items-start md:gap-y-12 md:border-r md:border-surface-container-low">
              <div className="md:order-2">
                <div className="text-on-surface text-label-large">
                  Added Need
                </div>
                <div className="text-body-small text-on-surface-variant">
                  Needs added by users.
                </div>
              </div>
              <div
                className="text-title-large text-primary md:
              order-1"
              >
                {isLoading ? <CircularProgress size="16px" /> : num_needs}
              </div>
            </div>
            <div className="border-b border-surface-container-low mx-8 md:hidden"></div>
          </div>

          <div className="col-span-1 md:p-16 md:pl-0">
            <div className="flex flex-row justify-between items-center md:flex-col py-16 md:py-0 md:items-start md:gap-y-12 md:border-r md:border-surface-container-low">
              <div className="md:order-2">
                <div className="text-on-surface text-label-large">
                  Successful orders
                </div>
                <div className="text-body-small text-on-surface-variant whitespace-nowrap">
                  Users who successfully executed orders
                </div>
              </div>
              <div className="text-title-large text-primary md:order-1">
                {isLoading ? <CircularProgress size="16px" /> : num_orders}
              </div>
            </div>
            <div className="border-b border-surface-container-low mx-8 md:hidden"></div>
          </div>

          <div className="col-span-1 md:p-16 md:pl-0">
            <div className="flex flex-row justify-between items-center md:flex-col py-16 md:py-0 md:items-start md:gap-y-12">
              <div className="md:order-2">
                <div className="text-on-surface text-label-large">
                  Total Rewards Earned
                </div>
                <div className="text-body-small text-on-surface-variant">
                  Value of rewards you&apos;ve received.
                </div>
              </div>
              <div className="text-title-large text-secondary md:order-1">
                {DEFAULT_CURRENCY.symbol}
                {isLoading ? <CircularProgress size="16px" /> : reward}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-16">
        <div className="col-span-1 md:col-span-4 bg-surface-container-lowest rounded-large p-16">
          <div className="px-16 mb-32 md:mb-0">
            <div className="text-on-surface text-title-medium">
              Your Unique Referral Link/Code
            </div>
            <div className="text-on-surface-variant text-body-small">
              Share this link with your friends. When they sign up, you get
              rewarded!
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end md:h-[215px]">
            <div>
              <div className="bg-surface-container-low rounded-full px-20 py-8 mb-8">
                <div className="flex justify-between h-40 items-center gap-16">
                  <div className="flex items-center gap-16">
                    <div className="text-outline text-label-large">Code</div>
                    <div className="text-body-medium text-on-surface">
                      {isLoading ? <CircularProgress size="18px" /> : code}
                    </div>
                  </div>
                  <Icon
                    name="copy"
                    className="text-primary text-[24px] cursor-pointer"
                    onClick={() => handleCopy(code || "")}
                  />
                </div>
              </div>
              <div className="bg-surface-container-low rounded-full px-20 py-8 mb-8">
                <div className="flex h-40 items-center gap-16">
                  <div className="flex items-center gap-16 max-w-[85%] md:max-w-[92%]">
                    <div className="text-outline text-label-large">Link</div>
                    <div className="text-body-medium text-on-surface truncate ">
                      {referralLink}
                    </div>
                  </div>
                  <Icon
                    name="copy"
                    className="text-primary text-[24px] cursor-pointer"
                    onClick={() => handleCopy(referralLink || "")}
                  />
                </div>
              </div>
              <SocialIcons referralLink={referralLink} />
            </div>
            <div className="border border-surface-container-highest rounded-large  p-12 mx-auto md:mr-0 flex flex-col justify-between items-center">
              {isLoading ? (
                <div className="w-[140px] h-[140px] flex justify-center items-center">
                  <CircularProgress />
                </div>
              ) : (
                <Image
                  src={qrcode}
                  width={140}
                  height={140}
                  alt="Referral QR code"
                  loading="lazy"
                />
              )}
              {/* <Button variant="tonal" endIcon={<Icon name="down line" />}>
                Download
              </Button> */}
            </div>
          </div>
        </div>
        <div className="col-span-1 md:col-span-2 bg-surface-container-lowest rounded-large pt-16 px-16 pb-24">
          <div className="mb-16">
            <div className="text-on-surface text-title-medium">
              How it Works
            </div>
            <div className="text-body-small text-on-surface-variant">
              Invite friends, earn rewards! Three steps, direct benefits from
              their activity.
            </div>
          </div>
          <div className="flex flex-col gap-y-24">
            <div className="flex gap-12">
              <div className="text-label-large w-40 h-40 rounded-full text-primary flex items-center justify-center bg-primary-opacity-8">
                1
              </div>
              <div>
                <div className="text-label-large text-on-surface">
                  Send invitation and user registration
                </div>
                <div className="text-on-surface-variant text-body-small">
                  Send the code or link to your friend to register.
                </div>
              </div>
            </div>
            <div className="flex gap-12">
              <div className="text-label-large w-40 h-40 rounded-full text-primary flex items-center justify-center bg-primary-opacity-8 flex-shrink-0">
                2
              </div>
              <div>
                <div className="text-label-large text-on-surface">
                  User activity
                </div>
                <div className="text-on-surface-variant text-body-small">
                  User must verify, add Trip or Need, and Order must be
                  successfully completed.
                </div>
              </div>
            </div>
            <div className="flex gap-12">
              <div className="text-label-large w-40 h-40 rounded-full text-primary flex items-center justify-center bg-primary-opacity-8">
                3
              </div>
              <div>
                <div className="text-label-large text-on-surface">
                  Earn Rewards
                </div>
                <div className="text-on-surface-variant text-body-small">
                  You receive rewards for each successful order.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

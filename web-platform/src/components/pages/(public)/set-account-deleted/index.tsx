"use client";
import { Suspense, useEffect, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import { useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";

import { CheckBadge } from "@/components/icons";
import { useResetPasswordMutation } from "@/services/auth";
function AccountDeletionHandler() {
  const searchParams = useSearchParams();
  const [isManualLoading, setIsManualLoading] = useState(true);
  const token = searchParams.get("token");
  const user = searchParams.get("user");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  useEffect(() => {
    const resetPasswordAsync = async () => {
      if (!token || !user) {
        enqueueSnackbar("Missing required parameters", {
          variant: "error",
        });
        return;
      }
      try {
        await resetPassword({ type: "DELETE_ACCOUNT", token, user }).unwrap();
        setIsManualLoading(false);
      } catch (error: any) {
        if (error?.status === 400) {
          enqueueSnackbar(
            "Invalid or expired deletion link. Please request a new account deletion.",
            {
              variant: "error",
            },
          );
        } else {
          setIsManualLoading(false);
        }
      }
    };

    resetPasswordAsync();
  }, [token, user, resetPassword]);
  return (
    <div className="p-24 bg-surface-container-lowest rounded-medium md:w-[900px] md:mx-auto">
      {isLoading || isManualLoading ? (
        <div className="flex items-center justify-center  h-[320px] md:h-[212px]">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="mb-16">
            <div className="mx-auto w-fit">
              <CheckBadge />
            </div>
            <div className="text-center text-title-large text-on-surface">
              Account Successfully Deleted!
            </div>
            <div className="text-body-medium text-on-surface-variant text-center">
              Your account and all associated personal data have been
              permanently deleted from our systems. This action is irreversible.
            </div>
          </div>
          <div className="bg-informative-opacity-8 text-informative p-16 rounded-small text-body-medium text-center w-fit mx-auto">
            We appreciate you using our service. If you ever wish to return, you
            are welcome to create a new account.
          </div>
        </>
      )}
    </div>
  );
}
export const SetAccountDeleted = () => {
  return (
    <Suspense
      fallback={
        <div className="p-24 bg-surface-container-lowest rounded-medium md:w-[900px] md:mx-auto">
          <div className="flex items-center justify-center h-[320px] md:h-[212px]">
            <CircularProgress />
          </div>
        </div>
      }
    >
      <AccountDeletionHandler />
    </Suspense>
  );
};

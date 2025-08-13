import { useEffect, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";

import { CheckBadge } from "@/components/icons";
import { Modal } from "@/components/shared";
import { useSendEmailMutation, useStoreEmailMutation } from "@/services/auth";

import { SetPasswordProps } from "./types";

export const SetPassword = ({ open, onClose, email }: SetPasswordProps) => {
  const [setEmail, { isLoading: isValidatingEmail }] = useStoreEmailMutation();
  const [sendEmail, { isLoading: isSendingEmail }] = useSendEmailMutation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sendResetEmail = async () => {
      if (!open) return;

      try {
        await setEmail({ email }).unwrap();
        await sendEmail({
          email,
          redirect: "dashboard/profile",
          type: "RESET_PASSWORD",
        }).unwrap();

        setIsSuccess(true);
        setError(null);
      } catch (error) {
        console.error("Failed to send email:", error);
        setError("Failed to send email. Please try again.");
        setIsSuccess(false);
      }
    };

    sendResetEmail();
  }, [open, email, setEmail, sendEmail]);

  const isLoading = isValidatingEmail || isSendingEmail;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full md:w-[320px] lg:w-[400px] h-full flex flex-col gap-y-24 py-40">
        <div className="flex flex-col flex-1 items-center text-center grow">
          {isLoading ? (
            <div className="text-body-medium text-on-surface-variant">
              <CircularProgress />
            </div>
          ) : error ? (
            <div className="text-body-medium text-error">{error}</div>
          ) : isSuccess ? (
            <>
              <CheckBadge />
              <h5 className="text-title-large text-on-surface">Success!</h5>
              <div className="mt-8 space-y-16">
                <div>
                  <h6 className="text-title-medium text-on-surface">
                    Check your email
                  </h6>
                  <span className="text-body-medium text-on-surface-variant">
                    We&apos;ve sent a temporary link.
                  </span>
                </div>
                <div>
                  <span className="text-body-medium text-on-surface-variant">
                    Please check your inbox at
                  </span>
                  <h6 className="text-label-large-prominent text-on-surface">
                    {email}
                  </h6>
                </div>
              </div>
            </>
          ) : null}
        </div>
        {isSuccess && (
          <div className="mx-auto text-body-small text-outline">
            If you haven&apos;t gotten the email yet;
            <div>
              take a look in your
              <span className="text-label-medium-prominent">spam/junk</span>
              folder.
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

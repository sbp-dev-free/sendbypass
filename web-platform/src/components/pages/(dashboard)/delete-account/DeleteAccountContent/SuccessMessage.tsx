import Link from "next/link";

import { CheckBadge } from "@/components/icons";

export const SuccessMessage = () => {
  return (
    <div>
      <div className="mx-auto">
        <div className="mx-auto w-fit">
          <CheckBadge />
        </div>
        <div className="text-on-surface text-title-medium text-center">
          Your account deletion request has been successfully submitted.
        </div>
      </div>
      <div className="p-16 bg-informative-opacity-8 rounded-small my-16">
        <div className="text-title-medium text-informative pb-16">
          What Happens Next?
        </div>

        <ul className="pl-4 md:pl-8">
          <li className="text-body-medium text-informative flex items-start md:items-center gap-8 mb-2">
            <span className="flex-shrink-0 inline-block rounded-full size-4 bg-informative my-8 md:my-0"></span>
            <div>
              <strong>Check Your Email:</strong>
              We have sent a confirmation email to the address you provided.
              This email may contain further instructions or a link to verify
              your request. Please check your inbox and spam folder.
            </div>
          </li>
          <li className="text-body-medium text-informative flex items-start md:items-center gap-8 mb-2">
            <span className="flex-shrink-0 inline-block rounded-full size-4 bg-informative my-8 md:my-0"></span>
            <div>
              <strong>Processing Time:</strong>
              Account deletion requests are typically processed within [X]
              business days. During this period, your account may remain
              accessible.
            </div>
          </li>
          <li className="text-body-medium text-informative flex items-start md:items-center gap-8 mb-2">
            <span className="flex-shrink-0 inline-block rounded-full size-4 bg-informative my-8 md:my-0"></span>
            <div>
              <strong>Data Deletion:</strong>Once your request is processed, all
              personal data associated with your account will be permanently
              deleted from our systems. This action is irreversible.
            </div>
          </li>
          <li className="text-body-medium text-informative flex items-start md:items-center gap-8 mb-2">
            <span className="flex-shrink-0 inline-block rounded-full size-4 bg-informative my-8 md:my-0"></span>
            <div>
              <strong>Exceptions:</strong>
              Please note that certain data may be retained for legitimate
              reasons such as security, fraud prevention, or regulatory
              compliance, as outlined in our Privacy Policy.
            </div>
          </li>
        </ul>
      </div>
      <div className="text-on-surface text-body-medium text-center">
        If you have any questions or did not receive the confirmation email,
        please visit our{" "}
        <Link href="/contact-us" className="underline underline-offset-1">
          contact us
        </Link>{" "}
        directly.
      </div>
    </div>
  );
};

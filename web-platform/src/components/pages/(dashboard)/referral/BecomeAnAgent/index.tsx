import Button from "@mui/material/Button";
import Link from "next/link";

export const BecomeAnAgent = () => {
  return (
    <div className="p-16 bg-warning-opacity-8 rounded-medium my-16 md:py-20 md:px-24">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <div className="text-on-surface text-title-medium mb-4 text-center md:text-start">
            Become an Agent
          </div>
          <div className="text-body-small text-on-surface-variant text-center mb-16 md:mb-0">
            If you believe you can generate a significant number of referrals,
            it&apos;s advisable to contact us to become an agent.
          </div>
        </div>
        <Link href="/contact-us">
          <Button variant="filled" className="w-full md:w-auto">
            Contact us
          </Button>
        </Link>
      </div>
    </div>
  );
};

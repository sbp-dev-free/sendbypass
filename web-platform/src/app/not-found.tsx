import Button from "@mui/material/Button";
import Link from "next/link";

import PublicPagesLayout from "./(public)/layout";

export default function NotFound() {
  return (
    <PublicPagesLayout>
      <div className="p-24 bg-surface-container-lowest rounded-medium md:p-40">
        <div className="flex justify-center items-center flex-col md:h-[470px]">
          <h1 className="text-on-surface text-display-large">404</h1>

          <div>
            <div className="my-24">
              <h2 className="text-center text-on-surface text-title-large">
                Oops! Looks like we missed the destination.
              </h2>
              <p className="mt-4 text-center text-on-surface-variant text-body-medium">
                The page you&#39;re looking for seems to have taken a wrong turn
                on its global journey.
              </p>
            </div>

            <div className="flex flex-col gap-12 justify-center md:flex-row">
              <Link href="/">
                <Button className="w-full md:w-auto" variant="tonal">
                  Return Home
                </Button>
              </Link>

              <Link href="/connect-hub/request-to-passengers">
                <Button variant="filled" className="w-full md:w-auto">
                  Connect hub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicPagesLayout>
  );
}

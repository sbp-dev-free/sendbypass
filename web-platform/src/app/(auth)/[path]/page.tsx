"use client";

import { ReactNode } from "react";

import { notFound, usePathname, useSearchParams } from "next/navigation";

import PublicPagesLayout from "@/app/(dashboard)/layout";
import ConnectHubLayout from "@/app/(public)/connect-hub/layout";
import RequestToPassengers from "@/app/(public)/connect-hub/request-to-passengers/page";
import StartToShipPage from "@/app/(public)/connect-hub/start-to-ship/page";
import StartToShopPage from "@/app/(public)/connect-hub/start-to-shop/page";
import {
  AboutUs,
  ContactUs,
  FAQ,
  Home,
  LegalGonsiderations,
  PrivacyPolicy,
  Profile,
  Security,
  TermsOfService,
} from "@/components/pages";

const pathToComponentMap: Record<string, ReactNode> = {
  "connect-hub/request-to-passengers": <RequestToPassengers />,
  "connect-hub/start-to-shop": <StartToShopPage />,
  "connect-hub/start-to-ship": <StartToShipPage />,
  security: <Security />,
  faq: <FAQ />,
  "about-us": <AboutUs />,
  "contact-us": <ContactUs />,
  "terms-of-service": <TermsOfService />,
  "dashboard/profile": <Profile />,
  "privacy-policy": <PrivacyPolicy />,
  "": <Home />,
  "legal-considerations": <LegalGonsiderations />,
};

export default function AuthPages() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const deepLinkPath = searchParams.get("source");
  if (deepLinkPath && typeof window !== "undefined") {
    window.localStorage.setItem("deepLinkPath", deepLinkPath);
  }

  let redirectPath = searchParams.get("redirect");

  if (redirectPath) {
    redirectPath = decodeURIComponent(redirectPath);

    if (typeof window !== "undefined") {
      const url = new URL(redirectPath, window.location.origin);
      redirectPath = url.pathname.replace(/^\//, "");
    }
  } else {
    redirectPath = pathname.replace(/^\//, "");
  }

  const Component = pathToComponentMap[redirectPath];

  if (!Component) {
    notFound();
  }
  if (!redirectPath) return Component;

  if (redirectPath.startsWith("connect-hub/")) {
    return (
      <PublicPagesLayout>
        <ConnectHubLayout>{Component}</ConnectHubLayout>
      </PublicPagesLayout>
    );
  }

  return <PublicPagesLayout>{Component}</PublicPagesLayout>;
}

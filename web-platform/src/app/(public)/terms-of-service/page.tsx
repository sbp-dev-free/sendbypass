import type { Metadata } from "next";

import { TermsOfService } from "@/components/pages";

export const metadata: Metadata = {
  title: "Sendbypass | Terms of Service",
};

export default function TermsOfServicePage() {
  return <TermsOfService />;
}

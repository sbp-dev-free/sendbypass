import type { Metadata } from "next";

import { PrivacyPolicy } from "@/components/pages";

export const metadata: Metadata = {
  title: "Sendbypass | Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}

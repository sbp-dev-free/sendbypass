import type { Metadata } from "next";

import { LegalGonsiderations } from "@/components/pages";

export const metadata: Metadata = {
  title: "Sendbypass | Legal Considerations",
};

export default function PrivacyPolicyPage() {
  return <LegalGonsiderations />;
}

import type { Metadata } from "next";

import { Security } from "@/components/pages";

export const metadata: Metadata = {
  title: "Sendbypass | Security",
};

export default function SecurityPage() {
  return <Security />;
}

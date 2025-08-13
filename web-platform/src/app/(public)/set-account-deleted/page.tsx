import type { Metadata } from "next";

import { SetAccountDeleted } from "@/components/pages";

export const metadata: Metadata = {
  title: "Sendbypass | Account Deleted",
};
export default function SetAccountDeletedPage() {
  return <SetAccountDeleted />;
}

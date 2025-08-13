import { Metadata } from "next";

import { DeleteAccount } from "@/components/pages";
export const metadata: Metadata = {
  title: "Sendbypass | Account Deletion",
};
export default function DeleteAccountPage() {
  return <DeleteAccount />;
}

import type { Metadata } from "next";

import { ContactUs } from "@/components/pages/";

export const metadata: Metadata = {
  title: "Sendbypass | Contact Us",
};

export default function ContactUsPage() {
  return <ContactUs />;
}

import type { Metadata } from "next";

import { AboutUs } from "@/components/pages";

export const metadata: Metadata = {
  title: "Sendbypass | About Us",
};

export default function AboutUsPage() {
  return <AboutUs />;
}

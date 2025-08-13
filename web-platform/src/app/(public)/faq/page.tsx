import type { Metadata } from "next";

import { FAQ } from "@/components/pages";

export const metadata: Metadata = {
  title: "Sendbypass | FAQ",
};

export default async function FAQPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category } = await searchParams;

  return <FAQ category={category as string} />;
}

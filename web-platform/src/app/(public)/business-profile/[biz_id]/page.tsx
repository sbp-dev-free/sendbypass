import { NextPage } from "next";
import { notFound } from "next/navigation";

import BusinessProfilePage from "@/components/pages/(public)/business-profile";
import { getConfigs } from "@/configs";
import { TransformedBusinessProfile } from "@/services/profile/types";

async function getAccountData(
  biz_id: string,
): Promise<TransformedBusinessProfile> {
  const res = await fetch(`${getConfigs().baseUrl}/businesses/${biz_id}`);
  const data = (await res.json()) as TransformedBusinessProfile;
  return data;
}

const AccountPage: NextPage<any> = async ({ params }) => {
  const { biz_id } = await params;
  let accountData;

  try {
    accountData = await getAccountData(biz_id);
  } catch (error) {
    notFound();
  }

  if (!accountData || accountData.detail) {
    return notFound();
  }

  return <BusinessProfilePage profile={accountData} />;
};

export default AccountPage;

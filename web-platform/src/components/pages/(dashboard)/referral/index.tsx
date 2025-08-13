import { BecomeAnAgent } from "./BecomeAnAgent";
import { FAQ } from "./FAQ";
import { Header } from "./Header";
import { ReferralDashboard } from "./ReferralDashboard";

export const Referral = () => {
  return (
    <>
      <Header />
      <ReferralDashboard />
      <BecomeAnAgent />
      <FAQ />
    </>
  );
};

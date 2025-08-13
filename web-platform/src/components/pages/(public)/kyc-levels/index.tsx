import { Breadcrumbs } from "@/components/shared";

import { KYC } from "./KYC";

export const KycLevels = () => {
  return (
    <>
      <div className="flex flex-col space-y-12 items-center justify-center pt-12 pb-32 md:py-16">
        <h1 className="text-on-surface text-title-large md:text-display-medium">
          KYC Levels
        </h1>
        <Breadcrumbs />
      </div>
      <div className="space-y-32 md:space-y-16">
        <section className="p-12 md:p-16 bg-surface-container-lowest text-on-surface-variant text-body-medium rounded-large">
          SendByPass uses a KYC system with different levels. KYC stands for
          &quot;Know Your Customer&quot; and is the process of verifying and
          assessing users to ensure security and compliance with regulations.
          This system is designed to meet various user needs and security
          requirements. You can choose from several levels, starting with
          &quot;No KYC&quot; for basic access. The highest level, &quot;Advanced
          KYC,&quot; gives you access to all features. Each level comes with a
          &quot;KYC badge&quot; and the chance to upgrade to a &quot;Business
          Account.&quot; <br />
          This system allows you to gradually increase your access and trust on
          the platform. This makes managing packages secure and flexible,
          whether for personal trips or business. SendByPass aims to balance
          user convenience with necessary security to help you send and receive
          international packages easily.
        </section>
        <KYC />
      </div>
    </>
  );
};

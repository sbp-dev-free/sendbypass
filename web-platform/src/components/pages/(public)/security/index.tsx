import securityContent from "@/constants/static-pages/securityContent.json";

import { StaticPageFrame } from "../StaticPageFrame";

export const Security = () => {
  return (
    <StaticPageFrame title="Security">
      <div className="space-y-12 text-body-large text-on-surface">
        <p>
          At SendByPassenger, we prioritize the security and trust of our users.
          Here’s how we keep our community safe:
        </p>

        {securityContent.map((section, index) => (
          <div key={index} className="space-y-12">
            <h2 className="pt-32 text-title-medium text-on-surface">
              {section.title}
            </h2>
            <p>{section.description}</p>

            {section.items && (
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex gap-8 items-center pl-16"
                  >
                    <span className="rounded-full size-6 bg-secondary" />
                    <p>
                      {item.status}: {item.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {section.steps && (
              <div>
                {section.steps.map((step, stepIndex) => (
                  <p key={stepIndex}>
                    {stepIndex + 1}. {step}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}

        <p className="pt-32">
          We are committed to providing a secure environment where users feel
          confident and protected as they interact and conduct transactions on
          our platform. Your safety is our priority, and we continuously update
          our protocols to maintain trust across the board.
        </p>
      </div>
    </StaticPageFrame>
  );
};

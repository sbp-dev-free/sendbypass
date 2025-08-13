import securityContent from '@/app/_dtos/static-pages/securityContent.json';

import { StaticPageFrame } from '../StaticPageFrame';

export const Security = () => {
  return (
    <StaticPageFrame title="Security">
      <div className="space-y-[12px] text-body-large text-on-surface">
        <p>
          At SendByPassenger, we prioritize the security and trust of our users.
          Here’s how we keep our community safe:
        </p>

        {securityContent.map((section, index) => (
          <div key={section.title} className="space-y-[12px]">
            <h2 className="pt-[32px] text-title-medium text-on-surface">
              {section.title}
            </h2>
            <p>{section.description}</p>

            {section.items && (
              <div className="space-y-[4px]">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={item.description}
                    className="flex gap-[8px] items-center pl-[16px]"
                  >
                    <span className="rounded-full size-[6px] bg-[#006B5B]" />
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
                  <p key={step}>
                    {stepIndex + 1}. {step}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}

        <p className="pt-[32px]">
          We are committed to providing a secure environment where users feel
          confident and protected as they interact and conduct transactions on
          our platform. Your safety is our priority, and we continuously update
          our protocols to maintain trust across the board.
        </p>
      </div>
    </StaticPageFrame>
  );
};

"use client";
import { BUSINESS_TYPE } from "@/constants/profile";
import { useAddressData, useSocials } from "@/hooks";
import { useGetLanguagesQuery } from "@/services/language";

import { businessProfilePageProps } from "../types";
export const About = ({ profile }: businessProfilePageProps) => {
  const {
    overview,
    phone_number,
    biz_category,
    email,
    founded_at,
    main_link,
    speak_languages,
    socials,
    addresses,
    current_location,
  } = profile;

  const { verboseAddress } = useAddressData(addresses, current_location);
  const { data: languages } = useGetLanguagesQuery();
  const mappedLanguages = languages?.results
    ?.filter((item) => speak_languages?.includes(item.iso))
    .map((item) => {
      return item.name;
    });
  const { renderSocials } = useSocials(socials ?? undefined);
  return (
    <div className="rounded-medium bg-surface-container-lowest p-16">
      <div className="space-y-20">
        {overview && (
          <div className="space-y-4">
            <div className="text-outline text-label-medium">Overview</div>
            <div className="text-body-small text-on-surface">{overview}</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 space-y-8">
          {phone_number?.phone && (
            <div>
              <div className="text-outline text-label-medium">Phone</div>
              <div className="text-on-surface text-label-medium">
                +{phone_number?.zone_code?.zip_code} {phone_number?.phone}
              </div>
            </div>
          )}
          {BUSINESS_TYPE[biz_category!] && (
            <div>
              <div className="text-outline text-label-medium">Industry</div>
              <div className="text-on-surface text-label-medium">
                {BUSINESS_TYPE[biz_category!]}
              </div>
            </div>
          )}
          {email && (
            <div>
              <div className="text-outline text-label-medium">Email</div>
              <div className="text-on-surface text-label-medium">{email}</div>
            </div>
          )}
          {founded_at && (
            <div>
              <div className="text-outline text-label-medium">Year founded</div>
              <div className="text-on-surface text-label-medium">
                {founded_at.split("-")[0]}
              </div>
            </div>
          )}
          {main_link.link && (
            <div>
              <div className="text-outline text-label-medium">Link</div>
              <div className="text-on-surface text-label-medium">
                {main_link.link}
              </div>
            </div>
          )}

          {verboseAddress && (
            <div>
              <div className="text-outline text-label-medium">Address</div>
              <div className="text-on-surface text-label-medium first-letter:uppercase">
                {verboseAddress}
              </div>
            </div>
          )}
          {mappedLanguages && mappedLanguages.length > 0 && (
            <div>
              <div className="text-outline text-label-medium">
                Languages Spoken
              </div>
              <div className="text-on-surface text-label-medium">
                {mappedLanguages.join(", ")}
              </div>
            </div>
          )}
          <div className="order-last md:order-none">{renderSocials()}</div>
        </div>
      </div>
    </div>
  );
};

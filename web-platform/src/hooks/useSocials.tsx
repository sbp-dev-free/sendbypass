import { useMemo } from "react";

import IconButton from "@mui/material/IconButton";
import Link from "next/link";

import { Icon } from "@/components";

export const useSocials = (
  socials?: {
    type: string;
    link: string;
  }[],
) => {
  const mappedSocials = useMemo(() => {
    return socials?.reduce<{ type: string; link: string; icon: string }[]>(
      (acc, item) => {
        switch (item.type) {
          case "facebook":
            acc.push({
              type: "facebook",
              link: item.link,
              icon: "facebook-circle",
            });
            break;
          case "linkedin":
            acc.push({
              type: "linkedin",
              link: item.link,
              icon: "linkedin-square",
            });
            break;
          case "telegram":
            acc.push({
              type: "telegram",
              link: item.link,
              icon: "telegram-circle",
            });
            break;
          case "instagram":
            acc.push({
              type: "instagram",
              link: item.link,
              icon: "Instagram",
            });
            break;
        }
        return acc;
      },
      [],
    );
  }, [socials]);

  const renderSocials = () => {
    return mappedSocials?.map((item, index) => (
      <Link key={index} href={item.link} target="_blank">
        <IconButton color="standard">
          <Icon name={item.icon} className="text-[24px] text-on-surface" />
        </IconButton>
      </Link>
    ));
  };

  return {
    mappedSocials,
    renderSocials,
  };
};

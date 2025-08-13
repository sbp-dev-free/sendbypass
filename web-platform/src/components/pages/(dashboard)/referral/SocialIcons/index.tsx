import IconButton from "@mui/material/IconButton";

import { Icon } from "@/components/shared";

import { SocialIconsProps } from "./types";
export const SocialIcons = ({ referralLink }: SocialIconsProps) => {
  const SOCIAL_ICONS = [
    {
      name: "x-com",
      link: `https://x.com/share?url=${encodeURIComponent(referralLink)}`,
    },
    {
      name: "Facebook Circle",
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
    },
    {
      name: "Instagram",
      link: `https://www.instagram.com/?url=${encodeURIComponent(referralLink)}`,
    },
    {
      name: "Linkedin Square",
      link: `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(referralLink)}`,
    },
    {
      name: "youtube",
      link: `https://www.youtube.com/?url=${encodeURIComponent(referralLink)}`,
    },
  ];

  return (
    <div className="flex gap-4 justify-center items-center mb-16 md:justify-start md:mb-0">
      {SOCIAL_ICONS.map((socialIcon, index) => (
        <IconButton
          key={index}
          color="standard"
          href={socialIcon.link || "#"}
          target="_blank"
        >
          <Icon name={socialIcon.name} />
        </IconButton>
      ))}
    </div>
  );
};

import { useMediaQuery } from "usehooks-ts";

export const useDevice = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return {
    isMobile,
    isDesktop: !isMobile,
  };
};

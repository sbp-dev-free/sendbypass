import Link from "next/link";
import { usePathname } from "next/navigation";

import { SEGMENTS } from "@/constants/static-pages/";

export const useBreadcrumbs = () => {
  const pathname = usePathname();
  const segments = pathname.split("/");

  const breadcrumbs = segments.map((segment, index) => {
    const segmentLabel = SEGMENTS[segment as keyof typeof SEGMENTS] || segment;

    return (
      <Link
        key={index}
        href={`/${segment}`}
        className="text-body-small text-on-surface-variant"
      >
        {segmentLabel}
      </Link>
    );
  });

  return { breadcrumbs };
};

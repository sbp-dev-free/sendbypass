import { usePathname } from "next/navigation";

import { PUBLIC_HEADER_ITEMS } from "@/constants/globals";

import { NavItem } from "../NavItem";

export const Nav = () => {
  const pathname = usePathname();
  return (
    <nav className="hidden gap-16 items-center md:flex">
      {PUBLIC_HEADER_ITEMS.map((item) => (
        <NavItem
          key={item.id}
          name={item.name}
          href={item.href}
          isActive={pathname === item.href.split("?")[0]}
        />
      ))}
    </nav>
  );
};

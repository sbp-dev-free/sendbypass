"use client";

import Container from "@mui/material/Container";
import { usePathname } from "next/navigation";

import { PRIVATE_ROUTES } from "@/constants";

import { CompanyInfo } from "./CompanyInfo";
import { SocialInfo } from "./SocialInfo";

export const Footer = () => {
  const pathname = usePathname();

  const isPrivateRoute = pathname.startsWith(PRIVATE_ROUTES.dashboard);

  return (
    <Container className="pt-64 pb-24 space-y-24">
      {!isPrivateRoute && <CompanyInfo />}
      <SocialInfo />
    </Container>
  );
};

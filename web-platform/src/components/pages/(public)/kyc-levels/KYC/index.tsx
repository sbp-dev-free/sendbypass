"use client";

import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { selectIsAuthenticated, selectUser } from "@/store/slices/authSlice";

import { KycUpgrade } from "./KycUpgrade";
import { Levels } from "./Levels";

export const KYC = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const profile = useSelector(selectUser);
  const verificationType = profile?.verification.type;
  const shouldShowKycUpgrade =
    (isAuthenticated && verificationType === "BEGINNER") ||
    verificationType === "BASIC";

  if (!ready) return null;

  return (
    <>
      <Levels />
      {shouldShowKycUpgrade && <KycUpgrade />}
    </>
  );
};

"use client";
import { useSelector } from "react-redux";

import { KYC_LEVELS } from "@/constants/kyc-levels";
import { selectIsAuthenticated, selectUser } from "@/store/slices/authSlice";

import { Level } from "./Level";

export const Levels = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const profile = useSelector(selectUser);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
      {KYC_LEVELS.map((level, index) => {
        return (
          <Level
            key={index}
            {...level}
            status={
              isAuthenticated
                ? profile?.verification.type === level.kyc_level
                : false
            }
          />
        );
      })}
    </div>
  );
};

import Button from "@mui/material/Button";

import { Leaves } from "@/components/icons";
import { PRIVATE_ROUTES, ROUTES } from "@/constants";

import { AuthForm } from "../AuthForm";
import { AuthFormProps } from "../types";

export const Welcome = ({ redirect }: AuthFormProps) => {
  const handleGoToConnectHub = () => {
    redirect(ROUTES.connectHub.requestToPassengers);
  };

  const handleGoToProfile = () => {
    redirect(PRIVATE_ROUTES.profile);
  };

  return (
    <AuthForm className="flex-col lg:flex-row" redirect={redirect}>
      <div className="text-center w-full lg:w-[516px]">
        <div className="flex justify-center items-center">
          <Leaves />
        </div>
        <h5 className="text-title-large text-on-surface">
          Welcome to Sendbypass!
        </h5>
        <div className="mt-16 mb-40">
          <h6 className="text-title-medium text-on-surface">
            Your account has been successfully created.{" "}
          </h6>
          <span className="text-body-medium text-on-surface-variant">
            We&apos;re excited to have you with us!{" "}
          </span>
        </div>
        <div className="flex flex-col gap-12 items-center lg:flex-row">
          <Button variant="tonal" fullWidth onClick={handleGoToConnectHub}>
            Start Exploring
          </Button>
          <Button fullWidth onClick={handleGoToProfile}>
            Complete My Profile
          </Button>
        </div>
      </div>
    </AuthForm>
  );
};

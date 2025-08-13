"use client";

import { useEffect, useState } from "react";

import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { Modal } from "@/components";
import {
  ConfirmNewPassword,
  ReadyToUse,
  ResetPassword,
  SetNewPassword,
  SignIn,
  SignInWithEmail,
  SignUp,
  SignUpWithEmail,
  SuccessfullEmailSent,
  Welcome,
  WelcomeGoogleLogin,
} from "@/components/pages/auth";
import { AUTH_ROUTES, ROUTES } from "@/constants";

export default function ParallelRouteAuthPage() {
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCloseModal = () => {
    setOpen(false);
    setTimeout(() => {
      const redirect = searchParams.get("redirect");
      push(redirect || ROUTES.home);
    }, 500);
  };

  const handleRedirect = (redirect?: string) => {
    setOpen(false);

    setTimeout(() => {
      push(redirect || ROUTES.home);
    }, 500);
  };

  const authComponentMap: Record<string, JSX.Element> = {
    [AUTH_ROUTES.signin]: <SignIn redirect={handleRedirect} />,
    [AUTH_ROUTES.signinEmail]: <SignInWithEmail redirect={handleRedirect} />,
    [AUTH_ROUTES.signup]: <SignUp redirect={handleRedirect} />,
    [AUTH_ROUTES.signupEmail]: <SignUpWithEmail redirect={handleRedirect} />,
    [AUTH_ROUTES.resetPassword]: <ResetPassword redirect={handleRedirect} />,
    [AUTH_ROUTES.setNewPassword]: <SetNewPassword redirect={handleRedirect} />,
    [AUTH_ROUTES.successfullEmailSent]: (
      <SuccessfullEmailSent redirect={handleRedirect} />
    ),
    [AUTH_ROUTES.successfullResetPassword]: (
      <SuccessfullEmailSent redirect={handleRedirect} isAfterResetPassword />
    ),
    [AUTH_ROUTES.confirmNewPassword]: (
      <ConfirmNewPassword redirect={handleRedirect} />
    ),
    [AUTH_ROUTES.welcome]: <Welcome redirect={handleRedirect} />,
    [AUTH_ROUTES.readyToUse]: <ReadyToUse redirect={handleRedirect} />,
    [AUTH_ROUTES.checkAuth]: <WelcomeGoogleLogin redirect={handleRedirect} />,
  };

  const isAuthRoute = pathname in authComponentMap;
  const [open, setOpen] = useState(true);
  useEffect(() => {
    setOpen(isAuthRoute);
  }, [isAuthRoute]);

  return (
    <Modal open={open} onClose={handleCloseModal}>
      {authComponentMap[pathname]}
    </Modal>
  );
}

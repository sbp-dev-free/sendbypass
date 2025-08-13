import { Suspense } from "react";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { Icon } from "@/components";
import { AUTH_ROUTES } from "@/constants";

const SignInButton = () => {
  const { push } = useRouter();

  const searchParams = useSearchParams();

  const handleSignIn = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(
      "redirect",
      window.location.pathname + "?" + searchParams.toString(),
    );

    push(`${AUTH_ROUTES.signin}?${params.toString()}`);
  };
  return (
    <>
      <Button
        variant="filled"
        onClick={handleSignIn}
        className="!hidden md:!block"
      >
        Sign in
      </Button>
      <IconButton
        color="standard"
        onClick={handleSignIn}
        className="md:!hidden"
      >
        <Icon name="profile" />
      </IconButton>
    </>
  );
};

export const SuspensedSignInButton = () => {
  return (
    <Suspense>
      <SignInButton />
    </Suspense>
  );
};

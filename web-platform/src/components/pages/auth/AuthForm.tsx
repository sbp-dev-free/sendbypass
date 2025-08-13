import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { Icon } from "@/components";
import { cn } from "@/utils";

import { AuthFormProps } from "./types";

export const AuthForm = ({
  children,
  back: hasBack,
  className,
  image,
  redirect,
}: AuthFormProps) => {
  const { back } = useRouter();
  const searchParams = useSearchParams();

  const handleBack = () => {
    setTimeout(() => {
      back();
    }, 300);
  };

  const handleCloseModal = () => {
    const redirectUrl = searchParams.get("redirect");
    if (redirectUrl) {
      redirect(redirectUrl);
    } else {
      redirect("/");
    }
  };

  return (
    <div className={cn("flex pb-32 md:pb-0", className)}>
      {image && (
        <div className="py-8 md:pl-8">
          <Image
            src={image ?? ""}
            alt="login"
            height={484}
            width={392}
            sizes="100vw"
            className="object-cover hidden rounded-medium md:block md:w-[392px] md:h-[484px]"
          />
        </div>
      )}
      <div className="flex flex-col justify-center px-24 w-full md:p-24 md:justify-start md:w-auto">
        <div
          className={cn("flex items-center gap-12 ", {
            "justify-between": hasBack,
            "justify-end": !hasBack,
          })}
        >
          <Button
            variant="text"
            startIcon={<Icon name="Arrow Right MD" />}
            className={cn({ "!hidden": !hasBack })}
            sx={{ paddingX: "12px" }}
            onClick={handleBack}
          >
            Back
          </Button>
          <IconButton
            color="outlined"
            className="!w-32 !h-32"
            onClick={handleCloseModal}
          >
            <Icon name="Close remove" className="text-[20px]" />
          </IconButton>
        </div>
        {children}
      </div>
    </div>
  );
};

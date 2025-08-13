import { BaseComponentProps } from "@/components/types";

export interface AuthFormProps extends BaseComponentProps {
  back?: string;
  image?: string;
  redirect: (url?: string) => void;
}

export interface SuccessfullEmailSentProps extends AuthFormProps {
  isAfterResetPassword?: boolean;
}

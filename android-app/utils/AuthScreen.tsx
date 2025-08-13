import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/authContext";

interface Props {
  handleToggleBottomSheet: (value: boolean) => void;
}

export default function AuthScreen({ handleToggleBottomSheet }: Props) {
  const { access, refresh } = useLocalSearchParams();
  const { setTokens } = useAuth();

  useEffect(() => {
    if (access && refresh) {
      handleToggleBottomSheet(false);
      if (typeof access === "string" && typeof refresh === "string")
        setTokens(access, refresh);
    }
  }, [access, refresh]);

  return null;
}

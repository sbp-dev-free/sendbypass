import { useRouter, useSearchParams } from "next/navigation";

export const useUpdateSearchParam = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateSearchParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  return { updateSearchParam };
};

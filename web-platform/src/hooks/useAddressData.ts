import { useMemo } from "react";

export function useAddressData(
  addresses?: {
    id: string | number;
    description?: string | null | undefined;
    city: string;
    country: string;
  }[],
  currentLocation?: string | number,
) {
  return useMemo(() => {
    if (!addresses || !currentLocation) {
      return { address: null, verboseAddress: null };
    }

    const address = addresses.find((item) => item.id === currentLocation);

    const verboseAddress = address
      ? [address.description, address.city, address.country]
          .filter((part) => part && part.trim())
          .join(", ")
      : null;

    return { address, verboseAddress };
  }, [addresses, currentLocation]);
}

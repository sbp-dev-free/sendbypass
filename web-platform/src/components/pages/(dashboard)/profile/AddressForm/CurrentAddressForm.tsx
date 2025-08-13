import { FC, useEffect, useState } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Radio from "@mui/material/Radio";

import { Icon } from "@/components/shared";
import {
  useGetAddressesQuery,
  useUpdateAddressMutation,
} from "@/services/addresses";

import { EmptyState } from "../EmptyState";
import { CurrentAddressFormProps } from "../types";

export const CurrentAddressForm: FC<CurrentAddressFormProps> = ({
  onClose,
}) => {
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);

  const { data: addresses } = useGetAddressesQuery();
  const [updateAddress, { isLoading }] = useUpdateAddressMutation();

  const current = addresses?.results.find((addr) => addr.current);

  useEffect(() => {
    if (addresses?.results?.length) {
      setSelectedAddress(current?.id || null);
    }
  }, [addresses]);

  const handleSelect = (id: number) => {
    setSelectedAddress(id);
  };

  const handleSubmit = async () => {
    if (!selectedAddress) return;

    try {
      await updateAddress(selectedAddress).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to update address:", error);
    }
  };

  const disabled =
    current?.id === selectedAddress ||
    !selectedAddress ||
    !addresses ||
    !addresses.results.length;

  return (
    <div className="w-full lg:w-[800px] bg-surface-container-lowest rounded-large p-24 space-y-16">
      <div className="flex justify-between items-center">
        <div className="flex gap-8 items-center">
          <div>
            <p className="text-title-medium text-on-surface">
              Current location
            </p>
            <span className="text-body-small text-on-surface-variant">
              Identify the area where your services are available.
            </span>
          </div>
        </div>
        <div className="flex gap-32 items-center">
          <IconButton color="tonal" onClick={onClose}>
            <Icon name="Close remove" className="text-[24px]" />
          </IconButton>
        </div>
      </div>
      {!addresses?.results.length ? (
        <EmptyState title="address" />
      ) : (
        <div className="space-y-8 w-full">
          <div className="p-2 text-left rounded-md text-label-large text-on-surface">
            <div className="grid grid-cols-12 gap-4">
              <div></div>
              <div className="col-span-2">Country</div>
              <div className="col-span-2">City</div>
              <div className="col-span-7">Address</div>
            </div>
          </div>
          {addresses?.results.map((item) => (
            <div
              key={item.id}
              className={`grid grid-cols-12 gap-4 items-center text-body-medium text-on-surface border-2 p-2 rounded-small ${
                selectedAddress === item.id
                  ? "border-primary"
                  : "border-gray-300"
              }`}
            >
              <div>
                <Radio
                  checked={selectedAddress === item.id}
                  onChange={() => handleSelect(item.id)}
                />
              </div>
              <div className="col-span-2">{item.country}</div>
              <div className="col-span-2">{item.city}</div>
              <div className="col-span-7">{item.description}</div>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-8 justify-end items-center w-full md:w-auto">
        <Button variant="text" className="w-full md:w-auto" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          className="w-full md:w-auto"
          type="submit"
          variant="filled"
          loading={isLoading}
          onClick={handleSubmit}
          disabled={disabled}
        >
          Change
        </LoadingButton>
      </div>
    </div>
  );
};

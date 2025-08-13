import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { FormProvider, useForm } from "react-hook-form";
import { useToggle } from "usehooks-ts";

import { Icon, Modal } from "@/components/shared";
import {
  useGetAddressesQuery,
  useUpdateAddressesMutation,
} from "@/services/addresses";
import { AddressesPatchBody } from "@/services/addresses/update/types";
import { AddressFormValues, addressSchema } from "@/validations/profile";

import { EmptyState } from "../EmptyState";

import { AddressFormRow } from "./AddressFormRow";
import { CurrentAddressForm } from "./CurrentAddressForm";
import { RowLoading } from "./RowLoading";
import { AddressFormProps } from "./types";

export const AddressForm = ({
  applyButtonText,
  discardButtonText,
  onDiscard,
  onApply,
  hasVerifyingAlert = true,
}: AddressFormProps) => {
  const [deletedAddresses, setDeletedAddresses] = useState<{ id: string }[]>(
    [],
  );

  const [openCurrentLocationModal, toggleCurrentLocationModal] = useToggle();

  const generateId = () => `local-${Math.random().toString(36).substr(2, 9)}`;

  const {
    data: addressesData,
    isLoading: addressIsLoading,
    isFetching: addressIsFetching,
  } = useGetAddressesQuery();

  const [updateAddresses, { isLoading }] = useUpdateAddressesMutation();

  const currentLocation = addressesData?.results.find((addr) => addr.current);

  const methods = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
  });

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { dirtyFields },
  } = methods;

  useEffect(() => {
    const addresses =
      addressesData?.results.map((addr) => ({
        id: addr.id.toString(),
        country: addr.country,
        city: addr.city,
        description: addr.description,
      })) || [];
    reset({ addresses });
  }, [addressesData, reset]);

  const addresses = watch("addresses");

  const addAddress = () => {
    setValue("addresses", [
      ...addresses,
      { id: generateId(), country: "", city: "", description: "" },
    ]);
  };

  const deleteAddress = (index: number) => {
    const values = [...addresses];
    const item = values[index];

    if (!item.id.includes("local")) {
      setDeletedAddresses((prev) => [...prev, { id: item.id }]);
    }

    values.splice(index, 1);
    setValue("addresses", values, { shouldDirty: true });
  };

  const handleDiscard = () => {
    if (onDiscard) return onDiscard?.();
    reset();
    setDeletedAddresses([]);
  };

  const onSubmit = async (data: AddressFormValues) => {
    const finalData: AddressesPatchBody = {
      add: [],
      update: [],
      delete: deletedAddresses,
    };

    data.addresses.forEach((item, index) => {
      const isDeleted = deletedAddresses.some((del) => del.id === item.id);
      const hasChanges =
        dirtyFields.addresses?.[index]?.country ||
        dirtyFields.addresses?.[index]?.city ||
        dirtyFields.addresses?.[index]?.description;

      const existingAddress = addressesData?.results.find(
        (addr) => addr.id.toString() === item.id,
      );

      if (!existingAddress) {
        finalData.add.push({
          country: item.country,
          city: item.city,
          description: item.description,
        });
      } else if (hasChanges && !isDeleted) {
        finalData.update.push({
          id: item.id,
          country: item.country ?? existingAddress.country,
          city: item.city ?? existingAddress.city,
          description: item.description ?? existingAddress.description,
        });
      }
    });

    try {
      await updateAddresses(finalData).unwrap();
      reset();
      setDeletedAddresses([]);
      onApply?.();
    } catch (error) {
      console.error(error);
    }
  };

  const disabled =
    Object.keys(dirtyFields).length === 0 &&
    Boolean(deletedAddresses.length === 0) &&
    !onApply;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
        <div className="p-16 space-y-24 border border-surface-container-high rounded-medium">
          <div className="flex justify-between items-center">
            <h6 className="pl-8 text-title-medium text-on-surface">Address</h6>
            <IconButton color="tonal" onClick={addAddress}>
              <Icon name="Plus" className="text-[24px]" />
            </IconButton>
          </div>
          {(addressIsLoading || addressIsFetching) &&
            !Boolean(addresses?.length) && (
              <div className="flex flex-col gap-16">
                {Array.from({ length: 2 }).map((_, index) => (
                  <RowLoading key={index} />
                ))}
              </div>
            )}
          {!(addressIsLoading || addressIsFetching) &&
            !Boolean(addresses?.length) && <EmptyState title="address" />}
          {addresses?.map((_, index) => (
            <AddressFormRow
              key={index}
              index={index}
              country={addresses?.[index]?.country}
              city={addresses?.[index]?.city}
              onDelete={() => deleteAddress(index)}
            />
          ))}
          <div className="flex justify-between items-start py-16 px-16 md:px-24 md:items-center rounded-medium bg-surface-container">
            <div className="flex gap-[5px] items-start md:items-center">
              <div className="size-[14px] mt-2 md:mt-0 flex items-center justify-center bg-secondary-opacity-12 rounded-full">
                <div className="rounded-full size-8 bg-secondary" />
              </div>
              <div className="flex flex-wrap gap-8 items-start md:items-center">
                <div className="text-label-large-prominent text-on-surface">
                  Current location:
                </div>
                {currentLocation ? (
                  <div className="text-body-medium text-on-surface">
                    {currentLocation?.description}, {currentLocation?.city},{" "}
                    {currentLocation?.country}
                  </div>
                ) : (
                  <div className="text-body-medium text-on-surface">
                    No current location
                  </div>
                )}
              </div>
            </div>
            <Button variant="text-plain" onClick={toggleCurrentLocationModal}>
              Change
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-20 justify-between items-center md:gap-0 md:flex-row">
          {hasVerifyingAlert && (
            <div className="flex gap-4 items-center">
              <Icon name="info circle" className="text-[20px]" />
              <p className="text-body-medium text-on-surface-variant">
                Your changes will be posted after approval
              </p>
            </div>
          )}
          <div className="flex gap-8 items-center w-full md:w-auto ml-auto">
            <Button
              variant="text"
              className="!grow"
              disabled={Object.keys(dirtyFields).length === 0 && !onDiscard}
              onClick={handleDiscard}
            >
              {discardButtonText || "Discard Changes"}
            </Button>
            <LoadingButton
              className="!grow"
              variant="filled"
              type="submit"
              loading={isLoading}
              disabled={disabled}
            >
              {applyButtonText || "Update"}
            </LoadingButton>
          </div>
        </div>
      </form>
      <Modal
        open={openCurrentLocationModal}
        onClose={toggleCurrentLocationModal}
      >
        <CurrentAddressForm onClose={toggleCurrentLocationModal} />
      </Modal>
    </FormProvider>
  );
};

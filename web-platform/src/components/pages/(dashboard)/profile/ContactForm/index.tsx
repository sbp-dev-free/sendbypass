import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { enqueueSnackbar } from "notistack";
import { FormProvider, useForm } from "react-hook-form";

import { Icon } from "@/components/shared";
import {
  useGetContactsQuery,
  useUpdateContactsMutation,
} from "@/services/contacts";
import { ContactPatchBody } from "@/services/contacts/update/types";
import { ContactFormValues, contactSchema } from "@/validations/profile";

import { EmptyState } from "../EmptyState";

import { MobileFormRow } from "./MobileFormRow";
import { RowLoading } from "./RowLoading";
import { SocialFormRow } from "./SocialFormRow";
import { ContactFormProps } from "./types";

export const ContactForm = ({
  applyButtonText,
  discardButtonText,
  onDiscard,
  onApply,
  hasVerifyingAlert = true,
  hasDiscardButton = true,
}: ContactFormProps) => {
  const [deletedMobiles, setDeletedMobiles] = useState<{ id: string }[]>([]);
  const [deletedSocials, setDeletedSocials] = useState<{ id: string }[]>([]);

  const {
    data: contacts,
    isLoading: contactsLoading,
    isFetching: contactsIsFetching,
  } = useGetContactsQuery();

  const [updateContacts, { isLoading }] = useUpdateContactsMutation();

  const methods = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      mobiles: [],
      socials: [],
    },
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { dirtyFields },
  } = methods;

  const generateId = () => `local-${Math.random().toString(36).substr(2, 9)}`;

  const showToast = (message: string) => {
    enqueueSnackbar(message, {
      variant: "error",
    });
  };

  useEffect(() => {
    if (contacts?.results) {
      const mobiles = contacts.results
        .filter((item) => item.type === "PHONE_NUMBER")
        .map((item) => ({
          id: item.id.toString(),
          zone_code: item?.data?.zone_code?.country,
          countryTag: item?.data?.zone_code?.country_tag,
          phone: item.data.phone,
        }));

      const socials = contacts.results
        .filter((item) => item.type === "SOCIAL")
        .map((item) => ({
          id: item.id.toString(),
          type: item.data.type,
          link: item.data.link,
        }));

      reset({ mobiles, socials });
    }
  }, [contacts, reset]);

  const mobiles = watch("mobiles");
  const socials = watch("socials");

  const onSubmit = async (data: ContactFormValues) => {
    const finalData: ContactPatchBody = {
      add: [],
      update: [],
      delete: [...deletedMobiles, ...deletedSocials],
    };

    data.mobiles.forEach((item, index) => {
      const isDeleted = deletedMobiles.some((del) => del.id === item.id);
      const hasChanges =
        dirtyFields.mobiles?.[index]?.zone_code ||
        dirtyFields.mobiles?.[index]?.phone;

      const existingContact = contacts?.results.find(
        (contact) => contact.id.toString() === item.id,
      );

      if (!existingContact) {
        finalData.add.push({
          type: "PHONE_NUMBER",
          data: {
            zone_code: { country: item.zone_code },
            phone: item.phone,
          },
        });
      } else if (hasChanges && !isDeleted) {
        const updateData: {
          id: string;
          zone_code?: { country: string };
          phone?: string;
        } = { id: item.id };

        if (dirtyFields.mobiles[index]?.zone_code) {
          updateData.zone_code = { country: item.zone_code };
        }
        if (dirtyFields.mobiles[index]?.phone) {
          updateData.phone = item.phone;
        }

        finalData.update.push({ id: item.id, data: updateData });
      }
    });

    data.socials.forEach((item, index) => {
      const isDeleted = deletedSocials.some((del) => del.id === item.id);
      const hasChanges =
        dirtyFields.socials?.[index]?.type ||
        dirtyFields.socials?.[index]?.link;

      const existingContact = contacts?.results.find(
        (contact) => contact.id.toString() === item.id,
      );

      if (!existingContact) {
        finalData.add.push({
          type: "SOCIAL",
          data: {
            type: item.type,
            link: item.link,
          },
        });
      } else if (hasChanges && !isDeleted) {
        const updateData: { id: string; type?: string; link?: string } = {
          id: item.id,
        };

        if (dirtyFields.socials[index]?.type) {
          updateData.type = item.type;
        }
        if (dirtyFields.socials[index]?.link) {
          updateData.link = item.link;
        }

        finalData.update.push({ id: item.id, data: updateData });
      }
    });

    try {
      await updateContacts(finalData).unwrap();
      onApply?.();
    } catch (error) {
      console.log(error);
    }
  };

  const addMobile = () => {
    setValue("mobiles", [
      ...mobiles,
      { id: generateId(), zone_code: "", phone: "" },
    ]);
  };

  const deleteMobile = (index: number) => {
    const values = [...mobiles];
    const item = values[index];

    if (
      contacts?.results.some((contact) => contact.data.phone === item.phone)
    ) {
      setDeletedMobiles((prev) => [...prev, { id: item.id }]);
    }

    values.splice(index, 1);
    setValue("mobiles", values, { shouldDirty: true });
  };

  const addSocial = () => {
    setValue("socials", [...socials, { id: generateId(), type: "", link: "" }]);
  };

  const deleteSocial = (index: number) => {
    const values = [...socials];
    const item = values[index];

    if (contacts?.results.some((contact) => contact.data.link === item.link)) {
      setDeletedSocials((prev) => [...prev, { id: item.id }]);
    }

    values.splice(index, 1);
    setValue("socials", values, { shouldDirty: true });
  };

  const handleDiscard = () => {
    if (onDiscard) return onDiscard?.();
    reset();
  };

  const disabled =
    Object.keys(dirtyFields).length === 0 &&
    Boolean(deletedMobiles.length === 0) &&
    Boolean(deletedSocials.length === 0) &&
    !onApply;
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
        <div className="p-16 space-y-24 border border-surface-container-high rounded-medium">
          <div className="flex justify-between items-center">
            <h6 className="pl-8 text-title-medium text-on-surface">
              Mobile Number
            </h6>
            <IconButton color="tonal" onClick={addMobile}>
              <Icon name="Plus" className="text-[24px]" />
            </IconButton>
          </div>
          {(contactsLoading || contactsIsFetching) && !mobiles.length && (
            <div className="flex flex-col gap-16">
              {Array.from({ length: 3 }).map((_, index) => (
                <RowLoading key={index} />
              ))}
            </div>
          )}
          {(!contactsLoading || !contactsIsFetching) && !mobiles.length && (
            <EmptyState title="Mobile number" />
          )}
          {!contactsLoading &&
            !contactsIsFetching &&
            mobiles.map((mobile, index) => (
              <MobileFormRow
                key={mobile.id}
                index={index}
                countryTag={mobiles[index]?.countryTag}
                onDelete={() => deleteMobile(index)}
                showToast={showToast}
              />
            ))}
        </div>

        <div className="p-16 space-y-24 border border-surface-container-high rounded-medium">
          <div className="flex justify-between items-center">
            <h6 className="pl-8 text-title-medium text-on-surface">
              Social Media
            </h6>
            <IconButton color="tonal" onClick={addSocial}>
              <Icon name="Plus" className="text-[24px]" />
            </IconButton>
          </div>
          {(contactsLoading || contactsIsFetching) && !socials?.length && (
            <div className="flex flex-col gap-16">
              {Array.from({ length: 3 }).map((_, index) => (
                <RowLoading key={index} />
              ))}
            </div>
          )}
          {(!contactsLoading || !contactsIsFetching) && !socials?.length && (
            <EmptyState title="Social media" />
          )}
          {!contactsLoading &&
            !contactsIsFetching &&
            socials?.map((_, index) => (
              <SocialFormRow
                key={index}
                index={index}
                onDelete={() => deleteSocial(index)}
              />
            ))}
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
            {hasDiscardButton && (
              <Button
                variant="text"
                className="!grow"
                disabled={Object.keys(dirtyFields).length === 0 && !onDiscard}
                onClick={handleDiscard}
              >
                {discardButtonText || "Discard Changes"}
              </Button>
            )}
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
    </FormProvider>
  );
};

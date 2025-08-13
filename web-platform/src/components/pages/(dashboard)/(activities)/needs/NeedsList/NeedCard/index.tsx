import React, { useState } from "react";

import Divider from "@mui/material/Divider";
import Image from "next/image";

import { DeleteModal } from "@/components";
import { LOAD_TYPE_SELECT_ITEMS } from "@/constants";
import { useDeleteRequirementMutation } from "@/services/requirements";

import { NeedsCardActionBar } from "./NeedCardActionBar";
import { NeedCardBadge } from "./NeedCardBadge";
import { NeedCardDimension } from "./NeedCardDimension";
import { NeedCardDocumentType } from "./NeedCardDocumentType";
import { NeedCardLocation } from "./NeedCardLocation";
import { NeedCardProps } from "./types";

export const NeedCard = ({ need }: NeedCardProps) => {
  const [deleteNeed, { isLoading }] = useDeleteRequirementMutation();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const handleDeleteModalOpen = () => setDeleteModalOpen(true);
  const handleDeleteModalClose = () => setDeleteModalOpen(false);

  const handleDeleteConfirm = async () => {
    try {
      await deleteNeed(need.id);
      setDeleteModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const typeMap = Object.fromEntries(
    LOAD_TYPE_SELECT_ITEMS.map((item) => [item.value, item.label]),
  );

  const isDocumentType =
    need.type === "SHIPPING" && need.properties.type === "DOCUMENT";

  return (
    <>
      <div className="relative p-16 border border-surface-container-high rounded-medium">
        <NeedCardBadge status={need.status} />
        <div className="flex gap-12 mt-16">
          <Image
            alt="need-photo"
            src={need.image}
            width={140}
            height={140}
            className="rounded-small object-cover w-[94px] lg:w-[140px] aspect-square"
          />
          <div className="flex flex-col justify-between w-full lg:py-8">
            <div className="flex flex-col gap-8 lg:gap-2">
              <div className="font-bold text-title-medium text-on-surface">
                {need.name}
              </div>
              <div className="flex flex-col lg:flex-row lg:gap-12">
                <div className="font-bold text-outline text-label-medium">
                  {typeMap[need.properties.type] || need.properties.type}
                </div>
              </div>
            </div>
            <div className="hidden justify-between w-full xl:flex">
              <NeedCardLocation
                className="mt-24"
                origin={need.source}
                destination={need.destination}
              />
              {isDocumentType ? (
                <NeedCardDocumentType properties={need.properties} />
              ) : (
                <NeedCardDimension properties={need.properties} />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-24 justify-between mt-24 xl:hidden lg:flex-row lg:items-center">
          <NeedCardLocation
            origin={need.source}
            destination={need.destination}
          />
          {isDocumentType ? (
            <NeedCardDocumentType properties={need.properties} />
          ) : (
            <NeedCardDimension properties={need.properties} />
          )}
        </div>
        <div className="my-16">
          <Divider />
        </div>
        <div>
          <NeedsCardActionBar
            description={need.comment}
            handleDelete={handleDeleteModalOpen}
            needId={need.id}
            status={need.status}
          />
        </div>
      </div>
      <DeleteModal
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${need.type.toLocaleLowerCase()}`}
        description={`Deleting this ${need.type.toLocaleLowerCase()} will remove all associated bookings and plans. Are you sure you want to continue?`}
        loading={isLoading}
      />
    </>
  );
};

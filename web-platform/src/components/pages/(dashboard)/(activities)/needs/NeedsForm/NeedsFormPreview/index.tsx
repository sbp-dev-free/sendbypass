"use client";

import { useEffect, useMemo, useState } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import type { DeepPartial } from "react-hook-form";

import { useProfileQuery } from "@/services/profile";
import {
  useCreateRequirementMutation,
  useUpdateRequirementMutation,
} from "@/services/requirements";
import { RequirementBody } from "@/services/requirements/create/types";
import { getToken } from "@/utils";
import { CreateShippingNeedFormData } from "@/validations/needs";

import { FlightInfo } from "./PreviewFlightInfo/types";
import PreviewDimension from "./PreviewDimension";
import { PreviewDocumentType } from "./PreviewDocumentType";
import PreviewFlightInfo from "./PreviewFlightInfo";
import { PreviewWrapper } from "./PreviewWrapper";
import { NeedsFormPreviewProps } from "./types";

const getLocationInfo = (location: CreateShippingNeedFormData["origin"]) => {
  return {
    countryCode: location?.value?.split(":")[1],
    city: location?.label.city,
    country: location?.label.country,
  };
};

const NeedsFormPreview = ({
  previewData,
  onClose,
  type,
  needId,
}: NeedsFormPreviewProps) => {
  const token = getToken("access");
  const { data: profile } = useProfileQuery(undefined, { skip: !token });

  const origin = getLocationInfo(previewData.origin);
  const destination = getLocationInfo(previewData.destination);
  const douDate = dayjs(previewData.douDate).format("ddd DD MMM");
  const [image, setImage] = useState("");
  const [createRequirement, { isLoading }] = useCreateRequirementMutation();
  const [updateRequirement, { isLoading: isUpdating }] =
    useUpdateRequirementMutation();
  const router = useRouter();
  const isDocumentType =
    previewData.loadType?.value === "DOCUMENT" && type === "SHIPPING";

  useEffect(() => {
    if (previewData.images[0]) {
      if (previewData.images[0] instanceof File) {
        const url = URL.createObjectURL(previewData.images[0]);
        setImage(url);
      } else {
        setImage(previewData.images[0]);
      }
    }
  }, [previewData]);

  const flightInfo = useMemo<FlightInfo>(
    () => ({
      origin: {
        city:
          previewData?.origin?.id !== -1
            ? previewData?.origin?.label?.city || "--"
            : "Any city",
        country:
          previewData?.origin?.id !== -1
            ? previewData?.origin?.label?.country || "--"
            : "Any country",
        countryCode: previewData?.origin?.value?.split(":")[1] || "",
        date: "Any date",
      },
      destination: {
        city: previewData?.destination?.label?.city || "--",
        country: previewData?.destination?.label?.country || "--",
        countryCode: previewData?.destination?.value?.split(":")[1] || "--",
        date: douDate,
      },
    }),
    [previewData, douDate],
  );

  const handleCreateRequirement = async () => {
    try {
      const {
        dimension,
        productName,
        proposedPrice,
        origin,
        destination,
        douDate,
        loadType,
        images,
      } = previewData;

      let productLink;
      let productPrice;
      if ("productLink" in previewData) {
        productLink = previewData.productLink;
        productPrice = previewData.productPrice;
      }

      const requirementBody: DeepPartial<RequirementBody> = {
        properties: {
          flexible_dimensions: dimension.isFlexible,
          height: Number(dimension.height),
          length: Number(dimension.length),
          width: Number(dimension.width),
          weight: Number(dimension.weight),
          type: loadType?.value,
          link: productLink,
          size: isDocumentType ? String(dimension.size) : undefined,
          num: isDocumentType ? Number(dimension.num) : undefined,
        },
        name: productName,
        cost: {
          wage: Number(proposedPrice),
          item_price: Number(productPrice),
        },
        source: { location: origin?.id !== -1 ? origin?.id : null },
        destination: {
          location: destination?.id,
          to: douDate || undefined,
        },
        comment: previewData.description,
        type,
      };

      if (images[0] instanceof File) requirementBody.image = images[0];

      if (needId) await updateRequirement({ id: needId, ...requirementBody });
      else await createRequirement(requirementBody).unwrap();

      router.back();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <PreviewWrapper
        title="Publish your Need"
        subtitle="Review the information carefully"
        onClose={onClose}
      >
        <div className="">
          <div className="flex gap-16 items-center">
            <Avatar
              sx={{ width: 50, height: 50 }}
              src={profile?.image}
              className="border-2 border-outline-variant !hidden md:!block"
            />
            <Image
              alt="need-photo"
              src={image}
              width={94}
              height={94}
              className="rounded-small object-cover w-[94px] h-[94px] md:hidden"
            />
            <div className="flex flex-col gap-8 md:gap-2">
              <div className="font-bold text-title-medium text-on-surface">
                {previewData.productName}
              </div>
              <div className="flex flex-col md:flex-row md:gap-12">
                {type === "SHOPPING" && "productPrice" in previewData && (
                  <>
                    <div className="font-bold text-label-medium text-on-surface">
                      Product price €{previewData.productPrice}
                    </div>
                    <Divider
                      orientation="vertical"
                      className="hidden md:block"
                    />
                  </>
                )}

                <div className="font-bold text-outline text-label-medium">
                  {previewData.loadType?.label}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-24 lg:hidden">
            <div>
              <div className="text-label-medium text-outline">origin</div>
              <div className="text-label-large text-on-surface">
                {origin.city} ({origin.countryCode})
              </div>
              <div className="flex items-center text-body-small text-on-surface">
                <div className="pr-12 border-r border-r-outline-variant">
                  {origin.country}
                </div>
                <div className="ml-12">Any date</div>
              </div>
            </div>
            <div className="mt-24">
              <div className="text-label-medium text-outline">destination</div>
              <div className="text-label-large text-on-surface">
                {destination.city} ({destination.countryCode})
              </div>
              <div className="flex items-center text-body-small text-on-surface">
                <div className="pr-12 border-r border-r-outline-variant">
                  {destination.country}
                </div>
                <div className="ml-12">{douDate}</div>
              </div>
            </div>
          </div>
          <div className="mt-24 lg:hidden">
            {isDocumentType ? (
              <PreviewDocumentType
                size={previewData.dimension?.size ?? ""}
                num={previewData.dimension?.num ?? 1}
                width={previewData.dimension?.width}
                length={previewData.dimension?.length}
              />
            ) : (
              <PreviewDimension
                weight={previewData.dimension?.weight}
                width={previewData.dimension?.width}
                height={previewData.dimension?.height}
                length={previewData.dimension?.length}
              />
            )}
          </div>
          <div className="hidden gap-24 my-16 lg:flex lg:justify-between">
            <PreviewFlightInfo className="w-1/2" flightInfo={flightInfo} />
            <div className="flex gap-6">
              {isDocumentType ? (
                <PreviewDocumentType
                  size={previewData.dimension?.size ?? ""}
                  num={previewData.dimension?.num ?? 1}
                  width={previewData.dimension?.width}
                  length={previewData.dimension?.length}
                />
              ) : (
                <PreviewDimension
                  weight={previewData.dimension?.weight}
                  width={previewData.dimension?.width}
                  height={previewData.dimension?.height}
                  length={previewData.dimension?.length}
                />
              )}

              <Image
                alt="need-photo"
                src={image}
                width={90}
                height={90}
                className="rounded-small object-cover w-[90px] h-[90px]"
              />
            </div>
          </div>
          <div className="mt-24 lg:mt-16 text-body-small text-on-surface-variant">
            {previewData.description}
          </div>
          <div className="flex justify-between mt-24 lg:mt-16 ">
            <div className="">
              <div className="font-bold text-outline text-label-small">
                Proposed Price
              </div>
              <div className="font-bold text-title-medium text-primary">
                € {previewData.proposedPrice}
              </div>
            </div>
            <div className="flex gap-8">
              <Button className="w-full" variant="text" onClick={onClose}>
                Cancel
              </Button>
              <LoadingButton
                loading={isLoading || isUpdating}
                className="w-full"
                type="submit"
                variant="filled"
                onClick={handleCreateRequirement}
              >
                Publish
              </LoadingButton>
            </div>
          </div>
        </div>
      </PreviewWrapper>
    </>
  );
};

export default NeedsFormPreview;

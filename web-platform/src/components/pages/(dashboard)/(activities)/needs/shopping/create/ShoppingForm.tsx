"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import {
  LOAD_TYPE_SELECT_ITEMS,
  SHOPPING_FORM_INITIAL_VALUES,
} from "@/constants";
import { useLazyGetRequirementQuery } from "@/services/requirements";
import {
  CreateShoppingNeedFormData,
  createShoppingNeedFormSchema,
} from "@/validations/needs";

import { NeedsForm } from "../../NeedsForm";
import NeedsFormPreview from "../../NeedsForm/NeedsFormPreview";

import { ShoppingFormProps } from "./types";

export const ShoppingForm = ({ needId }: ShoppingFormProps) => {
  const [previewData, setPreviewData] =
    useState<CreateShoppingNeedFormData | null>(null);

  const [values, setValues] = useState<CreateShoppingNeedFormData>(
    SHOPPING_FORM_INITIAL_VALUES,
  );

  const [getNeed] = useLazyGetRequirementQuery();

  useEffect(() => {
    const fetchNeeds = async () => {
      if (!needId) return;
      const need = await getNeed(needId).unwrap();
      const loadTypeItem = LOAD_TYPE_SELECT_ITEMS.find(
        (item) => item.value === need.properties.type,
      );
      setValues({
        productName: need.name,
        description: need.comment,
        images: [need.image, null, null, null, null],
        loadType: loadTypeItem || {
          label: need.properties.type,
          value: need.properties.type,
        },
        destination: {
          id: need.destination.location_data.id,
          type: need.destination.location_data.type || "",
          label: {
            country: need.destination.location_data.country,
            city: need.destination.location_data.city,
            airport: need.destination.location_data.related_object?.name || "",
          },
          value: need.destination.location_data.tag || "",
        },
        origin: need.source.location_data
          ? {
              id: need.source.location_data.id,
              type: need.source.location_data.type || "",
              label: {
                country: need.source.location_data.country,
                city: need.source.location_data.city,
                airport: need.source.location_data.related_object?.name || "",
              },
              value: need.source.location_data.tag || "",
            }
          : {
              id: -1,
              value: undefined,
              label: {
                country: "City or Airport",
                city: "Country",
                airport: "Any locations",
              },
              type: "GENERIC",
            },
        dimension: {
          isFlexible: !!need.properties.flexible_dimensions,
          weight: String(need.properties.weight),
          width:
            Number(need.properties.width) > 0
              ? String(need.properties.width)
              : "",
          height:
            Number(need.properties.height) > 0
              ? String(need.properties.height)
              : "",
          length:
            Number(need.properties.length) > 0
              ? String(need.properties.length)
              : "",
        },
        douDate: need.destination.to ? new Date(need.destination.to) : null,
        productLink: need.properties.link || "",
        productPrice: String(need.cost.item_price),
        proposedPrice: String(need.cost.wage),
      });
    };

    fetchNeeds();
  }, [needId]);

  const formMethods = useForm<CreateShoppingNeedFormData>({
    resolver: zodResolver(createShoppingNeedFormSchema),
    defaultValues: SHOPPING_FORM_INITIAL_VALUES,
    values,
    mode: "onChange",
  });

  const onSubmit = (data: CreateShoppingNeedFormData) => {
    setPreviewData(data);
  };

  return (
    <FormProvider {...formMethods}>
      <form
        className="mt-16 md:mt-32"
        onSubmit={formMethods.handleSubmit(onSubmit)}
      >
        <NeedsForm type="shopping" />
      </form>
      {previewData && (
        <NeedsFormPreview
          previewData={previewData}
          onClose={() => setPreviewData(null)}
          type="SHOPPING"
          needId={needId}
        />
      )}
    </FormProvider>
  );
};

"use client";
import { useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

import { useUpdateSearchParam } from "@/hooks";
import { useProfileQuery } from "@/services/profile";
import {
  BusinessProfileFormValues,
  businessProfileSchema,
} from "@/validations/profile";

import { AddressForm } from "../profile/AddressForm";
import { ContactForm } from "../profile/ContactForm";

import { BasicForm } from "./Steps/BasicForm";
import { Complete } from "./Steps/Complete";
import { ProgressBar } from "./ProgressBar";

const stepOrder = ["basic", "contact", "address", "complete"] as const;
type Step = (typeof stepOrder)[number];

const FormTitle = () => (
  <div className="mb-32 md:ml-8">
    <div className="text-on-surface text-title-large mb-4">
      Switch to Business account
    </div>
    <div className="text-body-small text-on-surface">
      Carefully fill out all three sections.
    </div>
  </div>
);

interface StepComponentProps {
  step: number;
}

const StepLayout = ({
  step,
  children,
}: {
  step: number;
  children: React.ReactNode;
}) => (
  <>
    <FormTitle />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
      <div className="col-span-1">
        <ProgressBar activeStep={step} />
      </div>
      <div className="md:col-span-3 col-span-1">{children}</div>
    </div>
  </>
);

export const SwitchToBusinessAccount = () => {
  const { updateSearchParam } = useUpdateSearchParam();
  const stepComponents: Record<Step, React.FC<StepComponentProps>> = {
    basic: () => (
      <StepLayout step={0}>
        <BasicForm />
      </StepLayout>
    ),
    contact: () => (
      <StepLayout step={1}>
        <ContactForm
          applyButtonText="Save and Next"
          discardButtonText="Back"
          onApply={() => {
            updateSearchParam("step", "address");
          }}
          onDiscard={() => {
            updateSearchParam("step", "basic");
          }}
          hasDiscardButton={false}
          hasVerifyingAlert={false}
        />
      </StepLayout>
    ),
    address: () => (
      <StepLayout step={2}>
        <AddressForm
          applyButtonText="Submit"
          discardButtonText="Back"
          onApply={() => {
            updateSearchParam("step", "complete");
          }}
          onDiscard={() => {
            updateSearchParam("step", "contact");
          }}
          hasVerifyingAlert={false}
        />
      </StepLayout>
    ),
    complete: () => (
      <StepLayout step={3}>
        <Complete />
      </StepLayout>
    ),
  };
  const searchParams = useSearchParams();
  const router = useRouter();
  const stepFromUrl = searchParams.get("step") as Step | null;

  const activeStep = useMemo(() => {
    return stepFromUrl ? stepOrder.indexOf(stepFromUrl) : 0;
  }, [stepFromUrl]);

  useEffect(() => {
    if (!stepFromUrl || !stepOrder.includes(stepFromUrl)) {
      router.push(`?step=${stepOrder[0]}`);
    }
  }, [stepFromUrl, router]);

  const StepComponent = useMemo(() => {
    return stepComponents[stepFromUrl || "basic"] || stepComponents["basic"];
  }, [stepFromUrl]);
  const { data: profile } = useProfileQuery();

  const methods = useForm<BusinessProfileFormValues>({
    resolver: zodResolver(businessProfileSchema),
    mode: "onChange",
    defaultValues: {
      speak_languages: profile?.speak_languages,
      image: profile?.image,
    },
  });
  useEffect(() => {
    if (profile) {
      methods.reset({
        speak_languages: profile?.speak_languages,
        image: profile?.image,
      });
    }
  }, [profile]);
  return (
    <FormProvider {...methods}>
      <div className="p-16 bg-surface-container-lowest rounded-medium">
        <StepComponent step={activeStep} />
      </div>
    </FormProvider>
  );
};

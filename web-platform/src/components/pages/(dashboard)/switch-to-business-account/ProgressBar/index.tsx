import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { useFormContext } from "react-hook-form";

import { MapLocation, PhoneNumberPad, Store } from "@/components/icons";
import { CircleSegmentProgress } from "@/components/shared";
import { useGetAddressesQuery } from "@/services/addresses";
import { useGetContactsQuery } from "@/services/contacts";
import { cn } from "@/utils";
import { BusinessProfileFormValues } from "@/validations/profile";

import { ProgressBarProps } from "./types";
export const ProgressBar = ({ activeStep }: ProgressBarProps) => {
  const { watch } = useFormContext<BusinessProfileFormValues>();
  let completeStepsCount = 0;
  const values = watch([
    "image",
    "name",
    "biz_category",
    "founded_at",
    "speak_languages.0",
    "main_link.type",
    "main_link.link",
  ]);
  completeStepsCount = values.filter(
    (value) => value !== undefined && value !== "",
  ).length;
  const { data: contacts } = useGetContactsQuery();
  const { data: addressesData } = useGetAddressesQuery();
  if (contacts) {
    const mobiles = contacts.results.filter(
      (item) => item.type === "PHONE_NUMBER",
    );
    if (mobiles.length && mobiles[0].data.phone) {
      completeStepsCount += 1;
    }
    if (mobiles.length && mobiles[0].data.zone_code) {
      completeStepsCount += 1;
    }
  }
  if (addressesData) {
    if (addressesData.results.length) {
      if (addressesData.results[0].city) {
        completeStepsCount += 1;
      }
      if (addressesData.results[0].country) {
        completeStepsCount += 1;
      }
    }
  }
  const steps = [
    {
      title: "Basic",
      description: "Enter essential business details.",
      icon: <Store />,
    },
    {
      title: "Contact",
      description: "Provide contact information.",
      icon: <PhoneNumberPad />,
    },
    {
      title: "Address",
      description: "Specify the business address.",
      icon: <MapLocation />,
    },
  ];
  return (
    <div className="border border-surface-container-high rounded-large">
      <div className="p-12 md:p-16">
        <Timeline
          sx={{
            "@media (max-width: 768px)": {
              display: "flex",
              flexDirection: "row",
              padding: "0",
              maxWidth: "100vw",
              boxSizing: "border-box",
              justifyContent: "center",

              "& .MuiTimelineItem-root": {
                flexDirection: "column",
                flexShrink: 1,
                flexGrow: 1,
              },
              "& .MuiTimelineSeparator-root": {
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
              },
              "& .MuiTimelineItem-root:nth-child(2) .MuiTimelineConnector-root":
                {
                  margin: "0 0 0 8px",
                },
              "& .MuiTimelineItem-root:nth-child(2) .MuiTypography-root": {
                transform: "translateX(-5px)",
              },
              "& .MuiTimelineItem-root:nth-child(3) .MuiTypography-root": {
                textAlign: "center",
              },
              "& .MuiTimelineConnector-root": {
                minWidth: "60px",
                height: "2px",
                margin: "0 8px",
              },
              "& .MuiTypography-root-MuiTimelineContent-root": {
                padding: "0",
              },
              "& .MuiTimelineContent-root": {
                padding: "6px 0",
                width: "100%",
              },
            },
            "@media (min-width: 769px)": {
              flexDirection: "column",
              padding: "0",
              "& .MuiTimelineItem-root": {
                minHeight: "40px",
              },
              "& .MuiTimelineContent-root": {
                padding: "0 0 0 8px",
              },
              "& .MuiTimelineSeparator-root": {
                flexDirection: "column",
              },
              "& .MuiTimelineConnector-root": {
                width: "2px",
                height: "40px",
                margin: "8px 0",
              },
            },
          }}
        >
          {steps.map((step, index) => (
            <TimelineItem
              key={index}
              sx={{
                "&::before": {
                  display: "none",
                },
              }}
            >
              <TimelineSeparator>
                <div className="flex flex-col justify-center items-center">
                  <div
                    className={cn(
                      "bg-primary-opacity-8 p-8 rounded-full border-2 border-primary-opacity-0",
                      {
                        "border-primary-opacity-50": activeStep >= index,
                      },
                    )}
                  >
                    {step.icon}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <TimelineConnector
                    className={cn({
                      "!bg-primary": activeStep >= index + 1 && activeStep,
                    })}
                  />
                )}
              </TimelineSeparator>
              <TimelineContent>
                <div
                  className="text-label-large"
                  style={{
                    color:
                      activeStep === index
                        ? "rgb(var(--on-surface))"
                        : "rgb(var(--on-surface-variant))",
                  }}
                >
                  {step.title}
                </div>
                <div
                  className="text-body-small hidden md:block"
                  style={{
                    color:
                      activeStep === index
                        ? "rgb(var(--on-surface-variant))"
                        : "rgb(var(--outline))",
                  }}
                >
                  {step.description}
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
      <div className="border-b border-surface-container-high"></div>
      <div className="py-12 px-16 flex justify-between items-center">
        <div className="text-on-surface-variant text-label-medium">
          Required Fields
        </div>
        <div className="flex items-center gap-8">
          <span className="text-label-medium text-outline ml-auto leading-6 flex items-center">
            <span className="text-label-large text-on-surface mt-2">
              {completeStepsCount}
            </span>
            /11
          </span>
          <CircleSegmentProgress
            steps={11}
            currentStep={completeStepsCount}
            isComplete={completeStepsCount === 11}
          />
        </div>
      </div>
    </div>
  );
};

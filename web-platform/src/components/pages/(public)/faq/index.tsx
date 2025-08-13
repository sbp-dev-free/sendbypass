import { FC } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Link from "next/link";

import { Icon } from "@/components/shared";
import { CATEGORIES, QUESTIONS, ROUTES } from "@/constants";
import { cn } from "@/utils";

import { StaticPageFrame } from "../StaticPageFrame";

import { FAQProps } from "./types";

const renderFAQs = (category?: string) => {
  if (category === "All" || !category) {
    return QUESTIONS;
  }

  return QUESTIONS.filter(
    ({ category: questionCategory }) => questionCategory === category,
  );
};

const renderCategories = (category?: string) => {
  return CATEGORIES.map((faqCategory) => (
    <Link
      key={faqCategory}
      href={`${ROUTES.faq}?category=${faqCategory}`}
      className="inline-flex flex-shrink-0 gap-8 items-center"
    >
      <span
        className={cn("rounded-full w-6 h-6 max-h-6 max-w-6", {
          "bg-primary": category === faqCategory || category === "All",
          "bg-outline-variant": category !== faqCategory,
        })}
      />
      <p
        className={`text-body-medium ${category === faqCategory ? "text-primary" : "text-on-surface"}`}
      >
        {faqCategory}
      </p>
    </Link>
  ));
};

export const FAQ: FC<FAQProps> = ({ category }) => {
  return (
    <StaticPageFrame title="FAQ">
      <div className="flex flex-col gap-20 justify-center items-center">
        <div className="max-w-[828px] text-center space-y-24">
          <header className="space-y-12">
            <h4 className="text-title-large text-on-surface">
              Frequently asked questions (FAQ)
            </h4>
            <div className="space-y-4 text-body-medium text-on-surface">
              <p className="whitespace-normal break-words">
                These are the most commonly asked questions.
              </p>

              <p>
                Can&apos;t find what you&apos;re looking for?{" "}
                <Link href={ROUTES.contactUs}>
                  <Button variant="text-plain">Send a message!</Button>
                </Link>
              </p>
            </div>
          </header>
          <div className="flex flex-wrap gap-16 justify-center items-center">
            {renderCategories(category)}
          </div>
        </div>
        <div className="max-w-[828px]">
          {renderFAQs(category).map(({ title, content }) => (
            <Accordion
              key={title}
              sx={{
                backgroundColor: "rgb(var(--surface-container-low))",
                border: "none !important",
              }}
            >
              <AccordionSummary
                expandIcon={
                  <Icon name="Plus" className="text-[24px] text-primary" />
                }
                sx={{
                  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                    transform: "rotate(45deg)",
                  },
                }}
              >
                <div className="text-label-large text-on-surface">{title}</div>
              </AccordionSummary>
              <AccordionDetails className="!text-body-medium text-on-surface">
                {content}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </StaticPageFrame>
  );
};

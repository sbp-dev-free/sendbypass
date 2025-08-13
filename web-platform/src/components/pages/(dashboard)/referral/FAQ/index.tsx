import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

import { Icon } from "@/components/shared";
import { QUESTIONS } from "@/constants/referral";
export const FAQ = () => {
  return (
    <div className="md:my-24">
      <div className="text-title-medium md:text-title-large text-on-surface pt-40 mb-24 text-center">
        Frequently Asked Questions
      </div>
      {QUESTIONS.map(({ title, content }) => (
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
  );
};

import { FC } from "react";

import IconButton from "@mui/material/IconButton";
import { useToggle } from "usehooks-ts";

import { Icon, Modal } from "@/components/shared";

import { FlexibleDimensionProps } from "./types";

export const FlexibleDimension: FC<FlexibleDimensionProps> = ({
  description,
}) => {
  const [open, toggle] = useToggle();

  return (
    <>
      <div
        // type="button"
        className="space-y-6 min-w-48 md:min-w-64 h-[90px] xs:px-4 md:px-16 py-12 flex flex-col justify-center text-center"
        // onClick={toggle}
      >
        <Icon name="Cube6" className="text-[24px] text-primary" />
        <div className="space-y-4 text-label-medium">
          <div className="capitalize text-on-surface-variant">
            Flexible Dimension
          </div>
          {/* <div className="text-label-medium text-outline group-hover:text-primary">
            Learn more
          </div> */}
        </div>
      </div>
      <Modal open={open} onClose={toggle}>
        <div className="p-24 rounded-large bg-surface-container-lowest space-y-16 lg:w-[800px] relative">
          <div className="flex flex-col-reverse gap-16 items-center md:gap-0 md:flex-row md:justify-between">
            <p className="text-title-medium text-on-surface">
              Flexible Dimension{" "}
            </p>
            <div className="flex gap-32 items-center">
              <IconButton
                color="tonal"
                onClick={toggle}
                className="!hidden md:!flex"
              >
                <Icon name="Close remove" className="text-[24px]" />
              </IconButton>
            </div>
          </div>
          <div className="text-body-medium text-on-surface-variant">
            {description}
          </div>
        </div>
      </Modal>
    </>
  );
};

import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

import { Icon } from "@/components";
import { PRIVATE_ROUTES } from "@/constants";

import {
  SectionDescription,
  SectionDimension,
  SectionLocation,
  SectionPhoto,
  SectionProduct,
  SectionReward,
} from "./NeedsFormSection";
import { NeedsFormProps } from "./types";

export const NeedsForm = ({ type }: NeedsFormProps) => {
  const router = useRouter();
  const handleCancel = () => {
    router.push(`${PRIVATE_ROUTES.needs[type].index}`);
  };

  return (
    <div className="flex flex-col gap-16">
      <SectionProduct type={type} />
      <SectionDimension type={type} />
      <SectionPhoto />
      <SectionLocation />
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
        <SectionReward />
        <SectionDescription />
      </div>
      <div className="flex flex-col gap-20 justify-between  md:mt-16 md:flex-row">
        <div className="flex gap-4 justify-center items-center text-body-small text-on-surface-variant md:justify-start">
          <Icon name="info-circle" className="text-[20px] hidden md:block" />
          Your changes will be posted after approval
        </div>
        <div className="flex gap-8">
          <Button className="w-full" variant="text" onClick={handleCancel}>
            Cancel
          </Button>
          <Button className="w-full" type="submit">
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

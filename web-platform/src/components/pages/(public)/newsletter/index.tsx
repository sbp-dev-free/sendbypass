import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";

import { Breadcrumbs, Icon } from "@/components/shared";
import { newsletters } from "@/constants/newsletter";

import { Subscribe } from "./subscribe";

export const Newsletter = () => {
  return (
    <div>
      <div className="mx-auto w-fit space-y-12 pb-32">
        <h1 className="text-center text-title-large md:text-display-medium text-on-surface">
          Newsletter
        </h1>
        <div className="mx-auto w-fit">
          <Breadcrumbs />
        </div>
      </div>
      <div className="mb-24">
        {newsletters.map((el, index) => {
          return (
            <div
              key={index}
              className="bg-surface-container-lowest rounded-large p-16 mb-8"
            >
              <div className="flex justify-between items-center">
                <div className="flex gap-8 md:gap-16 items-center">
                  <div className="text-outline-variant text-title-large hidden md:block">
                    {el.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-8 md:mb-4">
                      <div className="text-outline-variant text-title-medium md:hidden">
                        {el.id}
                      </div>
                      <div className="flex items-center gap-8 text-outline text-label-medium">
                        <div>{el.date}</div>
                        <div className="inline-block rounded-full size-4 bg-outline-variant"></div>
                        <div>{el.edition} Edition</div>
                      </div>
                    </div>
                    <div className="text-on-surface text-title-small md:text-title-medium">
                      {el.title}
                    </div>
                  </div>
                </div>
                <Link href={el.link}>
                  <Button
                    className="!hidden md:!flex"
                    variant="tonal"
                    endIcon={<Icon name="right up square" />}
                  >
                    Read full
                  </Button>
                  <IconButton color="tonal" className="md:!hidden">
                    <Icon name="right up square" />
                  </IconButton>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      <Subscribe />
    </div>
  );
};

import { ChangeEvent } from "react";

import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import { SERVICE_TYPE } from "@/enums/globals";

import { FilterCheckBox } from "./FilterCheckBox";

export const ServiceType = () => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const setSearchParams = (newParams: URLSearchParams) => {
    replace(`?${newParams.toString()}`, { scroll: false });
  };

  const serviceTypes = searchParams.get("service_types")?.split(",") || [];

  const handleOnChangeServiceType = (
    event: ChangeEvent<HTMLInputElement>,
    serviceType: string,
  ) => {
    const newServiceTypes = new Set(serviceTypes);

    if (event.target.checked) {
      newServiceTypes.add(serviceType);
    } else {
      newServiceTypes.delete(serviceType);
    }

    const newParams = new URLSearchParams(searchParams.toString());

    if (newServiceTypes.size > 0) {
      newParams.set("service_types", Array.from(newServiceTypes).join(","));
    } else {
      newParams.delete("service_types");
    }

    setSearchParams(newParams);
  };

  return (
    <div className="space-y-12">
      <div className="text-title-small text-on-surface">Service type</div>
      <div className="py-4">
        <FilterCheckBox
          id="shopping"
          label="Shopping"
          checked={serviceTypes?.includes(SERVICE_TYPE.SHOPPING)}
          onChange={(e) => handleOnChangeServiceType(e, SERVICE_TYPE.SHOPPING)}
        />
        <FilterCheckBox
          id="document"
          label="Document"
          checked={serviceTypes?.includes(SERVICE_TYPE.DOCUMENT)}
          onChange={(e) => handleOnChangeServiceType(e, SERVICE_TYPE.DOCUMENT)}
        />
        <FilterCheckBox
          id="cargo"
          label="Cargo"
          checked={serviceTypes?.includes(SERVICE_TYPE.VISIBLE_LOAD)}
          onChange={(e) =>
            handleOnChangeServiceType(e, SERVICE_TYPE.VISIBLE_LOAD)
          }
        />
      </div>
    </div>
  );
};

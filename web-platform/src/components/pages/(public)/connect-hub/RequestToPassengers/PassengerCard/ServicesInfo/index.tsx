"use client";

import { FC, useEffect } from "react";

import { Service } from "./Service";
import { ServicesInfoProps } from "./types";

export const ServicesInfo: FC<ServicesInfoProps> = ({
  services,
  setServiceId,
  serviceId,
}) => {
  useEffect(() => {
    if (services.length > 0) {
      setServiceId(services[0].id);
    }
  }, []);

  const handleSelectService = (id: string) => {
    setServiceId(id);
  };

  return (
    <div className="flex flex-col gap-8 items-center md:flex-row">
      {services.map(({ id, ...service }) => (
        <Service
          key={id}
          {...service}
          isSelected={serviceId === id}
          onClick={() => handleSelectService(id)}
        />
      ))}
    </div>
  );
};

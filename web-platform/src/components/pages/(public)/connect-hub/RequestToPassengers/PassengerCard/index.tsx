import { FC, useState } from "react";

import Divider from "@mui/material/Divider";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useToggle } from "usehooks-ts";

import { Modal } from "@/components/shared";
import { getConfigs } from "@/configs";
import { AUTH_ROUTES } from "@/constants";
import { PROFILE_STATUS } from "@/enums/globals";
import { getToken } from "@/utils";

import { SuccessFullRequestSent } from "../../SuccessFullRequestSent";

import { Service, ServiceUnion } from "./ServicesInfo/types";
import { ActionBar } from "./ActionBar";
import { FlightInfo } from "./FlightInfo";
import { PassengerInfo } from "./PassengerInfo";
import { ServicesInfo } from "./ServicesInfo";
import { TripRequest } from "./TripRequest";
import { PassengerCardProps } from "./types";

const serviceNameMapping: Record<string, ServiceUnion> = {
  "shipping:document": "DOCUMENT",
  "shipping:visible_load": "CARGO",
  "shopping:visible_load": "SHOPPING",
};

export const PassengerCard: FC<PassengerCardProps> = ({ trip }) => {
  const [serviceId, setServiceId] = useState<string>("");

  const [openReviewModal, toggleReviewModal] = useToggle();
  const [openSuccessModal, toggleSuccessModal] = useToggle();

  const { push } = useRouter();
  const searchParams = useSearchParams();

  const isLoggedIn = getToken("access");

  const { user_data } = trip;

  const passengerInfo = {
    id: user_data.id,
    name: user_data.first_name + " " + user_data.last_name,
    rate: user_data.stats.total_successful_orders,
    image: user_data.image,
    isVerified: user_data.status === PROFILE_STATUS.VERIFIED,
    user: user_data,
  };

  const services: Service[] = Object.entries(trip.services).map(
    ([key, service]) => ({
      id: service.id,
      wage: service.cost.wage,
      weight: service.properties.weight,
      type: serviceNameMapping[key],
      description: service.description,
    }),
  );

  const selectedService = services.find((service) => service.id === serviceId);

  const selectedServiceInfo = {
    description: selectedService?.description || "",
    type: selectedService?.type || "",
  };
  const hanldeOpenPreviewRequest = () => {
    if (window.ReactNativeWebView) {
      const message = JSON.stringify({
        message: "SIGN_IN",
      });
      window.ReactNativeWebView.postMessage(message);
      return;
    } else {
      if (!isLoggedIn) {
        const params = new URLSearchParams(searchParams.toString());
        params.set(
          "redirect",
          window.location.pathname + "?" + searchParams.toString(),
        );
        push(`${AUTH_ROUTES.signin}?${params.toString()}`);
        return;
      }
    }

    toggleReviewModal();
  };

  return (
    <div className="p-12 space-y-16 bg-surface-container-lowest rounded-small">
      <div className="flex flex-col gap-24 xl:gap-0 xl:items-center xl:justify-between xl:flex-row">
        <div className="space-y-16">
          <PassengerInfo {...passengerInfo} />
          <FlightInfo flight={trip.flight} description={trip.description} />
        </div>
        <ServicesInfo
          services={services}
          serviceId={serviceId}
          setServiceId={setServiceId}
        />
      </div>
      <Divider />
      <ActionBar
        selectedServiceInfo={selectedServiceInfo}
        onOpenReviewModal={hanldeOpenPreviewRequest}
      />
      <Modal open={openReviewModal} onClose={toggleReviewModal}>
        <TripRequest
          {...passengerInfo}
          flight={trip.flight}
          description={trip.description}
          service={services.find((service) => service.id === serviceId)}
          onClose={toggleReviewModal}
          callback={toggleSuccessModal}
        />
      </Modal>

      <Modal open={openSuccessModal} onClose={toggleSuccessModal}>
        <SuccessFullRequestSent onClose={toggleSuccessModal} />
      </Modal>
    </div>
  );
};

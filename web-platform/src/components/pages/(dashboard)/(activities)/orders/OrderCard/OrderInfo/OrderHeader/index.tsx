import { Dimensions } from "@/components/shared";

import { OrderCardProps } from "../../types";

export const OrderHeader = (props: OrderCardProps) => {
  return (
    <div className="space-y-6 md:flex md:flex-col h-full">
      <div className="text-outline text-label-medium ">
        Order ID:{props.order.order_id}
      </div>
      <div className="text-on-surface first-letter:uppercase text-title-medium truncate hover:text-primary duration-200">
        {props.order.order_name}
      </div>
      <div className="grow items-end md:flex hidden">
        <Dimensions
          properties={props.order.order_properties}
          itemClassName="flex-row"
          className="mt-auto"
        />
      </div>
    </div>
  );
};

import { Icon } from "@/components/shared";
import { DEFAULT_CURRENCY } from "@/utils";

import { OrderCardProps } from "../../types";

export const OrderProgress = (props: OrderCardProps) => {
  const { order_role, order_deal } = props.order;
  return (
    <div className="border border-surface-container-high rounded-medium p-16 space-y-12 ">
      <div>
        <div className="text-label-large text-on-surface text-center md:text-start">
          Payment
        </div>
        <div className="text-label-medium text-on-surface text-center md:text-start">
          {order_role === "CUSTOMER" ? (
            <>
              You should pay{" "}
              <span className="text-label-large">
                {DEFAULT_CURRENCY.symbol}
                {order_deal.cost}
              </span>{" "}
              to traveler
            </>
          ) : (
            <>
              Wait for the sender to pay{" "}
              <span className="text-label-large">
                {DEFAULT_CURRENCY.symbol}
                {order_deal.cost}
              </span>
              .
            </>
          )}
        </div>
      </div>
      <div className="flex gap-8 w-full items-center">
        <Icon name="dollar badge" className="text-[24px] text-primary" />
        <div className="bg-primary-opacity-16 rounded-medium h-4 w-full"></div>
        <Icon name="plane take off line" className="text-[24px] text-outline" />
        <div className="bg-primary-opacity-16 rounded-medium h-4 w-full"></div>

        <Icon name="plane landing line" className="text-[24px] text-outline" />
        <div className="bg-primary-opacity-16 rounded-medium h-4 w-full"></div>
        <Icon name="flag" className="text-[24px] text-outline" />
      </div>
    </div>
  );
};

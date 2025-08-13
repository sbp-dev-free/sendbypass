import { OrderCardProps } from "../types";

import { OrderHeader } from "./OrderHeader";
import { OrderProgress } from "./OrderProgress";
import { OrderTimeLine } from "./OrderTimeLine";

export const OrderInfo = (props: OrderCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 md:grid-rows-2 gap-4 pb-12">
      <div className="order-1 md:row-start-1 md:col-start-1 md:col-end-7">
        <OrderHeader {...props} />
      </div>
      <div className="order-3 md:row-start-2 md:col-start-1 md:col-end-7">
        <OrderProgress {...props} />
      </div>
      <div className="order-2 md:row-span-2 md:col-start-7 md:row-start-1 md:col-end-11">
        <OrderTimeLine {...props} />
      </div>
    </div>
  );
};

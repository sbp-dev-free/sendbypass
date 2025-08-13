import { OrderCardProps } from "../types";

import { Status } from "./Status";
export const Header = ({ order }: OrderCardProps) => {
  return (
    <div className="flex justify-between pb-8">
      <div className="py-8 px-16 first-letter:uppercase rounded-tl-medium rounded-br-medium  bg-primary-opacity-8 text-label-medium text-on-surface ">
        {order.order_type.toLowerCase()}
      </div>
      <Status status={order.order_status} />
    </div>
  );
};

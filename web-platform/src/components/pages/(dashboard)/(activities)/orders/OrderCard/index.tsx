import { ActionBar } from "./ActionBar";
import { Header } from "./Header";
import { OrderInfo } from "./OrderInfo";
import { OrderCardProps } from "./types";

export const OrderCard = (props: OrderCardProps) => {
  return (
    <div className="relative border border-surface-container-high rounded-medium">
      <Header {...props} />
      <div className="px-16 pb-16">
        <OrderInfo {...props} />
        <ActionBar {...props} />
      </div>
    </div>
  );
};

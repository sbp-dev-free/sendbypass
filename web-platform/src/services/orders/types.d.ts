import { Order, PaginatedOrderList, Profile, Properties, Trip } from "@/types";

export interface TransformedOrder extends Order {
  order_type: Order["requirement_data"]["type"];
  order_status: Order["requirement_data"]["status"];
  order_id: Order.id;
  order_name: Order["requirement_data"]["name"];
  order_role: Order["role"];
  order_origin: string;
  order_destination: string;
  order_traveler_sender: Profile;
  order_properties: Properties;
  order_flight_data: Trip;
  order_deal: Order["deal"];
}
export interface TransomedPaginatedOrderList
  extends Omit<PaginatedOrderList, "results"> {
  results: Array<TransformedOrder>;
}

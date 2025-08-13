import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, View } from "react-native";
import NavbarItem from "./NavbarItem";
import { INavbarItem, NavbarProps } from "./types";

const NAVBAR_ITEMS: INavbarItem[] = [
  {
    key: "trips",
    title: "Trips",
    icon: "airplane-takeoff",
    route: "/dashboard/trips",
  },
  {
    key: "needs",
    title: "Needs",
    icon: "view-grid-plus-outline",
    route: "/dashboard/needs",
  },
  {
    key: "connect-hub",
    title: "Connect hub",
    icon: "hubspot",
    route: "/connect-hub/request-to-passengers",
  },
  {
    key: "requests",
    title: "Requests",
    icon: "send-outline",
    route: "/dashboard/requests",
  },
  {
    key: "orders",
    title: "Orders",
    icon: "bookmark-box-multiple-outline",
    route: "/dashboard/orders",
  },
];

const Navbar = ({
  currentRoute,
  handleNavigate,
  handleToggleBottomSheet,
}: NavbarProps) => {
  return (
    <View style={styles.container}>
      {NAVBAR_ITEMS.map((item) => (
        <NavbarItem
          key={item.key}
          isActive={currentRoute === item.route}
          item={item}
          handleNavigate={(route) => {
            handleNavigate(route);
            handleToggleBottomSheet(false);
          }}
        />
      ))}
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    height: 80,
    backgroundColor: Colors.surface.container_low,
  },
});

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavbarItemProps } from "./types";
import { Colors } from "@/constants/Colors";
import { Icon } from "react-native-paper";

const NavbarItem = ({ isActive, item, handleNavigate }: NavbarItemProps) => {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleNavigate(item.route)}
    >
      <View
        style={[
          styles.iconWrapper,
          {
            backgroundColor: isActive
              ? Colors.primary_container
              : Colors.surface.container_low,
          },
        ]}
      >
        <Icon size={24} source={item.icon} color={Colors.onSurface} />
      </View>
      <Text
        style={{
          color: isActive ? Colors.onSurface : Colors.outline,
          fontWeight: isActive ? 700 : 500,
          ...styles.itemText,
        }}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

export default NavbarItem;

const styles = StyleSheet.create({
  itemContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 12,
    lineHeight: 16,
  },
  iconWrapper: {
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
});

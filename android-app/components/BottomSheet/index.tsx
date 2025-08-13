import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { BottomSheetProps } from "./types";
import { Colors } from "@/constants/Colors";
import { Icon } from "react-native-paper";
import { useAuth } from "@/context/authContext";
import SignIn from "./SignIn";
import Profile from "./Profile";
import { INavbarItem } from "../Navbar/types";
import NavLink from "./NavLink";
import { useEffect, useMemo, useRef } from "react";

const screenHeight = Dimensions.get("window").height;

const BottomSheet = ({
  handleNavigate,
  isOpen,
  handleToggleBottomSheet,
}: BottomSheetProps) => {
  const {
    state: { profile },
    signOut,
  } = useAuth();

  const links = useMemo<(INavbarItem & { isHidden?: boolean })[]>(
    () => [
      {
        icon: "account-outline",
        title: "Profile",
        route: "/dashboard/profile",
        key: "profile",
        isHidden: !profile,
      },
      { icon: "progress-question", title: "FAQ", route: "/faq", key: "faq" },
      {
        icon: "shield-check-outline",
        title: "Security",
        route: "/security",
        key: "security",
      },
      {
        icon: "city-variant-outline",
        title: "About us",
        route: "/about-us",
        key: "about-us",
      },
      {
        icon: "email-minus-outline",
        title: "Contact us",
        route: "/contact-us",
        key: "contact-use",
      },
    ],
    [profile]
  );

  const signOutItem: INavbarItem = {
    icon: "logout",
    title: "Logout",
    route: "/",
    key: "logout",
  };

  const translateY = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen]);

  return (
    <View style={{ position: "absolute", width: "100%", height: "100%" }}>
      <TouchableOpacity
        style={styles.backdrop}
        onPress={() => handleToggleBottomSheet(false)}
      ></TouchableOpacity>
      <Animated.View
        style={[styles.container, { transform: [{ translateY }] }]}
      >
        <View style={styles.sheet}>
          <View style={styles.sheetHandleContainer}>
            <View style={styles.sheetHandle}></View>
            <TouchableOpacity
              style={styles.sheetHandleIcon}
              onPress={() => handleToggleBottomSheet(false)}
            >
              <Icon size={20} source="close" color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.sheetContent}>
            {profile ? <Profile /> : <SignIn />}
            {links
              .filter((item) => !item.isHidden)
              .map(({ isHidden, ...item }) => (
                <NavLink
                  key={item.key}
                  item={item}
                  onPress={() => {
                    handleNavigate(item.route);
                    handleToggleBottomSheet(false);
                  }}
                />
              ))}
            <View style={styles.line}></View>
            {profile && <NavLink item={signOutItem} onPress={signOut} />}
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  backdrop: {
    width: "100%",
    height: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  container: {
    position: "absolute",
    bottom: 0,
    maxHeight: screenHeight * 0.8,
    width: "100%",
    paddingHorizontal: 10,
  },
  sheet: {
    backgroundColor: Colors.surface.container_lowest,
    borderTopStartRadius: 28,
    borderTopEndRadius: 28,
    width: "100%",
  },
  sheetHandleContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  sheetHandle: {
    backgroundColor: Colors.outline,
    width: 32,
    height: 4,
    borderRadius: 100,
  },
  sheetHandleIcon: {
    position: "absolute",
    right: 16,
  },
  sheetContent: {
    paddingHorizontal: 16,
  },
  line: {
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface.container_high,
  },
});

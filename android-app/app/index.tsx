import { StyleSheet } from "react-native";
import React, { useState } from "react";

import { Colors } from "@/constants/Colors";
import Navbar from "@/components/Navbar";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import BottomSheet from "@/components/BottomSheet";
import AuthScreen from "@/utils/AuthScreen";
import WebviewContainer from "@/components/WebviewContainer";

const RootPage = () => {
  const [currentRoute, setCurrentRoute] = useState<`/${string}`>(
    "/connect-hub/request-to-passengers"
  );
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleToggleBottomSheet = (value: boolean) => {
    setIsBottomSheetOpen(value);
  };

  const handleNavigate = (route: `/${string}`) => {
    setCurrentRoute(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header handleToggleBottomSheet={handleToggleBottomSheet} />
      <WebviewContainer
        handleNavigate={handleNavigate}
        handleToggleBottomSheet={handleToggleBottomSheet}
        currentRoute={currentRoute}
      />
      <Navbar
        handleNavigate={handleNavigate}
        handleToggleBottomSheet={handleToggleBottomSheet}
        currentRoute={currentRoute}
      />
      {isBottomSheetOpen && (
        <BottomSheet
          handleNavigate={handleNavigate}
          handleToggleBottomSheet={handleToggleBottomSheet}
          isOpen={isBottomSheetOpen}
        />
      )}
      <AuthScreen handleToggleBottomSheet={handleToggleBottomSheet} />
    </SafeAreaView>
  );
};

export default RootPage;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: Colors.background,
    position: "relative",
  },
  webviewContainer: {
    flexGrow: 1,
  },
});

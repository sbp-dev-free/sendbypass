import React, { useCallback, useEffect, useRef, useState } from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { WEBVIEW_URL } from "@/constants/Urls";
import { ActivityIndicator, BackHandler, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { WebviewContainerProps } from "./types";
import { useAuth } from "@/context/authContext";

const WebviewContainer = ({
  currentRoute,
  handleToggleBottomSheet,
  handleNavigate,
}: WebviewContainerProps) => {
  const webViewRef = useRef<WebView | null>(null);

  const handleBackButtonClick = useCallback(() => {
    webViewRef.current?.goBack();
    return true;
  }, []);



  const [isWebviewLoading, setIsWebviewLoading] = useState(false);

  const {
    state: { access, refresh },
    signOut,
    setTokens,
  } = useAuth();

  useEffect(() => {
    setIsWebviewLoading(true);
  }, [currentRoute]);

  useEffect(() => {
    const handleTokenInjectionToWebview = () => {
      const date = new Date();
      date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
      const jsToInject = `
          document.cookie = "access=${
            access || ""
          }; path=/; expires=${date.toUTCString()}";
          document.cookie = "refresh=${
            refresh || ""
          }; path=/; expires=${date.toUTCString()}";
      `;

      webViewRef.current?.injectJavaScript(jsToInject);
    };

    if (!isWebviewLoading) handleTokenInjectionToWebview();
  }, [access, refresh, isWebviewLoading]);

  function onWebviewMessage(event: WebViewMessageEvent) {
    const data = JSON.parse(event.nativeEvent.data);

    if (data?.message === "TOKEN_EXPIRED") signOut();
    else if (data?.message === "SIGN_IN") {
      handleNavigate("/connect-hub/request-to-passengers");
      handleToggleBottomSheet(true);
    } else if (data?.message === "TOKEN") {
      setTokens(data?.data?.access, data?.data?.refresh);
    }
  }
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, [handleBackButtonClick]);
  return (
    <>
      {isWebviewLoading && (
        <View
          style={{
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{
          uri: WEBVIEW_URL + currentRoute,
        }}
        onLoadEnd={() => setIsWebviewLoading(false)} // Triggers on both success & failure
        onError={() => setIsWebviewLoading(false)}
        onMessage={onWebviewMessage}
      />
    </>
  );
};

export default WebviewContainer;

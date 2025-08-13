import { Colors } from "@/constants/Colors";
import { APP_URL, WEBVIEW_URL } from "@/constants/Urls";
import { Link } from "expo-router";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SignIn = () => {
  const handleOpenBrowser = () => {
    Linking.openURL(`${WEBVIEW_URL}/sign-in?redirect=/&source=${APP_URL}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>Your Profile</Text>
      <Text style={styles.textSubtitle}>
        Sign in to begin your journey with Sendbypass
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleOpenBrowser}>
        <Text style={styles.textButton}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.textSubtitle}>
        Don’t have an account?{" "}
        <Link
          href={`${WEBVIEW_URL}/sign-up?redirect=/&source=${APP_URL}`}
          style={styles.textHighligh}
        >
          Sign Up
        </Link>
      </Text>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  textTitle: {
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.onSurface,
  },
  textSubtitle: {
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.onSurface_variant,
  },
  textHighligh: {
    color: Colors.primary,
    fontWeight: 500,
  },
  button: {
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: Colors.primary,
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 8,
  },
  textButton: {
    color: Colors.onPrimary,
    fontWeight: 500,
    fontSize: 14,
    lineHeight: 20,
  },
});

import "react-native-gesture-handler";
import { Stack } from "expo-router";
import "../global.css";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useRouter } from "expo-router";

const RootLayout = () => {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const router = useRouter();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" />
      <Stack.Screen name="home" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="screens" />
    </Stack>
  );
};

export default RootLayout;

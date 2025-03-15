import "react-native-gesture-handler";
import { Stack } from "expo-router";
import "../../global.css";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SearchProvider } from "@/context/adminSearchContext";
import { useRouter } from "expo-router";

const RootLayout = () => {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const router = useRouter();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="adminaddBranchCoordinator.tsx" />
    </Stack>
  );
};

export default RootLayout;

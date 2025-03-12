import "react-native-gesture-handler";
import { Stack } from "expo-router";
import "../../global.css";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SearchProvider } from "@/context/adminSearchContext";
import { useRouter } from "expo-router";
import { SubBranchProvider } from "@/context/newSubBranchContext";
const RootLayout = () => {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const router = useRouter();
  return (
    <SubBranchProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="NewSubBranchCoordinatorMap" />
        <Stack.Screen name="AddNewSubBranchCoordinator" />
      </Stack>
    </SubBranchProvider>
  );
};

export default RootLayout;

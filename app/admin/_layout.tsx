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
    <Stack
      initialRouteName="dashboard"
      screenOptions={{ headerShown: false }}>
    
        <Stack.Screen name="home" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="ManageCitizens" />
        <Stack.Screen name="ManageDepartments" />
        <Stack.Screen name="ManageSubDepCoordinators" />
        <Stack.Screen name="ManageDepartmentCoordinators" />
        <Stack.Screen name="ManageProposals" />
       
      
    </Stack>
  );
};

export default RootLayout;

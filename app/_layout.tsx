import "react-native-gesture-handler";
import { Stack } from "expo-router";
import "../global.css";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { SearchProvider } from "@/context/adminSearchContext";
import { NotificationProvider } from "@/context/NotificationsContext";
import { SocketProvider } from "@/hooks/SocketProvider";
const RootLayout = () => {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const router = useRouter();
  return (
    <NotificationProvider>
      <SocketProvider>
        <SearchProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="auth" />
              <Stack.Screen name="home" />
              <Stack.Screen name="welcome" />
              <Stack.Screen name="screens" />
              <Stack.Screen name="proposals" />
              <Stack.Screen name="admin" />
              <Stack.Screen name="branchCoordinators" />
              <Stack.Screen name="branchAnnouncement" />
              <Stack.Screen name="password" />
              <Stack.Screen name="manageSubBranch" />
              <Stack.Screen name="branchProposal" />
              <Stack.Screen name="addBranchCoordinator" />
              <Stack.Screen name="subBranchCoordinator" />
            </Stack>
          </GestureHandlerRootView>
        </SearchProvider>
      </SocketProvider>
    </NotificationProvider>
  );
};

export default RootLayout;

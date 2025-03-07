import "react-native-gesture-handler";
import { Stack } from "expo-router";
import { IssueProvider } from "@/context/IssueContext";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { SearchProvider } from "@/context/adminSearchContext";
import { AnnouncementProvider } from "@/context/AnnouncementContext";
const BranchLayout = () => {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const router = useRouter();
  return (
    <AnnouncementProvider>
      <SearchProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="branchAnnouncement" />
            <Stack.Screen name="AnnouncementMap" />
          </Stack>
        </GestureHandlerRootView>
      </SearchProvider>
    </AnnouncementProvider>
  );
};

export default BranchLayout;

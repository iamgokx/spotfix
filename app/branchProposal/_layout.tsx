import "react-native-gesture-handler";
import { Stack } from "expo-router";
import { IssueProvider } from "@/context/IssueContext";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { GovProposalProvider } from "@/context/govProposalContext";
const BranchLayout = () => {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const router = useRouter();
  return (
    <GovProposalProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="createProposal" />
          <Stack.Screen name="locationDetailsProposal" />
          <Stack.Screen name="branchMap" />
          <Stack.Screen name="branchMedia" />
        </Stack>
      </GestureHandlerRootView>
    </GovProposalProvider>
  );
};

export default BranchLayout;

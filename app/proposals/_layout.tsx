import { Stack } from "expo-router";

import { ProposalProvider } from "@/context/ProposalContext";
const ProposalLayout = () => {
  return (
    <ProposalProvider>
      <Stack
        
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="ProposalLocation" />
        <Stack.Screen name="Map" />
        <Stack.Screen name="ProposalMedia" />
        <Stack.Screen name="ProposalFIles" />
        <Stack.Screen name="SaveProposal" />
      </Stack>
    </ProposalProvider>
  );
};

export default ProposalLayout;

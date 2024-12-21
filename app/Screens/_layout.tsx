import { Stack } from "expo-router";

const DrawerLayout = () => {
  <Stack>
    <Stack.Screen  name="home" />
    <Stack.Screen name="DetailedIssue" />
    <Stack.Screen name="Feedback" />
    <Stack.Screen name="Help" />
    <Stack.Screen name="Profile" />
    <Stack.Screen name="YourIssues" />
    <Stack.Screen name="YourProposals" />
  </Stack>;
};

export default DrawerLayout;

import { Stack } from "expo-router";

const DrawerLayout = () => {
  return (
    <Stack
      // screenOptions={{
      //   headerShown: true,
      //   headerStyle: {
      //     backgroundColor: "#6200ea",
      //   },
      //   headerTintColor: "#fff",
      //   headerTitleStyle: {
      //     fontWeight: "bold",
      //     fontSize: 20,
      //   },
      //   headerShadowVisible: false,
      // }}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="DetailedIssue" />
      <Stack.Screen name="Feedback" />
      <Stack.Screen name="Help" />
      <Stack.Screen name="Profile" />
      <Stack.Screen name="UserIssues" />
      <Stack.Screen name="UserProposals" />
      <Stack.Screen name="UserSuggestions" />
      <Stack.Screen name="UserVotes" />
      <Stack.Screen name="UserSubscriptions" />
    </Stack>
  );
};

export default DrawerLayout;

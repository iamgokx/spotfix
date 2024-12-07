import { Stack } from "expo-router";

import { IssueProvider } from "@/context/IssueContext";
const IssueLayout = () => {
  return (
    <IssueProvider>
      <Stack
        initialRouteName="issue"
        screenOptions={{
          headerShown: false,
          animationDuration: 600,
          animation: "fade",
        }}>
        <Stack.Screen
          name="issue"
          options={{
            headerShown: false,
            title: "Log In",
            animationDuration: 600,
          }}
        />
        <Stack.Screen
          name="issueLocation"
          options={{
            headerShown: false,
            title: "Log In",
            animationDuration: 600,
          }}
        />
        <Stack.Screen
          name="IssueMap"
          options={{
            headerShown: false,
            title: "Sign Up",
            animationDuration: 600,
          }}
        />
        <Stack.Screen
          name="IssueMedia"
          options={{
            headerShown: false,
            title: "Map",
            animationDuration: 600,
          }}
        />
        <Stack.Screen
          name="SaveIssue"
          options={{
            headerShown: false,
            title: "password",
            animationDuration: 600,
          }}
        />
      </Stack>
    </IssueProvider>
  );
};

export default IssueLayout;

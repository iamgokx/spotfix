import { Stack } from "expo-router";
import { SignupProvider } from "@/context/SignupContext";
const AuthLayout = () => {
  return (
    <SignupProvider>
      <Stack initialRouteName="index">
        <Stack.Screen
          name="index"
          options={{ headerShown: false, title: "Log In" }}
        />
        <Stack.Screen
          name="signup"
          options={{
            headerShown: false,
            title: "Log In",
            animationDuration: 600,
          }}
        />
        <Stack.Screen
          name="useraddress"
          options={{
            headerShown: false,
            title: "Sign Up",
            animationDuration: 600,
          }}
        />
        <Stack.Screen
          name="map"
          options={{
            headerShown: false,
            title: "Map",
            animationDuration: 600,
          }}
        />
        <Stack.Screen
          name="password"
          options={{
            headerShown: false,
            title: "password",
            animationDuration: 600,
          }}
        />
        <Stack.Screen
          name="otp"
          options={{
            headerShown: false,
            title: "otp",
          }}
        />
        <Stack.Screen
          name="finalVerification"
          options={{
            headerShown: false,
            title: "otp",
          }}
        />
        <Stack.Screen
          name="IssueMapViewDep"
          options={{
            headerShown: false,
            title: "otp",
          }}
        />
      </Stack>
    </SignupProvider>
  );
};

export default AuthLayout;

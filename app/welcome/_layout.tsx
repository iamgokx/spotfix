import { NavigationContainer } from "@react-navigation/native";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    // <NavigationContainer>
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "Log In" }}
      />
    </Stack>
    // </NavigationContainer>
  );
};

export default AuthLayout;

import { Stack } from "expo-router";
import { ProfileProvider } from "@/context/profileContext";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomHeaderEditDepartment from "@/components/admin/CustomHeaderEditDepartment";
const PasswordLayout = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  return (
    <ProfileProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: currentColors.backgroundDarker,
          },
          headerTintColor: currentColors.secondary,
          headerTitleStyle: { fontSize: 20, fontWeight: "bold" },
          headerShown: false,
          headerTitleAlign: "center",
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="PasswordOtp" />
        <Stack.Screen name="newPassword" />
        <Stack.Screen name="userLogout" />
      </Stack>
    </ProfileProvider>
  );
};

export default PasswordLayout;

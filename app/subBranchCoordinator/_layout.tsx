import "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import CustomDrawerContent from "../../components/CustomDrawerContentSubBranch";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SubBranchLayout = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          backgroundColor: currentColors.backgroundDarker,
        },
        drawerActiveBackgroundColor: currentColors.secondary,
        drawerActiveTintColor: "white",
        drawerInactiveTintColor: currentColors.textShade,
        headerStyle: {
          backgroundColor: currentColors.backgroundDarker,
        },
        headerTintColor: currentColors.secondary,
        headerTitleAlign: "center",
        headerPressColor: currentColors.secondary,
      }}
      initialRouteName="Reports">
    
      <Drawer.Screen
        name="ApproveIssues"
        options={{
          title: "Manage Issues",
          drawerItemStyle: { marginBottom: 10 },
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="checkmark-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="CitizenFeedback"
        options={{
          title: "Citizen Feedback",
          drawerItemStyle: { marginBottom: 10 },
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="checkmark-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Reports"
        options={{
          title: "Resolved Cases",
          drawerItemStyle: { marginBottom: 10 },
          drawerIcon: ({ color, size }) => (
            <Ionicons name="file-tray-full" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
};

export default SubBranchLayout;

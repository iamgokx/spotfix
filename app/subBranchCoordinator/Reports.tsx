  import React from "react";
  import { View, Text } from "react-native";
  import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
  import { NavigationContainer } from "@react-navigation/native";
  import { NavigationIndependentTree } from "@react-navigation/native";


  import CompletedIssuesScreen from "../screens/CompletedIssuesScreen";
  import PendingIssues from "../screens/PendingIssues";

  import { Colors } from "@/constants/Colors";
  import { useColorScheme } from "react-native";
  const Tab = createMaterialTopTabNavigator();

  const Reports = () => {
    const colorScheme = useColorScheme();
    const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
    return (
      <NavigationIndependentTree>
        <NavigationContainer independent={true}>
          <Tab.Navigator
            screenOptions={{
              swipeEnabled:false,
              tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
              tabBarStyle: { backgroundColor: currentColors.backgroundDarker },
              tabBarIndicatorStyle: { backgroundColor: "#ffffff" },
              tabBarActiveTintColor: "#ffffff",
              tabBarInactiveTintColor: "#ddd",
            }}>
            <Tab.Screen name="Pending" component={PendingIssues} />
            <Tab.Screen name="Resolved" component={CompletedIssuesScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </NavigationIndependentTree>
    );
  };

  export default Reports;

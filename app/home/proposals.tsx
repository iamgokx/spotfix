import React from "react";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, Text } from "react-native";
import HomeUserProposals from "../screens/HomeUserProposals";
import HomeDepartmentProposals from "../screens/HomeDepartmentProposals";
const Tab = createMaterialTopTabNavigator();
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function App() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#6200ea",
          paddingTop: insets.top, // Add padding to the top of the tabs
          // height: 60, // Increase the height of the tab bar
        },
        tabBarLabelStyle: {
          fontSize: 16, // Increase font size
          fontWeight: "bold",
          paddingBottom: 5, // Add padding to the text inside the tab
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#ccc",
        tabBarIndicatorStyle: {
          backgroundColor: "#fff",
          height: 3,
        },
      }}>
      <Tab.Screen name="Public" component={HomeUserProposals} />
      <Tab.Screen name="Departments" component={HomeDepartmentProposals} />
    </Tab.Navigator>
  );
}

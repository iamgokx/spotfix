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
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
export default function App() {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: currentColors.backgroundDarkest,
      }}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: currentColors.backgroundDarker,
            paddingTop: insets.top,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            overflow: "hidden",
          },
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: "bold",
            paddingBottom: 5,
            color: currentColors.text,
          },
          tabBarActiveTintColor: "orange",
          tabBarInactiveTintColor: 'blue',
          tabBarIndicatorStyle: {
            backgroundColor: "orange",
            height: 3,
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
            width: "50%",
          },
        }}>
        <Tab.Screen name="Public" component={HomeUserProposals} />
        <Tab.Screen name="Departments" component={HomeDepartmentProposals} />
      </Tab.Navigator>
    </View>
  );
}

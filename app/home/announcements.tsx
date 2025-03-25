import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { View, Text } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UserSubscriptionAnnouncements from "../screens/UserSubscriptionAnnouncements";
import AnnoucnementsAll from "../screens/AnnoucnementsAll";

const Tab = createMaterialTopTabNavigator();

const TopTabNavigator = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: { fontSize: 14, fontWeight: "bold", paddingTop : insets.top + 5 },
            tabBarStyle: { backgroundColor: currentColors.background },
            tabBarActiveTintColor: currentColors.secondary,
            tabBarInactiveTintColor: "#BBB",
            tabBarIndicatorStyle: {
              backgroundColor: currentColors.secondary,
              height: 1,
            },
          }}>
          <Tab.Screen name="All" component={AnnoucnementsAll} />
          <Tab.Screen name="My Subscriptions" component={UserSubscriptionAnnouncements} />
        </Tab.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};

export default TopTabNavigator;

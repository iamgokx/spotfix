import React from "react";
import { View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import DepProposalScreen from "../screens/DepProposalScreen";
import HomeUserProposals from "../screens/HomeUserProposals";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
const Tab = createMaterialTopTabNavigator();
import { useSafeAreaInsets } from "react-native-safe-area-context";
const Proposals = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  return (
    <NavigationIndependentTree>
      <NavigationContainer independent={true}>
        <Tab.Navigator
          screenOptions={{
            swipeEnabled: false,
            tabBarStyle: { backgroundColor: currentColors.background, paddingTop : insets.top + 10 },
            tabBarLabelStyle: { color: "white", fontSize: 14 },
            tabBarIndicatorStyle: {
              backgroundColor: currentColors.secondary,
              height: 3,
            },
          }}>
          <Tab.Screen
            name="Department Proposals"
            component={DepProposalScreen}
          />
          <Tab.Screen name="Citizen Proposals" component={HomeUserProposals} />
        </Tab.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};

export default Proposals;

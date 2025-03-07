import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Colors } from "@/constants/Colors";

import Home from "../../app/branchCoordinators/Home";
import Reports from "../../app/branchCoordinators/Reports";
import Announcements from "../../app/branchCoordinators/Announcements";
import Proposals from "../../app/branchCoordinators/Proposals";
import TabBarButton from "../TabBarButton"; 

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabbar, { backgroundColor: currentColors.backgroundDarker, paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? "#0066ff" : "black"}
            label={label}
          />
        );
      })}
    </View>
  );
};

const CustomTabBarBranchCoordinator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Reports" component={Reports} />
      <Tab.Screen name="Announcements" component={Announcements} />
      <Tab.Screen name="Proposals" component={Proposals} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    width: "100%",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 10,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    elevation: 20,
  },
});

export default CustomTabBarBranchCoordinator;

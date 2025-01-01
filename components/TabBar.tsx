import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import TabBarButton from "./TabBarButton";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const insectsBottom = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.tabbar,
        {
          backgroundColor: currentColors.backgroundDarker,
          bottom: insectsBottom.bottom,
        },
      ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onLongPress={onLongPress}
            onPress={onPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? "#0066ff" : "black"}
            label={label}></TabBarButton>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    width: "100%",
    position: "absolute",

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 0,
    backgroundColor: "white",
    paddingVertical: 10,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,

    elevation: 20,
    // marginRight : 20,
    // marginLeft : 20,
  },
});

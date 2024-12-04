import { Pressable, StyleSheet } from "react-native";
import { icons } from "../constants/icons";
import React from "react";
import { Feather } from "@expo/vector-icons";

interface TabBarButtonProps {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  color: string;
  label: string;
  routeName: string;
}

const TabBarButton: React.FC<TabBarButtonProps> = ({
  onPress,
  isFocused,
  onLongPress,
  routeName,
  color,
}: any) => {
 
  const noColorChange = routeName === "reportIssue";

 
  const iconFunction =
    icons[routeName] || (() => <Feather name="help-circle" size={24} />);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.tabBarItem,
        {
          backgroundColor:
            isFocused && !noColorChange ? "#0066ff" : "white",
        },
      ]}
    >
      {iconFunction({
        color: isFocused && !noColorChange ? "white" : "black", 
      })}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tabBarItem: {
    width: 45,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    borderRadius: 40,
    paddingVertical: 10,
  },
});

export default TabBarButton;

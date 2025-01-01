import { Pressable, StyleSheet } from "react-native";
import { icons } from "../constants/icons";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
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
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
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
            isFocused && !noColorChange
              ? currentColors.secondary
              : currentColors.backgroundDarker,
        },
      ]}>
      {iconFunction({
        isActive: isFocused,
        color: isFocused ? 'white' : currentColors.text,
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



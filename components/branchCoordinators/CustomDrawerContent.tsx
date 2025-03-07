import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
const CustomDrawerContent = (props) => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: currentColors.background }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Hello Gokul Lekhwar</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,

  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CustomDrawerContent;

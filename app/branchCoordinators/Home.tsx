import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
const Home = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentColors.backgroundDarkest },
      ]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 10,
            backgroundColor: currentColors.background,
          },
        ]}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Feather name="menu" size={24} color={currentColors.secondary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentColors.secondary }]}>
          Welcome Gokul
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={{ color: "white" }}>Welcome to Home Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "white",
    elevation: 4,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Home;

import { View, Text } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useState, useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  CurrentRenderContext,
  NavigationContainer,
} from "@react-navigation/native";
import { TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { NavigationIndependentTree } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PendingFeedback from "@/components/PendingFeedback";
import CompletedFeedback from "@/components/CompletedFeedback";
const Tab = createMaterialTopTabNavigator();
import { useRouter } from "expo-router";
import { hide } from "expo-splash-screen";
const Feedback = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <View
          style={{
            flex: 1,
            backgroundColor: currentColors.backgroundDarkest,
          }}>
          <View
            style={{
              width: "100%",
              padding: 10,
              paddingTop: insets.top + 10,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: currentColors.backgroundDarker,
            }}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ position: "absolute", left: 10 }}>
                <Ionicons
                  name={"chevron-back"}
                  color={currentColors.secondary}
                  size={24}
                />
              </TouchableOpacity>
              <Text style={{ color: currentColors.text, fontSize: 20 }}>
                Feedback
              </Text>
            </View>
          </View>
          <Tab.Navigator
            screenOptions={{
              swipeEnabled: false,
              tabBarIndicatorStyle: {
                backgroundColor: currentColors.secondary,
              },
              tabBarLabelStyle: {
                fontSize: 14,
                fontWeight: "bold",
                color: currentColors.text,
              },
              tabBarStyle: {
                backgroundColor: currentColors.backgroundDarker,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                overflow: "hidden",
              },
            }}>
            <Tab.Screen name="Pending" component={PendingFeedback} />
            <Tab.Screen name="Replied" component={CompletedFeedback} />
          </Tab.Navigator>
        </View>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};
export default Feedback;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  address: {
    fontSize: 12,
    color: "gray",
  },
  statusContainer: {
    backgroundColor: "#E3F2FD",
    alignSelf: "flex-start",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  status: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { CurrentRenderContext } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { getStoredData, clearStorage } from "@/hooks/useJwt";
import { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import blueBg from "../assets/images/gradients/bluegradient.png";
import { blue } from "react-native-reanimated/lib/typescript/Colors";

const CustomDrawerContentSubBranch = (props) => {
  const [user, setuser] = useState();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  useEffect(() => {
    const getuser = async () => {
      const user = await getStoredData();
      setuser(user);
    };

    getuser();
  }, []);

  const handleLogOut = () => {
    clearStorage();
    router.replace("/auth");
  };

  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  return (
    <View style={{ flex: 1, padding: 0 }}>
      <ImageBackground
        source={blueBg}
        style={{
          padding: 20,
          alignItems: "flex-start",
          backgroundColor: currentColors.background,
          paddingTop: insets.top + 50,
        }}>
        <Ionicons
          name="person-circle-outline"
          size={60}
          color={currentColors.text}
        />
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginTop: 10,
            color: "white",
          }}>
          {user ? user.name : "Loading..."}
        </Text>
        <Text style={{ color: "white" }}>
          {user ? user.email : "Loading..."}
        </Text>
        <Text style={{ color: "white" }}>Sub Branch Coordinator</Text>
      </ImageBackground>

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />

        <TouchableOpacity
          onPress={handleLogOut}
          style={{
            padding: 10,
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 30,
            marginTop: 20,
          }}>
          <Ionicons name="log-out" size={24} color={"orange"} />
          <Text>Log Out</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawerContentSubBranch;

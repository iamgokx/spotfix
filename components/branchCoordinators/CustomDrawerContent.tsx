import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getStoredData } from "@/hooks/useJwt";
import { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import bluebg from "../../assets/images/gradients/bluegradient.png";
const CustomDrawerContent = (props) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [userDetails, setuserDetails] = useState();
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => router.replace("/auth") },
    ]);
  };

  useEffect(() => {
    const getUserDetails = async () => {
      const user = await getStoredData();
      console.log(user);
      setuserDetails(user);
    };
    getUserDetails();
  }, []);

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: currentColors.backgroundDarker }}>
      <ImageBackground
        source={bluebg}
        style={{
          padding: 10,
          paddingTop: insets.top + 10,
          backgroundColor: currentColors.background,
          borderRadius: 20,
          marginBottom: 30,
          overflow: "hidden",
        }}>
        {userDetails && (
          <>
            <Text
              style={{
                color: currentColors.text,
                fontWeight: 900,
                fontSize: 18,
              }}>
              Hello {userDetails.name}
            </Text>

            <Text style={{ color: currentColors.text }}>
              {userDetails.userType == "department_coordinator"
                ? "Department Coordinator"
                : ""}
            </Text>
          </>
        )}
      </ImageBackground>
      <DrawerItemList {...props} />

      <View style={{}}>
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            backgroundColor: "white",
            paddingVertical: 10,
            borderRadius: 30,
            justifyContent: "center",
            marginTop: 30,
          }}>
          <Ionicons name="exit" color={currentColors.secondary} size={24} />
          <Text style={{ color: currentColors.secondary }}>Logout</Text>
        </TouchableOpacity>
      </View>
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
  logoutContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: "tomato",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomDrawerContent;

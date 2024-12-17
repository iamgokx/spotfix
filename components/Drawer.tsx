import { View, Text } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import hero from "../assets/images/hero.jpg";
import gradient from "../assets/images/gradients/profileGradient.png";
import { ImageBackground, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getStoredData,
  getStoredRawToken,
  clearStorage,
} from "../hooks/useJwt";
import { useEffect } from "react";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { router } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
const CustomDrawer = (props: any) => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [user, setuser] = useState({
    name: "",
    email: "",
  });
  useEffect(() => {
    fetchUserData();
  }, []);
  const fetchUserData = async () => {
    const tokenFromStorage = await getStoredRawToken();
    const dToken = jwtDecode(tokenFromStorage);
    console.log("decoded :  ", dToken);
    setuser({
      name: dToken?.name,
      email: dToken?.email,
    });
  };

  const handleLogOutButtonPress = () => {
    clearStorage();
    router.push("/");
  };

  return (
    <View
      style={[
        styles.drawerContainer,
        { backgroundColor: currentColors.backgroundDarker },
      ]}>
      <View style={[styles.headerContainer]}>
        <ImageBackground
          resizeMode="cover"
          source={gradient}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}>
          <View style={{ width: "90%", marginBottom: 10,}}>
            <Image source={hero} style={styles.profileImage} />
            <Text
              className="text-white text-2xl font-extrabold"
              style={{ textTransform: "capitalize" }}>
              {user.name}
            </Text>
            <Text className="text-white text-l font-extralight">
              {user.email}
            </Text>
          </View>
        </ImageBackground>
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContainer}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Logout"
          labelStyle={{
            color: currentColors.secondary, // Adjust color if needed
            fontWeight: "bold",
          }}
          icon={({ color, size }) => (
            <Ionicons
              name="log-out-outline"
              size={size}
              color={currentColors.secondary}
            />
          )}
          style={{}}
          onPress={() => handleLogOutButtonPress()}
        />
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  scrollContainer: {
    flex: 1,
    margin: 0,
    padding: 0,
    width: "100%",
    overflow: "hidden",

    gap: 10,
  },
  headerContainer: {
    width: "100%",
    height: "25%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: "cover",
    marginBottom : 6
  },
  footer: {
    padding: 10,
    alignItems: "center",
  },
});
export default CustomDrawer;

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
import { API_IP_ADDRESS } from "../ipConfig.json";
import axios from "axios";
const CustomDrawer = (props: any) => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [user, setuser] = useState({
    name: "",
    email: "",
  });
  const [pfpimage, setImage] = useState();
  const fetchUserData = async () => {
    const tokenFromStorage = await getStoredRawToken();
    const dToken = jwtDecode(tokenFromStorage);
    console.log("decoded :  ", dToken);
    setuser({
      name: dToken?.name,
      email: dToken?.email,
    });
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!user.email) return;

    const getUserDetails = async () => {
      try {
        const response = await axios.post(
          `http://${API_IP_ADDRESS}:8000/api/users/getProfilePicture`,
          { email: user.email }
        );
        console.log("pfp img response : ", response.data[0].picture_name);
        setImage(response.data[0].picture_name);
      } catch (error) {
        console.error("Error getting user details from backend: ", error);
      }
    };

    getUserDetails();
  }, [user.email, pfpimage]);

  const handleLogOutButtonPress = () => {
    clearStorage();
    router.replace("/welcome");
  };
  // fetchUserData();

  return (
    <View
      style={[
        styles.drawerContainer,
        {
          backgroundColor: currentColors.backgroundDarker,
          zIndex: 5,
        },
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
          <View style={{ width: "90%", marginBottom: 10 }}>
            <Image
              source={
                pfpimage
                  ? {
                      uri: `http://${API_IP_ADDRESS}:8000/uploads/profile/${pfpimage}`,
                    }
                  : require("../assets/images/profile/defaultProfile.jpeg")
              }
              style={styles.profileImage}
            />
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
        contentContainerStyle={[styles.scrollContainer, { zIndex: 5 }]}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Logout"
          labelStyle={{
            color: currentColors.secondary,
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
    marginBottom: 6,
  },
  footer: {
    padding: 10,
    alignItems: "center",
  },
});
export default CustomDrawer;

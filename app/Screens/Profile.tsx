import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import hero from "../../assets/images/hero.jpg";
import { Image } from "react-native";
import { ImageBackground } from "react-native";
import Waves from "../../assets/images/blobs/waves.svg";
import * as Animatable from "react-native-animatable";
import { useRouter } from "expo-router";
import { Modal } from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold_Italic,
  Poppins_500Medium,
  Poppins_300Light,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import LottieView from "lottie-react-native";
import suggestions from "../../assets/images/profile/twoMessagesIncoming.json";
import votes from "../../assets/images/profile/votingArrows.json";
import issues from "../../assets/images/profile/notebookWritingUser.json";
import scales from "../../assets/images/profile/ssscales.png";
import notifications from "../../assets/images/profile/phoneVibratingNotification.json";
import { getStoredData, getStoredRawToken } from "@/hooks/useJwt";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

import { API_IP_ADDRESS } from "../../ipConfig.json";
import axios from "axios";
const ProfileScreen = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold_Italic,
    Poppins_500Medium,
    Poppins_300Light,
    Poppins_700Bold,
  });
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const [user, setUser] = useState({ name: "", email: "" });
  const [isModalActive, setModalActive] = useState(true);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const tokenFromStorage = await getStoredRawToken();
        const decodedToken = jwtDecode(tokenFromStorage);
        setUser({
          name: decodedToken?.name || "",
          email: decodedToken?.email || "",
        });
      } catch (error) {
        console.error("Error decoding token: ", error);
      }
    };

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
      } catch (error) {
        console.error("Error getting user details from backend: ", error);
      }
    };

    getUserDetails();
  }, [user.email]);

  const handleChangeProfilePictureClick = async () => {
    setModalActive(true);
  };

  const uploadProfilePicture = async () => {
    const formData = new FormData();
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/users/uploadProfilePicture`,
        { email: user.email }
      );
      console.log("ran");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentColors.backgroundDarker },
      ]}>
      <StatusBar translucent hidden />
      <Modal visible={isModalActive} animationType="slide">
        <View style={{ width: "90%", height: 400 }}>
          <Ionicons name="camera" />
          <Ionicons name="person" />
        </View>
      </Modal>
      <ImageBackground
        source={scales}
        style={{
          width: "100%",
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          overflow: "hidden",
        }}>
        <Animatable.View
          animation="fadeInDown"
          style={{
            paddingTop: insets.top,
            paddingBottom: 20,
            height: insets.top == 0 ? 100 : insets.top + 50,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",

            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}>
          <Ionicons
            onPress={() => router.back()}
            name="chevron-back"
            size={24}
            style={{ marginLeft: 15 }}
            color={"white"}
          />
          <Text
            style={{
              color: "white",
              fontFamily: "Poppins_700Bold",
              fontSize: 17,
              textAlign: "right",
              width: "50%",
              marginRight: 15,
            }}>
            My Profile
          </Text>
        </Animatable.View>
        <Animatable.View
          animation="fadeInUp"
          duration={600}
          style={{
            width: "100%",

            display: "flex",
            flexDirection: "column",
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}>
          <View style={{}}>
            <Image
              source={hero}
              style={{ borderRadius: 50, width: 100, height: 100 }}
            />
            <TouchableOpacity onPress={() => handleChangeProfilePictureClick()}>
              <Ionicons
                name="camera"
                size={24}
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  color: "white",
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ width: "100%" }}>
            <Text
              style={{
                width: "100%",
                color: "white",
                textAlign: "center",
                fontFamily: "Poppins_500Medium",
                fontSize: 25,
              }}>
              {user.name}
            </Text>
            <Text
              style={{
                width: "100%",
                color: "white",
                textAlign: "center",
                fontSize: 15,
                fontFamily: "Poppins_300Light",
              }}>
              {user.email}
            </Text>
          </View>
        </Animatable.View>
      </ImageBackground>

      <ScrollView
        contentContainerStyle={{
          width: "100%",
          alignItems: "center",
        }}>
        <View
          style={{
            width: "95%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            marginTop: 35,
          }}>
          <View style={{ width: "60%", padding: 10 }}>
            <Animatable.View
              animation="fadeInLeft"
              duration={700}
              style={{
                width: "100%",

                backgroundColor: "skyblue",
                padding: 10,
                borderRadius: 20,
                justifyContent: "space-between",
                overflow: "hidden",
              }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: 20,
                    width: "70%",
                  }}>
                  My {"\n"}Suggestions
                </Text>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: "30%",
                  }}>
                  <LottieView
                    source={suggestions}
                    autoPlay={true}
                    style={{ width: 70, height: 70 }}
                    loop
                  />
                </View>
              </View>
              <Text style={{ fontSize: 15 }}>See all your suggestions</Text>
              <TouchableOpacity
                onPress={() => router.push("/screens/UserSuggestions")}
                style={{ width: "100%", alignItems: "flex-end", marginTop: 5 }}>
                <Text
                  style={{
                    backgroundColor: "black",
                    width: 100,
                    padding: 10,
                    color: "white",
                    textAlign: "center",
                    borderRadius: 30,
                    fontSize: 15,
                    fontFamily: "Poppins_700Bold",
                  }}>
                  View
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          </View>
          <Animatable.View
            animation="fadeInRight"
            duration={700}
            style={{ width: "40%", padding: 10 }}>
            <View
              style={{
                width: "100%",

                backgroundColor: "yellow",
                padding: 10,
                borderRadius: 20,
                justifyContent: "space-between",
                overflow: "hidden",
              }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: 20,
                    width: "70%",
                  }}>
                  My {"\n"}Votes
                </Text>
                <View
                  style={{
                    width: "30%",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}>
                  <LottieView
                    source={votes}
                    autoPlay={true}
                    style={{
                      width: 70,
                      height: 70,
                      transform: [{ rotate: "90deg" }, { scale: 0.6 }],
                    }}
                    loop
                  />
                </View>
              </View>
              <Text style={{ fontSize: 15 }}>See all your Votes</Text>
              <TouchableOpacity
                onPress={() => router.push("/screens/UserVotes")}
                style={{ width: "100%", alignItems: "flex-end", marginTop: 5 }}>
                <Text
                  style={{
                    backgroundColor: "black",
                    width: 100,
                    padding: 10,
                    color: "white",
                    textAlign: "center",
                    borderRadius: 30,
                    fontSize: 15,
                    fontFamily: "Poppins_700Bold",
                  }}>
                  View
                </Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>

        <View
          style={{
            width: "95%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}>
          <Animatable.View
            animation="fadeInUp"
            duration={900}
            style={{ width: "100%", padding: 10 }}>
            <View
              style={{
                width: "100%",
                backgroundColor: "orange",
                padding: 10,
                borderRadius: 20,
                overflow: "hidden",
              }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: 20,
                    width: "70%",
                  }}>
                  My{"\n"}Reported{"\n"}Issues
                </Text>
                <LottieView
                  source={issues}
                  autoPlay={true}
                  style={{
                    width: 100,
                    height: 100,
                    transform: [{ scale: 1.4 }],
                  }}
                  loop
                />
              </View>
              <Text style={{ fontSize: 15 }}>See all your reported Issues</Text>
              <TouchableOpacity
                onPress={() => router.push("/screens/UserIssues")}
                style={{ width: "100%", alignItems: "flex-end", marginTop: 5 }}>
                <Text
                  style={{
                    backgroundColor: "black",
                    width: 100,
                    padding: 10,
                    color: "white",
                    textAlign: "center",
                    borderRadius: 30,
                    fontSize: 15,
                    fontFamily: "Poppins_700Bold",
                  }}>
                  View
                </Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>

        <View
          style={{
            width: "95%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}>
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            style={{ width: "100%", padding: 10 }}>
            <View
              style={{
                width: "100%",
                backgroundColor: "gray",
                padding: 10,
                borderRadius: 20,
                overflow: "hidden",
              }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontFamily: "Poppins_500Medium",
                    fontSize: 20,
                    width: "70%",
                  }}>
                  My{"\n"}Department{"\n"}Subscriptions
                </Text>
                <LottieView
                  source={notifications}
                  autoPlay={true}
                  style={{
                    width: 100,
                    height: 100,
                  }}
                  loop
                />
              </View>
              <Text style={{ fontSize: 15 }}>
                Edit Your Department Preferences
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/screens/UserSubscriptions")}
                style={{ width: "100%", alignItems: "flex-end", marginTop: 5 }}>
                <Text
                  style={{
                    backgroundColor: "black",
                    width: 100,
                    padding: 10,
                    color: "white",
                    textAlign: "center",
                    borderRadius: 30,
                    fontSize: 15,
                    fontFamily: "Poppins_700Bold",
                  }}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  text: {
    fontSize: 16,
    color: "black",
    marginVertical: 5,
  },
});

export default ProfileScreen;

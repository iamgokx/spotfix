import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { setStatusBarHidden, StatusBar } from "expo-status-bar";
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
import * as ImagePicker from "expo-image-picker";
import { getStoredData, getStoredRawToken } from "@/hooks/useJwt";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import socket from "@/hooks/useSocket";
import { useProfileContext } from "@/context/profileContext";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import axios from "axios";
import proposalsLottie from "../../assets/images/profile/personUsingLaptop.json";
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
  const [isModalActive, setModalActive] = useState(false);
  const [pfpimage, setImage] = useState();
  const [isPfploaded, setisPfploaded] = useState(false);
  const { addMedia, details, clearDetails } = useProfileContext();
  const [statusBarVisible, setStatusBarVisible] = useState(true);

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

  // TODO have to make my votes and my suggestion pages, and aldo the department subscriptions

  useEffect(() => {
    if (!user.email) return;

    const getUserDetails = async () => {
      try {
        const response = await axios.post(
          `http://${API_IP_ADDRESS}:8000/api/users/getProfilePicture`,
          { email: user.email }
        );
        console.log("pfp profile : ", response.data[0].picture_name);
        setImage(response.data[0].picture_name);
        setisPfploaded(true);
      } catch (error) {
        console.error("Error getting user details from backend: ", error);
      }
    };

    getUserDetails();
  }, [user.email, pfpimage]);

  const handleChangeProfilePictureClick = async () => {
    setModalActive(true);
    setStatusBarVisible(false);
  };
  const handleModalClose = () => {
    setModalActive(false);
    setStatusBarVisible(true);
  };

  const pickImage = async () => {
    console.log("before: ", details);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      result.assets.forEach((asset) => {
        addMedia({
          uri: asset.uri,
          type: asset.type === "video" ? "video" : "image",
        });
      });
      console.log("see this ok : ", details);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access camera is required!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      result.assets.forEach((asset) => {
        addMedia({
          uri: asset.uri,
          type: asset.type === "video" ? "video" : "image",
        });
      });
      console.log("see this ok : ", details);
    }
  };

  const uploadProfilePicture = async () => {
    try {
      const formData = new FormData();

      formData.append("image", {
        uri: details.media[0].uri.startsWith("file://")
          ? details.media[0].uri
          : `file://${details.media[0].uri}`,
        type: "image/jpeg",
        name: "profile.jpg",
      });
      formData.append("email", user.email);

      for (let [key, value] of formData.entries()) {
        console.log(`form data ${key}:`, value);
      }
      console.log("this ran 1");
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/users/pfpUpload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      clearDetails();
      setImage();

      console.log("response : ", response.data);
      handleModalClose();
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  useEffect(() => {
    if (details.media && details.media.length > 0) {
      uploadProfilePicture();
    }
  }, [details.media]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentColors.backgroundDarker },
      ]}>
      <StatusBar hidden={true} style={"dark"} backgroundColor="black" />

      {isPfploaded && (
        <>
          <ImageBackground
            source={scales}
            style={{
              width: "100%",
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
              overflow: "hidden",
              elevation: 20,
            }}>
            <View
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
            </View>
            <View
              style={{
                width: "100%",

                display: "flex",
                flexDirection: "column",
                padding: 20,
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}>
              <View>
                <Image
                  source={
                    pfpimage
                      ? {
                          uri: `http://${API_IP_ADDRESS}:8000/uploads/profile/${pfpimage}`,
                        }
                      : require("../../assets/images/profile/defaultProfile.jpeg")
                  }
                  style={{ borderRadius: 50, width: 100, height: 100 }}
                />

                <TouchableOpacity
                  onPress={() => handleChangeProfilePictureClick()}>
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
            </View>
          </ImageBackground>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              width: "100%",
              alignItems: "center",
              paddingBottom: 10,
              opacity: isModalActive ? 0.5 : 1,
            }}>
            <Modal visible={isModalActive} transparent animationType="fade">
              <TouchableWithoutFeedback onPress={() => handleModalClose()}>
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    // justifyContent: "flex-end",
                    alignItems: "center",
                  }}>
                  <TouchableWithoutFeedback>
                    <View
                      style={{
                        width: "90%",
                        backgroundColor: currentColors.background,
                        padding: 10,
                        // borderTopLeftRadius : 20,
                        // borderTopRightRadius : 20,
                        borderRadius: 20,
                        elevation: 50,
                        paddingBottom: insets.bottom == 0 ? 10 : insets.bottom,
                      }}>
                      <View
                        style={{
                          justifyContent: "flex-end",
                          alignItems: "flex-end",
                        }}>
                        <Ionicons
                          name="close"
                          size={24}
                          onPress={() => handleModalClose()}
                          color={currentColors.secondary}
                          style={{ alignSelf: "flex-end" }}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-around",
                          paddingVertical: 40,
                        }}>
                        <TouchableOpacity
                          onPress={takePhoto}
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                          <Ionicons
                            name="camera"
                            size={25}
                            color={currentColors.secondary}
                          />
                          <Text style={{ color: currentColors.text }}>
                            Click Picture
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={pickImage}
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                          <Ionicons
                            name="image"
                            size={25}
                            color={currentColors.secondary}
                          />
                          <Text style={{ color: currentColors.text }}>
                            Choose from gallery
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            <View
              style={{
                width: "95%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                marginTop: 35,
              }}>
              <Animatable.View
                animation="slideInLeft"
                style={{ width: "60%", padding: 10 }}>
                <View
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
                    style={{
                      width: "100%",
                      alignItems: "flex-end",
                      marginTop: 5,
                    }}>
                    <Text
                      style={{
                        backgroundColor: currentColors.textSecondary,
                        width: 100,
                        padding: 10,
                        color: currentColors.text,
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
              <Animatable.View
                animation="slideInRight"
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
                    style={{
                      width: "100%",
                      alignItems: "flex-end",
                      marginTop: 5,
                    }}>
                    <Text
                      style={{
                        backgroundColor: currentColors.textSecondary,
                        width: 100,
                        padding: 10,
                        color: currentColors.text,
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
            <Animatable.View
              animation="slideInUp"
              style={{
                width: "95%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}>
              <View style={{ width: "100%", padding: 10 }}>
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
                  <Text style={{ fontSize: 15 }}>
                    See all your reported Issues
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/screens/UserIssues")}
                    style={{
                      width: "100%",
                      alignItems: "flex-end",
                      marginTop: 5,
                    }}>
                    <Text
                      style={{
                        backgroundColor: currentColors.textSecondary,
                        color: currentColors.text,
                        width: 100,
                        padding: 10,
                        textAlign: "center",
                        borderRadius: 30,
                        fontSize: 15,
                        fontFamily: "Poppins_700Bold",
                      }}>
                      View
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animatable.View>
            <Animatable.View
              animation="slideInUp"
              style={{
                width: "95%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}>
              <View style={{ width: "100%", padding: 10 }}>
                <View
                  style={{
                    width: "100%",
                    backgroundColor: "#009CF6",
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
                      My{"\n"}Proposals
                    </Text>
                    <LottieView
                      source={proposalsLottie}
                      autoPlay={true}
                      style={{
                        width: 100,
                        height: 100,
                        transform: [{ scale: 1.4 }],
                      }}
                      loop
                    />
                  </View>
                  <Text style={{ fontSize: 15 }}>See all your proposals</Text>
                  <TouchableOpacity
                    onPress={() => router.push("/screens/UserProposals")}
                    style={{
                      width: "100%",
                      alignItems: "flex-end",
                      marginTop: 5,
                    }}>
                    <Text
                      style={{
                        backgroundColor: currentColors.textSecondary,
                        color: currentColors.text,
                        width: 100,
                        padding: 10,
                        textAlign: "center",
                        borderRadius: 30,
                        fontSize: 15,
                        fontFamily: "Poppins_700Bold",
                      }}>
                      View
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animatable.View>
            <Animatable.View
              animation="slideInUp"
              style={{
                width: "95%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}>
              <View style={{ width: "100%", padding: 10 }}>
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
                    style={{
                      width: "100%",
                      alignItems: "flex-end",
                      marginTop: 5,
                    }}>
                    <Text
                      style={{
                        backgroundColor: currentColors.textSecondary,
                        color: currentColors.text,
                        width: 100,
                        padding: 10,
                        textAlign: "center",
                        borderRadius: 30,
                        fontSize: 15,
                        fontFamily: "Poppins_700Bold",
                      }}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animatable.View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },

  text: {
    fontSize: 16,
    color: "black",
    marginVertical: 5,
  },
});

export default ProfileScreen;

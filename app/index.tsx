import "../gesture-handler";
import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  StatusBar as RNStatusBar,
  ImageBackground,
  Pressable,
  TouchableOpacity,
} from "react-native";
import socket from "@/hooks/useSocket";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";
import welcomePageOne from "../assets/images/welcome/welcomePageOne.json";
import welcomePageTwo from "../assets/images/welcome/welcomePageTwo.json";
import welcomePageThree from "../assets/images/welcome/welcomePageThree.json";
import welcomePageFour from "../assets/images/welcome/welcomePageFour.json";
import welcomePageFive from "../assets/images/welcome/welcomePageFIve.json";
import Swiper from "react-native-swiper";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
const { width, height } = Dimensions.get("window");
import { Colors } from "../constants/Colors";
import { useColorScheme } from "react-native";
import { useState } from "react";
import {
  Poppins_100Thin_Italic,
  Poppins_600SemiBold,
  Poppins_400Regular,
  Poppins_300Light,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";
import {
  getStoredData,
  getStoredRawToken,
  clearStorage,
} from "../hooks/useJwt";
import axios from "axios";
import { API_IP_ADDRESS } from "../ipConfig.json";
import useLogin from "@/hooks/useLogin";
import loading from "../assets/images/welcome/loading.json";
const Index = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const router = useRouter();
  const [isLoading, setisLoading] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  const [fontsLoaded] = useFonts({
    Poppins_100Thin_Italic,
    Poppins_600SemiBold,
    Poppins_400Regular,
    Poppins_300Light,
    Poppins_800ExtraBold,
  });
  useEffect(() => {
    if (Platform.OS === "android") {
      RNStatusBar.setBackgroundColor("#fff");
      RNStatusBar.setBarStyle("dark-content");
    }

    async function prepare() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  const handleGetStarted = () => {
    setIsPressed(true);
    router.push("/welcome");
  };

  useEffect(() => {
    setisLoading(true);
    fetchTokenData();
  }, []);

  const verifyUserToken = async (token: any) => {
    setisLoading(true);

    const response = await axios.post(
      `http://${API_IP_ADDRESS}:8000/api/users/verifyJwt`,
      {
        token,
      }
    );

    if (response.data.jwtStatus) {
      if (response.data.user_type == "super_admin") {
        console.log("jwt authenticated");
        console.log(response.data);
        router.push("/admin/home");
      } else if (response.data.user_type == "citizen") {
        console.log("jwt authenticated");
        console.log(response.data);
        router.push("/home");
      } else if (response.data.user_type == "department_coordinator") {
        console.log("jwt authenticated");
        console.log(response.data);
        router.push("/branchCoordinators/Home");
      } else if (response.data.user_type == "sub_branch_coordinator") {
        console.log("jwt authenticated");
        console.log(response.data);
        router.push("/subBranchCoordinator/ApproveIssues");
      }
    } else {
      console.log("couldnt authenticate jwt");
      setisLoading(false);
      clearStorage();
      router.push("/auth");
    }
  };

  const fetchTokenData = async () => {
    const tokenFromStorage = await getStoredData();
    if (!tokenFromStorage) {
      clearStorage();
      setisLoading(false);
    } else {
      setisLoading(true);
      const rawToken = await getStoredRawToken();
      verifyUserToken(rawToken);
      console.log(
        tokenFromStorage?.name,
        tokenFromStorage?.email,
        tokenFromStorage?.userType
      );
    }
  };

  useEffect(() => {
    socket.on("hello", (data) => {
      console.log("Data received from server:", data);
    });

    return () => {
      socket.off("hello");
    };
  }, []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleIndexChanged = (index: number) => {
    setCurrentIndex(index);
  };


  return (
    <>
      <StatusBar backgroundColor={currentColors.backgroundDarker} />
      {isLoading && (
        <View
          style={[
            {
              width: "100%",
              height: "100%",
              position: "absolute",
              // backgroundColor: "white",
              zIndex: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            { backgroundColor: currentColors.backgroundDarker },
          ]}>
          <Text
            style={[
              {
                // color: "black",
                fontSize: 30,
                fontWeight: 900,
                marginBottom: 70,
              },
              { color: currentColors.text },
            ]}>
            SpotFix
          </Text>
          <LottieView
            source={loading}
            autoPlay
            loop
            style={{
              width: 200,
              height: 200,
              position: "absolute",
            }}></LottieView>
        </View>
      )}
      <Swiper
        onIndexChanged={handleIndexChanged}
        style={[
          styles.wrapper,
          { backgroundColor: currentColors.backgroundDarker },
        ]}
        showsButtons={false}
        loop={false}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}>
        <View
          style={[
            styles.slide,
            styles.slide1,
            { backgroundColor: currentColors.backgroundDarker },
          ]}
          className="p-10">
          {currentIndex == 0 && (
            <>
              <Animatable.Text
                animation="fadeInUp"
                duration={400}
                style={[
                  styles.slideOneText,
                  {
                    color: currentColors.link,
                  },
                ]}>
                Welcome To SpotFix
              </Animatable.Text>

              <Animatable.View animation="fadeInUp" duration={600}>
                <LottieView
                  source={welcomePageOne}
                  autoPlay
                  loop
                  style={[
                    styles.image,
                    { width: width * 0.8, height: height * 0.4 },
                  ]}
                />
              </Animatable.View>
              <Animatable.Text
                animation="fadeInUp"
                duration={1000}
                className="text-black text-2xl text-center"
                style={[styles.slideText, { color: currentColors.text }]}>
                Effortlessly identify and report local issues to your government
                for prompt resolution.
              </Animatable.Text>
            </>
          )}
        
        </View>

        <View
          style={[
            styles.slide,
            { backgroundColor: currentColors.backgroundDarker },
          ]}
          className="p-10 bg-gray-50">
          {currentIndex == 1 && (
            <View>
              <Animatable.View animation="fadeInUp" duration={400}>
                <LottieView
                  source={welcomePageTwo}
                  autoPlay
                  loop
                  style={[
                    styles.image,
                    { width: width * 0.8, height: height * 0.4 },
                  ]}
                />
              </Animatable.View>
              <Animatable.Text
                animation="fadeInUp"
                duration={700}
                className="text-black text-2xl text-center"
                style={[styles.slideText, { color: currentColors.text }]}>
                Participating in project voting, proposing new ideas, and
                sharing your suggestions.
              </Animatable.Text>
            </View>
          )}
        </View>

        <View
          style={[
            styles.slide,
            { backgroundColor: currentColors.backgroundDarker },
          ]}
          className="p-10">
          {currentIndex == 2 && (
            <>
              <Animatable.View animation="fadeInUp" duration={400}>
                <LottieView
                  source={welcomePageThree}
                  autoPlay
                  loop
                  style={[
                    styles.image,
                    { width: width * 0.8, height: height * 0.4 },
                  ]}
                />
              </Animatable.View>
              <Animatable.Text
                animation="fadeInUp"
                duration={600}
                className="text-2xl text-center"
                style={[styles.slideText, { color: currentColors.text }]}>
                Stay informed with real-time updates, crucial alerts, and
                detailed reports on local developments.
              </Animatable.Text>
            </>
          )}
        </View>

        <ImageBackground
          source={require("../assets/images/gradients/bluegradient.png")}
          style={styles.background}
          resizeMode="cover">
          <StatusBar translucent />
          <View
            style={[styles.slide, styles.slideFour]}
            className="p-10 flex-1">
            {currentIndex == 3 && (
              <>
                <View style={styles.fourContainer}>
                  <Animatable.Text
                    animation="fadeInUp"
                    duration={400}
                    style={styles.screenFoutTitle}>
                    SpotFix
                  </Animatable.Text>
                  <Animatable.Text
                    animation="fadeInUp"
                    duration={600}
                    className="text-2xl text-white text-center "
                    style={styles.slideText}>
                    Welcome aboard! We're excited to have you here. Ready to
                    take the first step?
                  </Animatable.Text>
                </View>

                <Animatable.View animation="fadeInUp" duration={700}>
                  <LottieView
                    source={welcomePageFour}
                    autoPlay
                    loop
                    style={[
                      styles.image,
                      { width: width * 0.8, height: height * 0.4 },
                    ]}
                  />
                </Animatable.View>
                <Animatable.View animation="fadeInUp" duration={800}>
                  <Pressable
                    onPressIn={handleGetStarted}
                    style={[isPressed && styles.buttonPressed]}
                    onPressOut={() => setIsPressed(false)}>
                    <Text
                      className="text-black bg-white"
                      style={styles.gettingStarted}>
                      Get Started
                    </Text>
                  </Pressable>
                </Animatable.View>
              </>
            )}
          </View>
        </ImageBackground>
      </Swiper>
    </>
  );
};
const styles = StyleSheet.create({
  slideText: {
    fontFamily: "Poppins_300Light",
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slide1: {
    backgroundColor: "white",
  },
  slideOneText: {
    width: "100%",
    color: "black",
    fontSize: 35,
    marginBottom: 10,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
  },
  slideTwoText: {
    fontFamily: "Poppins",
    color: "blck",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  slideThreeTitle: {
    fontFamily: "Poppins",
    color: "#000",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  screenFoutTitle: {
    fontFamily: "Poppins",
    color: "#fff",
    fontSize: 40,
    fontWeight: 900,
    marginBottom: 10,
  },
  dot: {
    backgroundColor: "gray",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "orange",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  image: {
    resizeMode: "contain",
    marginBottom: 5,
  },
  gettingStarted: {
    paddingVertical: 15,
    paddingHorizontal: 39,
    fontSize: 20,
    position: "absolute",
    alignSelf: "center",

    marginTop: 20,
    borderRadius: 60,
    elevation: 20,
    fontFamily: "Poppins_600SemiBold",
  },
  slideFour: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  fourContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "20%",
  },
  buttonPressed: {
    backgroundColor: "#1976D2",
    transform: [{ scale: 0.95 }],
  },
  devBtn: {
    position: "absolute",
    top: 100,
  },
});

export default Index;

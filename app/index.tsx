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
} from "react-native";
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
import { useState } from "react";
import {
  getStoredData,
  getStoredRawToken,
  clearStorage,
} from "../hooks/useJwt";
import axios from "axios";
import { API_IP_ADDRESS } from "../ipConfig.json";

import loading from "../assets/images/welcome/loading.json";
const Index = () => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular: require("../assets/fonts/Poppins-Regular.ttf"),
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
    const response = await axios.post(
      `http://${API_IP_ADDRESS}:8000/api/users/verifyJwt`,
      {
        token,
      }
    );

    if (response.data.jwtStatus) {
      console.log("jwt authenticated");
      console.log(response.data);
      setisLoading(false);
      router.push("/home");
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
      const rawToken = await getStoredRawToken();
      setisLoading(false);
      verifyUserToken(rawToken);
      console.log(
        tokenFromStorage?.name,
        tokenFromStorage?.email,
        tokenFromStorage?.userType
      );
    }

   
  };

  return (
    <>
      <StatusBar style="dark" />
      {isLoading && (
        <View
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            backgroundColor: "white",
            zIndex: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Text
            style={{
              color: "black",
              fontSize: 30,
              fontWeight: 900,
              marginBottom: 70,
            }}>
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
        style={styles.wrapper}
        showsButtons={false}
        loop={false}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}>
        <View style={[styles.slide, styles.slide1]} className="p-10">
          <Text style={styles.slideOneText}>Welcome To SpotFix!</Text>

          <LottieView
            source={welcomePageOne}
            autoPlay
            loop
            style={[styles.image, { width: width * 0.8, height: height * 0.4 }]}
          />
          <Text className="text-black text-2xl text-center">
            Effortlessly identify and report local issues to your government for
            prompt resolution.
          </Text>
          <Pressable
            onPressIn={() => router.push("/home")}
            style={styles.devBtn}>
            <Text className="text-xl text-yellow-400 bg-black p-5 rounded-full">
              Dev Skip{"  </>"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.slide} className="p-10 bg-gray-50">
          {/* <Image
            source={require("../assets/images/welcome/welcome2.png")}
            style={[styles.image, { width: width * 0.8, height: height * 0.4 }]}
          /> */}
          <LottieView
            source={welcomePageTwo}
            autoPlay
            loop
            style={[styles.image, { width: width * 0.8, height: height * 0.4 }]}
          />
          <Text className="text-black text-2xl text-center">
            Participating in project voting, proposing new ideas, and sharing
            your suggestions.
          </Text>
        </View>

        <View style={styles.slide} className="p-10">
          {/* <Image
            source={require("../assets/images/welcome/welcome3.png")}
            style={[styles.image, { width: width * 0.8, height: height * 0.4 }]}
          /> */}
          <LottieView
            source={welcomePageThree}
            autoPlay
            loop
            style={[styles.image, { width: width * 0.8, height: height * 0.4 }]}
          />
          <Text className="text-2xl text-center">
            Stay informed with real-time updates, crucial alerts, and detailed
            reports on local developments.
          </Text>
        </View>

        <ImageBackground
          source={require("../assets/images/gradients/bluegradient.png")}
          style={styles.background}
          resizeMode="cover">
          <View
            style={[styles.slide, styles.slideFour]}
            className="p-10 flex-1">
            <View style={styles.fourContainer}>
              <Text style={styles.screenFoutTitle}>SpotFix</Text>
              <Text className="text-2xl text-white text-center ">
                Welcome aboard! We're excited to have you here. Ready to take
                the first step?
              </Text>
            </View>
            {/* <Image
              // source={require("../assets/images/svg/welcome4svg.svg")}
              source={require("../assets/images/welcome/welcome4.png")}
              style={[
                styles.image,
                { width: width * 0.8, height: height * 0.4 },
              ]}
            /> */}
            <LottieView
              source={welcomePageFour}
              autoPlay
              loop
              style={[
                styles.image,
                { width: width * 0.8, height: height * 0.4 },
              ]}
            />
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
          </View>
        </ImageBackground>
      </Swiper>
    </>
  );
};
const styles = StyleSheet.create({
  wrapper: {},
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
    fontFamily: "Poppins-Bold",
    color: "black",
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 10,
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
    fontWeight: 900,
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

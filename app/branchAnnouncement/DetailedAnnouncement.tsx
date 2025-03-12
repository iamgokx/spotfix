import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Keyboard,
  Platform,
  Linking,
} from "react-native";

import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useLocalSearchParams } from "expo-router";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import axios from "axios";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Swiper from "react-native-swiper";
import LottieView from "lottie-react-native";
import lazyLoading from "../../assets/images/welcome/loading.json";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { format } from "date-fns";

import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import Carousel from "react-native-reanimated-carousel";
import { Dimensions } from "react-native";

const width = Dimensions.get("window").width;

import image1 from "../../assets/images/gradients/bluegradient.png";
import image2 from "../../assets/images/gradients/orangegradient.png";
import image3 from "../../assets/images/gradients/profileGradient.png";

const imgs = [image1, image2, image3];
const DetailedAnnouncement = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { announcement_id } = useLocalSearchParams();
  const [announcementDetails, setannouncementDetails] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [geoCodedAddress, setGeoCodedAddress] = useState("");
  const [isAddressLoading, setIsAddressLoading] = useState(true);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [mediaArray, setmediaArray] = useState();

  const getDateFormatted = (date: any) => {
    const formattedDate = format(new Date(date), "eeee d MMMM yyyy");
    return formattedDate;
  };
  const [colors, setColors] = useState({
    background: "",
    color: "",
  });
  const getColorDetails = (status: any) => {
    switch (status) {
      case "registered": {
        setColors({ background: "rgb(203, 202, 202)", color: "black" });
        break;
      }
      case "approved": {
        setColors({ background: "rgb(195, 255, 193)", color: "orange" });
        break;
      }
      case "in process": {
        setColors({ background: "orange", color: "white" });
        break;
      }
      case "completed": {
        setColors({
          background: "rgb(196, 241, 255)",
          color: "rgb(0, 194, 255)",
        });
        break;
      }
      default: {
        setColors({
          background: "orange",
          color: "white",
        });
      }
    }
  };

  const getannouncementDetails = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/announcements/getAnnouncementsDetailed`,
        {
          announcement_id: announcement_id,
        }
      );
      if (response.data.status) {
        setannouncementDetails(response.data.results[0]);
        console.log("response.data.results: ", response.data.results[0]);

        setIsDataLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching issue details:", error);
    }
  };

  useEffect(() => {
    getannouncementDetails();
  }, []);

  useEffect(() => {
    const files = announcementDetails?.media_files
      .split(",")
      .map((file) => file.trim());

    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
    console.log("files: ", files);
    setmediaArray(files);
  }, [announcementDetails]);

  useEffect(() => {
    if (announcementDetails) {
      getColorDetails(announcementDetails.issue_status);
    }
  }, [announcementDetails]);

  if (!isDataLoaded || !announcementDetails) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: currentColors.background,
        }}>
        <StatusBar translucent hidden />
        <LottieView
          source={lazyLoading}
          style={{ width: 100, height: 100 }}
          autoPlay
          loop
        />
      </SafeAreaView>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: currentColors.backgroundDarker,
      }}>
      <StatusBar translucent hidden />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: 100,
        }}>
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}>
            <Ionicons
              name="chevron-back-outline"
              color={"white"}
              size={30}
              style={{
                backgroundColor: currentColors.secondary,
                padding: 5,
                borderRadius: 50,
              }}
              onPress={() => router.back()}
            />

            <Text style={{ color: currentColors.textShade }}>
              {getDateFormatted(announcementDetails.date_time_created)}
            </Text>
          </View>

          <View
            style={{
              padding: 10,
              borderLeftWidth: 5,
              borderColor: currentColors.secondary,
            }}>
            <Text
              style={{
                color: currentColors.text,
                fontSize: 25,
                fontWeight: 700,
              }}>
              {announcementDetails.title}
            </Text>
          </View>
        </View>
        <View style={{width : '100%', padding : 20}}>
          <Swiper
            style={styles.wrapper}
            showsButtons={false}
            activeDotColor="blue"
            dot={<View style={styles.dot} />}
            activeDot={<View style={styles.activeDot} />}>
            {mediaArray?.length > 0 ? (
              mediaArray.map((media, index) => (
                <Animatable.Image
                  animation="fadeInDown"
                  duration={700}
                  key={index}
                  style={styles.img}
                  source={{
                    uri: `http://${API_IP_ADDRESS}:8000/uploads/govAnnouncementMedia/${media}`,
                  }}
                />
              ))
            ) : (
              <View style={styles.noMediaContainer}>
                <Text style={styles.noMediaText}>No media available</Text>
              </View>
            )}
          </Swiper>
        </View>

        <Animatable.View
          animation="fadeInUp"
          duration={500}
          style={[
            styles.issueCreatorContainer,
            { backgroundColor: currentColors.secondaryShade },
          ]}>
          <Image
            source={require("../../assets/images/admin/government.png")}
            style={{
              borderRadius: 50,
              width: 60,
              height: 60,
              backgroundColor: "white",
            }}
          />

          <View>
            <Text
              style={{
                fontSize: 20,
              }}>
              {announcementDetails.department_name}
            </Text>
            <Text>
              {getDateFormatted(announcementDetails.date_time_created)}
            </Text>
          </View>
          <Text
            style={{
              color: colors.color,
              backgroundColor: colors.background,
              position: "absolute",
              right: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
            }}>
            {announcementDetails.issue_status}
          </Text>
        </Animatable.View>
        <Animatable.View
          animation="fadeInUp"
          duration={600}
          style={{
            width: "90%",

            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",

            flexDirection: "column",
            marginBottom: 20,
          }}>
          <Text style={[styles.desc, { color: currentColors.text }]}>
            <Text style={{ fontWeight: 900, color: currentColors.link }}>
              Description :{" "}
            </Text>
            {announcementDetails.announcement_description ||
              "No description available"}
          </Text>
        </Animatable.View>
       
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
    padding: 10,
    position: "relative",

    zIndex: 4,

    gap: 20,
  },
  headerText: {
    color: "white",
    fontSize: 25,
  },
  dot: {
    backgroundColor: "gray",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "white",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  wrapper: {
    height: 350,
  },
  img: {
    width: "100%",
    height: 350,
   
    borderRadius: 30,
  },
  container: {
    padding: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    flexDirection: "column",
  },
  desc: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    // backgroundColor: "#D4F6FF",
    padding: 20,
    borderRadius: 20,
    textAlign: "justify",
  },
  solution: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    // backgroundColor: "#D4F6FF",
    padding: 20,
    borderRadius: 20,
    textAlign: "justify",
  },
  noMediaContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 250,
  },
  noMediaText: {
    fontSize: 16,
    color: "#888",
  },
  issueCreatorContainer: {
    width: "90%",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(231, 238, 242, 0.6)",
    margin: 20,
    borderRadius: 20,
  },
  iconsContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    margin: 20,
  },
  reactions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    // backgroundColor: "rgba(182, 231, 255, 0.8)",
    borderRadius: 20,
    padding: 15,
    paddingVertical: 1,
  },
});

export default DetailedAnnouncement;

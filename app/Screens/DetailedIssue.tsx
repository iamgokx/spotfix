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
import hero from "../../assets/images/hero.jpg";
import { TextInput } from "react-native";
import { format } from "date-fns";
import { BlurView } from "expo-blur";
import lazyLoading2 from "../../assets/images/issues/lazyLoading2.json";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { getStoredData } from "@/hooks/useJwt";
import SuggestionsList from "@/components/SuggestionsList";
import socket from "@/hooks/useSocket";
import { FadeInUp } from "react-native-reanimated";

const DetailedIssue = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const router = useRouter();
  const { issue_id, suggestions } = useLocalSearchParams();
  const [issueDetails, setIssueDetails] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [geoCodedAddress, setGeoCodedAddress] = useState("");
  const [isAddressLoading, setIsAddressLoading] = useState(true);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const closeSuggestions = () => {
    setIsSuggestionsOpen(false);
  };

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

  const getAddress = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${issueDetails.latitude}&lon=${issueDetails.longitude}&addressdetails=1`,
        {
          headers: {
            "User-Agent": "spotfix/1.0 (lekhwargokul84.com)",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      setGeoCodedAddress(data.display_name);
    } catch (error) {
      console.log("Error geocoding address: ", error);
    } finally {
      setIsAddressLoading(false);
    }
  };

  const getIssueDetails = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/issues/getDetailedIssue`,
        { issue_id }
      );
      if (response?.data) {
        setIssueDetails(response.data);

        setIsDataLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching issue details:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    getIssueDetails();

    if (suggestions) {
      setIsSuggestionsOpen(true);
    }
  }, [issue_id]);

  useEffect(() => {
    if (issueDetails && issueDetails.latitude && issueDetails.longitude) {
      getColorDetails(issueDetails.issue_status);
      getAddress();
    }
  }, [issueDetails]);

  if (!isDataLoaded || !issueDetails || isAddressLoading) {
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

  const mediaArray = issueDetails.media_files
    ? issueDetails.media_files.split(",")
    : [];

  const handelVoteClick = async (voteType: string) => {
    try {
      console.log(voteType);
      const token = await getStoredData();

      if (token) {
        const response = await axios.post(
          `http://${API_IP_ADDRESS}:8000/api/issues/addVote`,
          { voteType: voteType, email: token.email, issue_id: issue_id }
        );

        if (response) {
          getIssueDetails();
          // refreshIssue(issue_id);
        }
      } else {
        console.log("User Details not found in JWT token, Please Login");
      }
    } catch (error) {
      console.log("error while adding vote : ", error);
    }
  };

  const openSuggestionBox = () => {
    setIsSuggestionsOpen((prev) => !prev);
  };

  socket.on("newSuggestion", (data) => {
    console.log(data);
    getIssueDetails();
  });

  const handleMapAddressPress = () => {
    const url = `https://www.google.com/maps?q=${issueDetails.latitude},${
      issueDetails.longitude
    }&z=${20}`;
    Linking.openURL(url).catch((err) =>
      console.error("Error opening Google Maps:", err)
    );
  };

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
        <View style={[styles.header]}>
          <Ionicons
            name="chevron-back-outline"
            color={"white"}
            size={30}
            style={{
              position: "absolute",
              left: 10,
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: 5,
              borderRadius: 50,
            }}
            onPress={() => router.back()}
          />
        </View>

        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          activeDotColor="blue"
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}>
          {mediaArray.length > 0 ? (
            mediaArray.map((media, index) => (
              <Animatable.Image
                animation="fadeInDown"
                duration={700}
                key={index}
                style={styles.img}
                source={{
                  uri: `http://${API_IP_ADDRESS}:8000/uploads/issues/${media}`,
                }}
              />
            ))
          ) : (
            <View style={styles.noMediaContainer}>
              <Text style={styles.noMediaText}>No media available</Text>
            </View>
          )}
        </Swiper>
        <Animatable.View
          animation="fadeInUp"
          duration={400}
          style={[styles.iconsContainer]}>
          <TouchableOpacity
            onPress={() => handelVoteClick("upvote")}
            style={{ width: "30%" }}>
            <View style={styles.reactions}>
              <Ionicons
                style={styles.reactionsIcon}
                name="arrow-up-circle"
                size={24}
                color={currentColors.secondary}></Ionicons>
              <Text style={[{ fontSize: 15 }, { color: currentColors.link }]}>
                {issueDetails.upvote_count}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handelVoteClick("downvote")}
            style={{ width: "30%" }}>
            <View style={styles.reactions}>
              <Ionicons
                style={styles.reactionsIcon}
                name="arrow-down-circle"
                size={24}
                color={currentColors.secondary}></Ionicons>
              <Text style={[{ fontSize: 15 }, { color: currentColors.link }]}>
                {issueDetails.downvote_count}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openSuggestionBox()}
            style={{ width: "30%" }}>
            <View style={styles.reactions}>
              <Ionicons
                style={styles.reactionsIcon}
                name="chatbubbles"
                size={24}
                color={currentColors.secondary}></Ionicons>
              <Text style={[{ fontSize: 15 }, { color: currentColors.link }]}>
                {issueDetails.total_suggestions}
              </Text>
            </View>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          duration={500}
          style={[
            styles.issueCreatorContainer,
            { backgroundColor: currentColors.secondaryShade },
          ]}>
          {issueDetails.is_anonymous == 0 ? (
            <Image
              source={
                issueDetails.picture_name
                  ? {
                      uri: `http://${API_IP_ADDRESS}:8000/uploads/profile/${issueDetails.picture_name}`,
                    }
                  : require("../../assets/images/profile/defaultProfile.jpeg")
              }
              style={{ borderRadius: 50, width: 40, height: 40 }}
            />
          ) : (
            <Image
              source={require("../../assets/images/profile/defaultProfile.jpeg")}
              style={{ borderRadius: 50, width: 40, height: 40 }}
            />
          )}
          <View>
            <Text
              style={{
                fontSize: 20,
              }}>
              {issueDetails.is_anonymous == 0
                ? issueDetails.full_name
                : "Spotfix User"}
            </Text>
            <Text>{getDateFormatted(issueDetails.date_time_created)}</Text>
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
            {issueDetails.issue_status}
          </Text>
        </Animatable.View>

        <Animatable.View animation={"fadeInUp"}>
          <Text style={{ color: currentColors.text, fontSize: 18 }}>
            Estimate Completion Date :{" "}
            <Text style={{ color: currentColors.secondary }}>
              {issueDetails.estimate_complete_time == null
                ? "Not yet set"
                : getDateFormatted(issueDetails.estimate_complete_time)}
            </Text>
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
          {/* <Text style={{ fontWeight: 900, fontSize: 17 }}>Description</Text> */}
          <Text style={[styles.desc, { color: currentColors.text }]}>
            <Text style={{ fontWeight: 900, color: currentColors.link }}>
              Description :{" "}
            </Text>
            {issueDetails.issue_description || "No description available"}
          </Text>
        </Animatable.View>
        <Animatable.View
          animation="fadeInUp"
          duration={700}
          style={{
            width: "90%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",

            flexDirection: "column",

            marginBottom: 20,
          }}>
          {/* <Text style={{ fontWeight: 900, fontSize: 17 }}>Suggestions</Text> */}
          <Text style={[styles.solution, { color: currentColors.text }]}>
            <Text style={{ fontWeight: 900, color: currentColors.link }}>
              Proposed Solution :{" "}
            </Text>
            {issueDetails.solution || "No solution available"}
          </Text>
        </Animatable.View>

        {geoCodedAddress ? (
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            style={{
              width: "90%",
              height: "auto",
              display: "flex",

              alignItems: "center",
              marginBottom: 20,
              flexDirection: "row",
              // backgroundColor: "rgba(0, 234, 255, 0.39)",
              overflow: "hidden",
              padding: 10,
              borderRadius: 20,
            }}>
            <Ionicons name="location" size={25} color={currentColors.link} />
            <Text
              onPress={handleMapAddressPress}
              style={{ color: currentColors.link, width: "90%" }}>
              {geoCodedAddress}
            </Text>
          </Animatable.View>
        ) : (
          <Text style={{ color: "#0066ff" }}>Loading address...</Text>
        )}
      </ScrollView>

      {isSuggestionsOpen && (
        <SuggestionsList
          issue_id={issue_id}
          allowSuggestions={true}
          closeSuggestions={closeSuggestions}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    position: "absolute",
    top: 0,
    zIndex: 4,
    height: 100,
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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

export default DetailedIssue;

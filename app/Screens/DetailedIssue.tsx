import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from "react-native";
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
import lazyLoading from "../../assets/images/issues/lazyLoadingIssue.json";
import hero from "../../assets/images/hero.jpg";
import { TextInput } from "react-native";
import { format } from "date-fns";
import { BlurView } from "expo-blur";
import lazyLoading2 from "../../assets/images/issues/lazyLoading2.json";
const DetailedIssue = () => {
  const router = useRouter();
  const { issue_id } = useLocalSearchParams();
  const [issueDetails, setIssueDetails] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [geoCodedAddress, setGeoCodedAddress] = useState("");
  const [isAddressLoading, setIsAddressLoading] = useState(true);

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
            "User-Agent": "YourAppName/1.0 (your-email@example.com)",
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

  useEffect(() => {
    const getIssueDetails = async () => {
      try {
        const response = await axios.post(
          `http://${API_IP_ADDRESS}:8000/api/issues/getDetailedIssue`,
          { issue_id }
        );
        if (response?.data) {
          setIssueDetails(response.data);
          console.log("detailed issue : ", response.data);
          setIsDataLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching issue details:", error);
      }
    };

    getIssueDetails();
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
          justifyContent: "flex-start",
          alignItems: "center",
          backgroundColor: "white",
        }}>
        <StatusBar translucent hidden />

        <LottieView
          source={lazyLoading2}
          autoPlay
          speed={1}
          loop
          style={{
            width: "90%",
            height: "60%",
            borderRadius: 80,
          }}
        />
      </SafeAreaView>
    );
  }

  const mediaArray = issueDetails.media_files
    ? issueDetails.media_files.split(",")
    : [];

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar translucent hidden />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: 100,
        }}>
        <View style={styles.header}>
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

          {/* <Text style={styles.headerText}>
            {issueDetails.title || "Issue Details"}
          </Text> */}
        </View>

        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          activeDotColor="blue"
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}>
          {mediaArray.length > 0 ? (
            mediaArray.map((media, index) => (
              <Image
                key={index}
                style={styles.img}
                source={{
                  uri: `http://${API_IP_ADDRESS}:8000/uploads/${media}`,
                }}
              />
            ))
          ) : (
            <View style={styles.noMediaContainer}>
              <Text style={styles.noMediaText}>No media available</Text>
            </View>
          )}
        </Swiper>

        <View style={styles.issueCreatorContainer}>
          <Image
            source={hero}
            style={{ width: 50, height: 50, borderRadius: 100 }}
          />
          <View>
            <Text
              style={{
                fontWeight: 900,
                fontSize: 20,
              }}>{`${issueDetails.first_name} ${issueDetails.last_name}`}</Text>
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
        </View>
        <View
          style={{
            width: "90%",

            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",

            flexDirection: "column",
            marginBottom: 20,
          }}>
          <Text style={{ fontWeight: 900, fontSize: 17 }}>Description</Text>
          <Text style={styles.desc}>
            {issueDetails.issue_description || "No description available"}
          </Text>
        </View>
        <View
          style={{
            width: "90%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",

            flexDirection: "column",

            marginBottom: 20,
          }}>
          <Text style={{ fontWeight: 900, fontSize: 17 }}>Suggestions</Text>
          <Text style={styles.solution}>
            {issueDetails.solution || "No solution available"}
          </Text>
        </View>

        {geoCodedAddress ? (
          <View
            style={{
              width: "90%",
              height: "auto",
              display: "flex",

              alignItems: "center",
              marginBottom: 20,
              flexDirection: "row",
              backgroundColor: "rgba(0, 234, 255, 0.39)",
              overflow: "hidden",
              padding: 10,
              borderRadius: 20,
            }}>
            <Ionicons name="location" size={25} color={"#0066ff"} />
            <TextInput
              value={geoCodedAddress}
              style={{ color: "#0066ff", width: "90%" }}
              editable={false}
              multiline></TextInput>
          </View>
        ) : (
          <Text style={{ color: "#0066ff" }}>Loading address...</Text>
        )}

        <View
          style={{
            width: "90%",
          }}>
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={() => console.log("press")}>
              <View style={styles.reactions}>
                <Ionicons
                  style={styles.reactionsIcon}
                  name="arrow-up-circle"
                  size={24}
                  color={"#0066ff"}></Ionicons>
                <Text style={{ fontSize: 15 }}>
                  {issueDetails.upvote_count}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.reactions}>
              <Ionicons
                style={styles.reactionsIcon}
                name="arrow-down-circle"
                size={24}
                color={"#0066ff"}></Ionicons>
              <Text style={{ fontSize: 15 }}>
                {issueDetails.downvote_count}
              </Text>
            </View>
            <View style={styles.reactions}>
              <Ionicons
                style={styles.reactionsIcon}
                name="chatbubbles"
                size={24}
                color={"#0066ff"}></Ionicons>
              <Text style={{ fontSize: 15 }}>
                {issueDetails.total_suggestions}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* <View
        style={{
          width: "100%",
          backgroundColor: "#F8EDED",
          height: 60,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          bottom: 0,
        }}>
        <TextInput style={{ width: "90%" }} />
        <Ionicons name="send" size={25} color={"#0066ff"} />
      </View> */}
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
  },
  solution: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    // backgroundColor: "#D4F6FF",
    padding: 20,
    borderRadius: 20,
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
  },
  reactions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(182, 231, 255, 0.8)",
    borderRadius: 20,
    padding: 15,
    paddingVertical: 1,
  },
});

export default DetailedIssue;

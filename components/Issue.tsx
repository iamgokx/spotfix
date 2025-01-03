import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import { format, formatDate } from "date-fns";
import { API_IP_ADDRESS } from "../ipConfig.json";
import * as Animatable from "react-native-animatable";
import { useState, useEffect } from "react";
import Swiper from "react-native-swiper";
import { useRouter } from "expo-router";
import { Colors } from "../constants/Colors";
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_200ExtraLight,
} from "@expo-google-fonts/poppins";
import axios from "axios";
import { getStoredData } from "@/hooks/useJwt";
const Issue = ({
  issue_id,
  username,
  dateTime,
  title,
  status,
  description,
  mediaLinks,
  is_anonymous,
  upvotes,
  downvotes,
  suggestions,
  refreshIssue,
  pfp,
  latitude,
  longitude,
}: any) => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_400Regular,
    Poppins_300Light,
    Poppins_200ExtraLight,
  });
  const [geoCodedAddress, setGeoCodedAddress] = useState("");
  const [isAddressLoading, setIsAddressLoading] = useState(true);
  const getAddress = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
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

  useEffect(() => {
    getAddress();
  }, []);

  const splitDescription =
    description.split(" ").slice(0, 15).join(" ") + "...";
  const mediaArray = mediaLinks ? mediaLinks.split(",") : [];

  const getDateFormatted = (date: any) => {
    const formattedDate = format(new Date(date), "d MMMM yyyy, h:mm a");
    return formattedDate;
  };

  const router = useRouter();
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

  useEffect(() => {
    getColorDetails(status);
  }, [status, colorScheme]);

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
          console.log(response.data);
          refreshIssue(issue_id);
        }
      } else {
        console.log("User Details not found in JWT token, Please Login");
      }
    } catch (error) {
      console.log("error while adding vote : ", error);
    }
  };

  return (
    <Animatable.View
      animation="fadeIn"
      duration={1000}
      style={[styles.container]}>
      <View style={styles.nameContainer}>
        {is_anonymous ? (
          <Ionicons
            name="person"
            color={"black"}
            size={25}
            style={styles.userPfp}></Ionicons>
        ) : (
          <Image
            source={
              pfp
                ? {
                    uri: `http://${API_IP_ADDRESS}:8000/uploads/profile/${pfp}`,
                  }
                : require("../assets/images/profile/defaultProfile.jpeg")
            }
            style={{ borderRadius: 50, width: 40, height: 40 }}
          />
        )}
        <View style={styles.subContainer}>
          <Text style={[styles.userName, { color: currentColors.text }]}>
            {is_anonymous == 1 ? "Spotfix User" : username}
          </Text>
          <Text
            style={[
              { color: currentColors.text, fontFamily: "Poppins_300Light" },
            ]}>
            {getDateFormatted(dateTime)}
          </Text>
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: currentColors.text }]}>
          {title}
        </Text>
        <Text
          style={[
            styles.progress,
            { backgroundColor: colors.background },
            { color: colors.color },
          ]}>
          {status}
        </Text>
      </View>

      <Swiper
        style={styles.wrapper}
        showsButtons={false}
        // autoplay={true}
        // loop={true}
        // autoplayTimeout={4.0}
        activeDotColor="blue"
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}>
        {mediaArray.length > 0 ? (
          mediaArray.map((media, index) => (
            <Image
              key={index}
              style={styles.img}
              source={{
                uri: `http://${API_IP_ADDRESS}:8000/uploads/issues/${media}`,
              }}
            />
          ))
        ) : (
          <Text>No media available</Text>
        )}
      </Swiper>

      <Text
        style={[
          styles.desc,
          { color: currentColors.text, fontFamily: "Poppins_300Light" },
        ]}>
        {splitDescription}
        <Text
          style={{ color: currentColors.link }}
          onPress={() =>
            router.push(`/screens/DetailedIssue?issue_id=${issue_id}`)
          }>
          View more
        </Text>
      </Text>
      <View style={{ marginVertical: 4 }}>
        <Text style={{ color: currentColors.link }}>
          {isAddressLoading ? "Loading address details" : geoCodedAddress}
        </Text>
      </View>
      <View style={styles.iconsContainer}>
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
              {upvotes}
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
              {downvotes}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            router.push(
              `/screens/DetailedIssue?issue_id=${issue_id}&suggestions=${true}`
            )
          }
          style={{ width: "30%" }}>
          <View style={styles.reactions}>
            <Ionicons
              style={styles.reactionsIcon}
              name="chatbubbles"
              size={24}
              color={currentColors.secondary}></Ionicons>
            <Text style={[{ fontSize: 15 }, { color: currentColors.link }]}>
              {suggestions}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
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
    height: 200,
  },

  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ani: {
    width: 400,
    height: 400,
  },
  carouselContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "95%",
    height: "auto",
    alignSelf: "auto",
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  subContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  nameContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    gap: 10,
    alignItems: "center",
  },
  userPfp: {
    width: "10%",
    backgroundColor: "orange",
    borderRadius: 20,
    textAlign: "center",
    paddingVertical: 5,
  },
  userName: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
  },
  imgContainer: {
    height: 200,
    objectFit: "cover",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: "100%",
    height: 200,

    borderRadius: 20,
  },
  title: {
    width: " 70%",
    fontSize: 20,
    textAlign: "left",
    paddingLeft: 10,
    fontFamily: "Poppins_400Regular",
  },
  titleContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  progress: {
    width: "25%",
    textAlign: "center",
    paddingVertical: 5,
    paddingHorizontal: 0,
    borderRadius: 20,
    color: "white",
    fontFamily: "Poppins_400Regular",
  },
  desc: {
    fontSize: 17,
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
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    // backgroundColor: "rgba(182, 231, 255, 0.8)",
    borderRadius: 20,
    padding: 15,
    paddingVertical: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 250,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    aspectRatio: 1,
  },
  caption: {
    marginTop: 10,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  noMediaContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  noMediaText: {
    fontSize: 16,
    color: "#888",
  },
});

export default Issue;

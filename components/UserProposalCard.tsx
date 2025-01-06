import { View, Text, RefreshControl, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_IP_ADDRESS } from "../ipConfig.json";
import Swiper from "react-native-swiper";
import { Image } from "react-native-animatable";
import { StyleSheet } from "react-native";
import { getStoredRawToken } from "@/hooks/useJwt";
import { jwtDecode } from "jwt-decode";
import { useFonts, Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import * as Animatable from "react-native-animatable";
import { format, formatDate } from "date-fns";
const UserProposalCard = ({
  mediaLinks,
  title,

  latitude,
  longitude,
  dateTime,
  proposalId,
}: any) => {
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
  });
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorTheme = useColorScheme();
  const currentColors = colorTheme == "dark" ? Colors.dark : Colors.light;

  const mediaArray = mediaLinks ? mediaLinks.split(",") : [];
  const getDateFormatted = (date: any) => {
    const formattedDate = format(new Date(date), "d MMMM yyyy, h:mm a");
    return formattedDate;
  };

  const [geoCodedAddress, setGeoCodedAddress] = useState("");
  const [isAddressLoading, setIsAddressLoading] = useState(true);
  const [addresses, setAddresses] = useState({});
  const [mediaFiles, setmediaFiles] = useState();
  const [isLoading, setisLoading] = useState(true);
  const getAddress = async () => {
    setIsAddressLoading(true);
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
      const fetchedAddress = data?.display_name || "Address not found";
      setGeoCodedAddress(fetchedAddress);
    } catch (error) {
      console.log("Error geocoding address: ", error);
    } finally {
      setIsAddressLoading(false);
    }
  };

  useEffect(() => {
    getAddress();

    const mediaArrayImg = mediaLinks.split(", ").map((file) => file.trim());

    const proposalMedia = mediaArrayImg.filter((file) =>
      file.includes("proposal")
    );
    setmediaFiles(proposalMedia);
    setisLoading(false);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <Animatable.View
      animation="fadeIn"
      style={{
        width: "90%",
        borderRadius: 30,
        backgroundColor: currentColors.backgroundDarkest,
        overflow: "hidden",
        paddingBottom: 15,
        gap: 5,
      }}>
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
          mediaFiles.map((media, index) => (
            <Image
              key={index}
              style={styles.img}
              source={{
                uri: `http://${API_IP_ADDRESS}:8000/uploads/userProposalsMedia/${media}`,
              }}
            />
          ))
        ) : (
          <Text>No media available</Text>
        )}
      </Swiper>
      <TouchableOpacity
        style={{ width: "100%", gap: 7 }}
        onPress={() =>
          router.push(`/screens/DetailedUserProposal?proposalId=${proposalId}`)
          // router.push(`/screens/DetailedIssue?proposalId=${issue_id}`)
        }>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            padding: 10,
            alignItems: "center",
          }}>
          <Text style={{ width: "74%", color: currentColors.text }}>
            {title}
          </Text>
        </View>
        <Text
          style={{
            paddingHorizontal: 10,
            color: currentColors.link,
          }}>
          {isAddressLoading ? "Loading address details..." : geoCodedAddress}
        </Text>
        <Text
          style={{
            color: currentColors.text,
            paddingHorizontal: 10,
          }}>
          {getDateFormatted(dateTime)}
        </Text>
      </TouchableOpacity>
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

export default UserProposalCard;

import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import Swiper from "react-native-swiper";
import { Image } from "react-native";
import { API_IP_ADDRESS } from "../ipConfig.json";
import { ImageBackground } from "react-native";
import { format } from "date-fns";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
const CitizenProposalCard = ({
  username,
  dateTimeCreated,
  latitude,
  longitude,
  profilePicture,
  title,
  description,
  mediaFiles,
  proposalId,
}: any) => {
  const currentTheme = useColorScheme();
  const currentColors = currentTheme == "dark" ? Colors.dark : Colors.light;

  const getDateFormatted = (date: any) => {
    const formattedDate = format(new Date(date), "eeee d MMMM yyyy");
    return formattedDate;
  };
  const router = useRouter();
  const mediaArray = mediaFiles.split(", ").map((file) => file.trim());

  const proposalMedia = mediaArray.filter((file) => file.includes("proposal"));
  const otherFiles = mediaArray.filter((file) => !file.includes("proposal"));

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
  return (
    <View
      style={{
        width: "90%",
        borderRadius: 20,
      }}>
      <View style={{ flexDirection: "row", gap: 10, padding: 10 }}>
        <Image
          source={{
            uri: `http://${API_IP_ADDRESS}:8000/uploads/profile/${profilePicture}`,
          }}
          style={{ width: 40, height: 40, borderRadius: 500 }}></Image>
        <View style={{ flexDirection: "column" }}>
          <Text style={{ color: currentColors.text }}>{username}</Text>
          <Text style={{ color: currentColors.text }}>
            {getDateFormatted(dateTimeCreated)}
          </Text>
        </View>
      </View>
      <ImageBackground
        source={{
          uri: `http://${API_IP_ADDRESS}:8000/uploads/userProposalsMedia/${proposalMedia[0]}`,
        }}
        style={{ width: "100%", height: 200, }}></ImageBackground>
      <Text style={{ color: currentColors.text }}>{title}</Text>
      <Text style={{ color: currentColors.text }}>
        {isAddressLoading ? "Loading address ..." : geoCodedAddress}
      </Text>
      <Text style={{ color: currentColors.text }}>
        {splitDescription}
        <Text
          style={{ color: currentColors.link }}
          onPress={() =>
            router.push(
              `/screens/DetailedUserProposal?proposalId=${proposalId}`
            )
          }>
          View more
        </Text>
      </Text>
    </View>
  );
};



export default CitizenProposalCard;

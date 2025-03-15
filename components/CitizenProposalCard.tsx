import { View, Text, TouchableOpacity } from "react-native";
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
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import defaultpfp from "../assets/images/profile/defaultProfile.jpeg";
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
  suggestionCount,
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
    <Animatable.View
      animation="fadeInUp"
      style={{
        width: "100%",
        height: "auto",
        borderRadius: 20,

        paddingVertical: 20,
        paddingHorizontal: 10,
        gap: 10,
      }}>
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          padding: 10,
        }}>
        <Image
          source={
            profilePicture != 'null' ? {
              uri: `http://${API_IP_ADDRESS}:8000/uploads/profile/${profilePicture}`,
            } : defaultpfp
          }
          style={{ width: 40, height: 40, borderRadius: 500 }}></Image>
     
        <View style={{ flexDirection: "column" }}>
          <Text style={{ color: currentColors.text }}>{username}</Text>
          <Text style={{ color: currentColors.text }}>
            {getDateFormatted(dateTimeCreated)}
          </Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: currentColors.backgroundDarker,
          borderRadius: 20,
          overflow: "hidden",
          paddingBottom: 20,
          elevation: 18,
        }}>
        <TouchableOpacity
          onPress={() =>
            router.push(
              `/screens/DetailedUserProposal?proposalId=${proposalId}`
            )
          }>
          <ImageBackground
            source={{
              uri: `http://${API_IP_ADDRESS}:8000/uploads/userProposalsMedia/${proposalMedia[0]}`,
            }}
            style={{ width: "100%", height: 200, borderRadius: 60 }}>
            <View
              style={{
                backgroundColor: "rgba(0,0,0,0.6)",
                position: "absolute",
                width: "100%",
                height: "100%",
                alignItems: "flex-start",
                justifyContent: "flex-end",
                padding: 10,
              }}>
              <Text style={{ color: "white", fontSize: 17 }}>{title}</Text>
              <Text style={{ color: "yellow" }}>
                {isAddressLoading ? "Loading address ..." : geoCodedAddress}
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        <Text style={{ color: currentColors.text, padding: 10 }}>
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
        <View
          style={{
            width: "95%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}>
          <Ionicons
            name="chatbubbles"
            size={25}
            color={currentColors.secondary}
            style={{ width: "8%" }}
            onPress={() =>
              router.push(
                `/screens/DetailedUserProposal?proposalId=${proposalId}&suggestions=${true}`
              )
            }
          />
          <Text style={{ color: currentColors.link }}>{suggestionCount}</Text>
        </View>
      </View>
    </Animatable.View>
  );
};

export default CitizenProposalCard;

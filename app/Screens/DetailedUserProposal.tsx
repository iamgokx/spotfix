import { View, Text, TextInput, Alert, Modal, StatusBar } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import axios from "axios";
import { useEffect, useState } from "react";
import Swiper from "react-native-swiper";
import { format } from "date-fns";
import { StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import ReactNativePdf from "react-native-pdf";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";

import { Linking } from "react-native";
import { Image } from "react-native-animatable";
import docIcon from "../../assets/images/proposals/docs.png";
import pdfIcon from "../../assets/images/proposals/pdf.png";
import lazyLoading from "../../assets/images/welcome/loading.json";
import LottieView from "lottie-react-native";
//TODO add pdf view here, and also comment section

const DetailedUserProposal = () => {
  const currentTheme = useColorScheme();
  const currentColors = currentTheme == "dark" ? Colors.dark : Colors.light;
  const { proposalId } = useLocalSearchParams();
  const [proposalDetails, setProposalDetails] = useState();
  const [mediaFiles, setmediaFiles] = useState();
  const [docFiles, setdocFiles] = useState();
  const [fileToOpen, setFileToOpen] = useState<string | null>(null);
  const [isLoading, setisLoading] = useState(true);

  const router = useRouter();
  const getDateFormatted = (date: any) => {
    const formattedDate = format(new Date(date), "eeee d MMMM yyyy");
    return formattedDate;
  };
  const getDetailedUserProposal = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/proposals/getCitizenDetailedProposal`,
        {
          proposalId: proposalId,
        }
      );

      if (response) {
        const mediaArray = response.data[0].media_files
          .split(", ")
          .map((file) => file.trim());

        const proposalMedia = mediaArray.filter((file) =>
          file.includes("proposal")
        );
        setmediaFiles(proposalMedia);
        const otherFiles = mediaArray.filter(
          (file) => !file.includes("proposal")
        );
        console.log(otherFiles);
        setdocFiles(otherFiles);
        getAddress(response.data[0].latitude, response.data[0].longitude);
        setProposalDetails(response.data[0]);
      }
    } catch (error) {
      console.log("error getting detailed proposal issues : ", error);
    }
  };

  const [geoCodedAddress, setGeoCodedAddress] = useState("");
  const [isAddressLoading, setIsAddressLoading] = useState(true);

  const getAddress = async (latitude: any, longitude: any) => {
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

      setGeoCodedAddress(data.display_name);
    } catch (error) {
      console.log("Error geocoding address: ", error);
    } finally {
      setIsAddressLoading(false);
      setisLoading(false);
    }
  };

  useEffect(() => {
    getDetailedUserProposal();
  }, []);

  const handleMapAddressPress = () => {
    const { latitude, longitude } = proposalDetails;
    const url = `https://www.google.com/maps?q=${latitude},${longitude}&zoom=18&layer=c`;
    Linking.openURL(url).catch((err) =>
      console.error("Error opening Google Maps:", err)
    );
  };

  const openPdfExternally = (fileName: any) => {
    const fileUri = `http://${API_IP_ADDRESS}:8000/uploads/userProposalsFiles/${fileName}`;

    Linking.openURL(fileUri).catch((err) =>
      console.error("Error opening PDF:", err)
    );
  };

  if (isLoading) {
    return (
      <View
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
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: currentColors.background, flex: 1 }}>
      {proposalDetails && (
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
            {mediaFiles.length > 0 ? (
              mediaFiles.map((media, index) => (
                <Animatable.Image
                  animation="fadeInDown"
                  duration={700}
                  key={index}
                  style={styles.img}
                  source={{
                    uri: `http://${API_IP_ADDRESS}:8000/uploads/userProposalsMedia/${media}`,
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
            duration={500}
            style={[
              styles.issueCreatorContainer,
              { backgroundColor: currentColors.secondaryShade },
            ]}>
            <Image
              source={
                proposalDetails.citizen_picture_name
                  ? {
                      uri: `http://${API_IP_ADDRESS}:8000/uploads/profile/${proposalDetails.citizen_picture_name}`,
                    }
                  : require("../../assets/images/profile/defaultProfile.jpeg")
              }
              style={{ borderRadius: 50, width: 40, height: 40 }}
            />
            <View>
              <Text
                style={{
                  fontSize: 20,
                }}>
                {proposalDetails.citizen_name}
              </Text>
              <Text>{getDateFormatted(proposalDetails.date_time_created)}</Text>
            </View>
          </Animatable.View>

          <Animatable.View
            animation="fadeInUp"
            style={{
              width: "100%",
              gap: 20,
              padding: 10,
              alignItems: "center",
            }}>
            <Text
              style={{
                color: currentColors.text,
                fontSize: 20,
                width: "90%",
              }}>
              {proposalDetails.title}
            </Text>
            <Text
              style={{
                color: currentColors.text,

                width: "90%",
                textAlign: "justify",
              }}>
              {proposalDetails.proposal_description}
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

                flexDirection: "row",
                marginBottom: 20,
                overflow: "hidden",
                padding: 10,
                borderRadius: 20,
              }}>
              <Ionicons
                name="location"
                size={25}
                color={currentColors.secondary}
              />
              {/* <TextInput
                onPress={handleMapAddressPress}
                value={geoCodedAddress}
                style={{ color: currentColors.secondary, width: "90%" }}
                editable={false}
                multiline></TextInput> */}
              <Text
                onPress={handleMapAddressPress}
                style={{ color: currentColors.secondary, width: "90%" }}>
                {geoCodedAddress}
              </Text>
            </Animatable.View>
          ) : (
            <Animatable.Text
              animation="fadeInUp"
              style={{ color: currentColors.secondary }}>
              Loading address...
            </Animatable.Text>
          )}

          <Animatable.View
            animation="fadeInUp"
            style={{ width: "90%", gap: 10 }}>
            {docFiles.map((file, index) => {
              const isPdf = file.endsWith(".pdf");
              return (
                <TouchableOpacity
                  onPress={() => openPdfExternally(file)}
                  key={index}
                  style={{
                    backgroundColor: currentColors.backgroundDarker,
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    padding: 10,
                    gap: 5,
                    borderRadius: 20,
                  }}>
                  <Image
                    source={isPdf ? pdfIcon : docIcon}
                    style={{ width: 40, height: 40 }}
                  />
                  <Text style={{ color: currentColors.secondary }}>
                    Download {file}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Animatable.View>

          {/* <View style={styles.iconsContainer}>
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
                  {proposalDetails.suggestion_count}
                </Text>
              </View>
            </TouchableOpacity>
          </View> */}

          {/* TODO add suggestions and suggestion box*/}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    padding: 10,
    backgroundColor: "#FF5252",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
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
export default DetailedUserProposal;

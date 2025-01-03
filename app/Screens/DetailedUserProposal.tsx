import { View, Text } from "react-native";
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
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import { Platform } from "react-native";
import { ViewPdf } from "react-native-view-pdf";

const DetailedUserProposal = () => {
  const currentTheme = useColorScheme();
  const currentColors = currentTheme == "dark" ? Colors.dark : Colors.light;
  const { proposalId } = useLocalSearchParams();
  const [proposalDetails, setProposalDetails] = useState();
  const [mediaFiles, setmediaFiles] = useState();
  const [docFiles, setdocFiles] = useState();
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
        console.log(response.data);
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
        setdocFiles(otherFiles);
        setProposalDetails(response.data[0]);
      }
    } catch (error) {
      console.log("error getting detailed proposal issues : ", error);
    }
  };

  useEffect(() => {
    getDetailedUserProposal();
  }, []);

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

          <View style={{ width: "90%", gap: 20, paddingTop: 20 }}>
            <Text
              style={{
                color: currentColors.text,
                fontSize: 20,
                width: "100%",
              }}>
              {proposalDetails.title}
            </Text>
            <Text
              style={{
                color: currentColors.text,

                width: "100%",
                textAlign: "justify",
              }}>
              {proposalDetails.proposal_description}
            </Text>
          </View>

          <View style={styles.iconsContainer}>
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
                  23
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
export default DetailedUserProposal;

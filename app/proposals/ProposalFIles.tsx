import { useEffect, useState } from "react";
import {
  Button,
  Image,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from "react-native";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { useProposalContext } from "@/context/ProposalContext";
import * as ImagePicker from "expo-image-picker";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import uploadMedia from "../../assets/images/issues/uploadMedia.json";
import axios from "axios";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import * as DocumentPicker from "expo-document-picker";
import * as Animatable from "react-native-animatable";
import { getStoredRawToken, getStoredData } from "../../hooks/useJwt";
import docIcon from "../../assets/images/proposals/docs.png";
import pdfIcon from "../../assets/images/proposals/pdf.png";
export default function ProposalFiles() {
  const { details, setDetails, addDocument, removeDocument } =
    useProposalContext();
  const [user, setuser] = useState("");
  const router = useRouter();
  const colorTheme = useColorScheme();
  const currentColors = colorTheme == "dark" ? Colors.dark : Colors.light;
  const pickDocuments = async () => {
    try {
      if (details.documents.length >= 5) {
        alert("You can only upload up to 5 documents.");
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const newDocuments = result.assets.map((asset) => ({
          uri: asset.uri,
          type: asset.mimeType,
          name: asset.name,
          size: asset.size,
        }));

        const remainingSlots = 5 - details.documents.length;
        newDocuments.slice(0, remainingSlots).forEach((doc) => {
          addDocument(doc);
        });
      } else {
        console.log("No documents selected or operation canceled.");
      }
    } catch (error) {
      console.error("Error picking documents:", error);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const storedUser = await getStoredData();
      setuser(storedUser?.email || "Unknown User");
    };
    fetchUserDetails();
  }, []);

  const submitIssue = async () => {
    console.log();
    console.log();
    console.log();
    console.log();
    try {
      const formData = new FormData();

      formData.append("title", details.title);
      formData.append("user", user);
      formData.append("description", details.description);
      formData.append("latitude", details.latitude);
      formData.append("longitude", details.longitude);
      formData.append("generatedCity", details.generatedCity);
      formData.append("generatedPincode", details.generatedPincode);
      formData.append("generatedAddress", details.generatedAddress);
      formData.append("generatedLocality", details.generatedLocality);
      formData.append("generatedState", details.generatedState);

      if (details.media[0]) {
        formData.append("media", {
          uri: details.media[0].uri.startsWith("file://")
            ? details.media[0].uri
            : `file://${details.media[0].uri}`,
          type: "image/jpeg",
          name: "proposal.jpg",
        });
      }
      if (details.media[1]) {
        formData.append("media", {
          uri: details.media[1].uri.startsWith("file://")
            ? details.media[1].uri
            : `file://${details.media[1].uri}`,
          type: "image/jpeg",
          name: "proposal.jpg",
        });
      }
      if (details.media[2]) {
        formData.append("media", {
          uri: details.media[2].uri.startsWith("file://")
            ? details.media[2].uri
            : `file://${details.media[2].uri}`,
          type: "image/jpeg",
          name: "proposal.jpg",
        });
      }
      if (details.media[3]) {
        formData.append("media", {
          uri: details.media[3].uri.startsWith("file://")
            ? details.media[3].uri
            : `file://${details.media[3].uri}`,
          type: "image/jpeg",
          name: "proposal.jpg",
        });
      }
      if (details.media[4]) {
        formData.append("media", {
          uri: details.media[4].uri.startsWith("file://")
            ? details.media[4].uri
            : `file://${details.media[4].uri}`,
          type: "image/jpeg",
          name: "proposal.jpg",
        });
      }

      details.documents.forEach((doc, index) => {
        formData.append(`documents`, {
          uri: doc.uri.startsWith("file://") ? doc.uri : `file://${doc.uri}`,
          type: doc.type,
          name: doc.name || `document${index + 1}`,
        });
      });
      console.log("FormData:", formData);

      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/proposals/insertUserProposal`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Response from server:", response.data);
      if (response) {
        console.log(response);
        router.push('/proposals/SaveProposal')
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };
  const handleRemoveDocument = (uri: string) => {
    removeDocument(uri);
  };

  useEffect(() => {
    console.log("documents  : ", details.documents);
  }, [details.documents]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentColors.backgroundDarker },
      ]}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor="transparent"
        translucent
      />
      <Animatable.View animation="fadeInDown" style={styles.headerContainer}>
        <ImageBackground
          resizeMode="cover"
          source={require("../../assets/images/blobs/b8.png")}
          style={styles.imgBack}>
          <Text style={styles.title}>Create your Proposal</Text>
          <Text style={styles.subTitle}>
            Attach relevant files to your proposals
          </Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressBarOne}></Text>
            <Text style={styles.progressBarTwo}></Text>
            <Text style={styles.progressBarThree}></Text>
            <Text style={styles.progressBarFour}></Text>
          </View>
        </ImageBackground>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" style={styles.dataContainer}>
        <TouchableOpacity style={styles.dropContainer} onPress={pickDocuments}>
          <LottieView
            source={uploadMedia}
            autoPlay
            loop
            style={{ width: 200, height: 200, marginBottom: -30 }}
          />
          <Text style={{ color: currentColors.text }}>Upload Files</Text>
        </TouchableOpacity>

        <View style={styles.documentContainer}>
          {details.documents.map((doc, index) => (
            <View key={index} style={styles.documentItem}>
              <Image
                style={{ width: 50, height: 50 }}
                source={doc.type == "application/pdf" ? pdfIcon : docIcon}
              />
              <Text
                style={[styles.documentName, { color: currentColors.text }]}>
                {" "}
                {doc.name.length > 10
                  ? `${doc.name.slice(0, 10)}...`
                  : doc.name}
              </Text>

              <TouchableOpacity
                onPress={() => handleRemoveDocument(doc.uri)}
                style={styles.removePosition}>
                <Ionicons
                  name="close"
                  style={styles.removeBtn}
                  color={"white"}
                  size={20}
                />
              </TouchableOpacity>
            </View>
          ))}

          {details.documents.length >= 5 && (
            <Text style={styles.limitMessage}>
              Document upload limit reached (5/5).
            </Text>
          )}
        </View>

        <View style={styles.btnMainContainer}>
          <TouchableOpacity
            style={[
              styles.backBtnContainer,
              { borderColor: currentColors.secondary },
            ]}
            onPress={() => router.back()}>
            <Text
              style={[styles.backButton, { color: currentColors.secondary }]}>
              Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btnContainer,
              { backgroundColor: currentColors.secondary },
            ]}
            onPress={() => submitIssue()}>
            {/* onPress={() => router.push("/issues/SaveIssue")}> */}
            <Text style={styles.nextButton}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
}

function VideoComponent({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.play();
    player.muted = true;
  });

  return (
    <View style={styles.mediaWrapper}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "rgb(230, 240, 255)",
  },
  mediaWrapper: {
    width: 100,
    height: 100,
    overflow: "hidden",
    backgroundColor: "#000",
    borderRadius: 20,
  },
  video: {
    flex: 1,
    width: "200%",
    height: "100%",
    alignSelf: "center",
  },
  removeBtn: {
    backgroundColor: "#0066ff",
    padding: 5,
    borderRadius: 30,
    transform: [{ translateY: "-50%" }, { translateX: "50%" }],
  },
  removePosition: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  headerContainer: {
    width: "100%",
    height: "25%",
    overflow: "hidden",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  imgBack: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  title: {
    color: "white",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
  },
  subTitle: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
  },
  dataContainer: {
    width: "100%",
    height: "65%",
    padding: 29,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  dropContainer: {
    width: "90%",
    height: "40%",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#0066ff",
    borderStyle: "dashed",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  mediaContainer: {
    width: "100%",
    overflow: "hidden",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
  },
  mediaItem: {
    margin: 10,
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
    objectFit: "cover",
    borderRadius: 20,
  },

  btnContainer: {
    backgroundColor: "rgb(0, 102, 255)",
    fontSize: 20,
    color: "white",
    width: "40%",

    paddingVertical: 10,
    borderRadius: 30,
    fontWeight: 900,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  backBtnContainer: {
    backgroundColor: "white",
    fontSize: 20,
    color: "white",
    width: "40%",

    paddingVertical: 10,
    borderRadius: 30,
    fontWeight: 900,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    borderColor: "blue",
    borderWidth: 1,
  },
  btnMainContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  nextButton: {
    color: "white",
    fontSize: 20,
  },
  backButton: {
    color: "#0066ff",
    fontSize: 20,
  },
  documentContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    marginTop: 20,
  },
  documentItem: {
    margin: 10,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
    position: "relative",
    maxWidth: "80%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 5,
  },
  documentName: {
    fontSize: 14,
    color: "#333",
    marginRight: 10,
  },
  progressContainer: {
    width: "80%",

    display: "flex",
    flexDirection: "row",
    justifyContent: "center",

    alignItems: "center",
  },
  progressBarOne: {
    backgroundColor: "#0066ff",
    width: "20%",
    height: "30%",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  progressBarTwo: {
    backgroundColor: "#0066ff",
    width: "20%",
    height: "30%",
  },
  progressBarThree: {
    backgroundColor: "#0066ff",
    width: "20%",
    height: "30%",
  },
  progressBarFour: {
    backgroundColor: "#0066ff",
    width: "20%",
    height: "30%",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
});

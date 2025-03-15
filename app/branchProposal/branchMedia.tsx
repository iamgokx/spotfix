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
import docIcon from "../../assets/images/proposals/docs.png";
import pdfIcon from "../../assets/images/proposals/pdf.png";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { useGovProposalContext } from "@/context/govProposalContext";
import * as ImagePicker from "expo-image-picker";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import uploadMedia from "../../assets/images/issues/uploadMedia.json";
import axios from "axios";
import { getStoredRawToken, getStoredData } from "../../hooks/useJwt";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import * as Animatable from "react-native-animatable";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";
export default function branchMedia() {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const {
    details,
    setDetails,
    addMedia,
    removeMedia,
    addDocument,
    removeDocument,
  } = useGovProposalContext();
  const [user, setuser] = useState("");
  const router = useRouter();
  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 5 - details.media.length,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const newImages = result.assets.map((asset) => ({
        uri: asset.uri.startsWith("file://")
          ? asset.uri
          : `file://${asset.uri}`,
        type: asset.type === "video" ? "video" : "image",
      }));
      result.assets.forEach((asset) => {
        addMedia({
          uri: asset.uri,
          type: asset.type === "video" ? "video" : "image",
        });
      });
    } else {
      console.log("No media selected or operation canceled.");
    }
  };

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

  const handleRemoveItem = (uri: string) => {
    removeMedia(uri);
  };

  const sanitizeFilename = (filename) => {
    return filename.replace(/[()]/g, "").replace(/[^a-zA-Z0-9._-]/g, "_");
  };

  const handleRemoveDocument = (uri: string) => {
    removeDocument(uri);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const storedUser = await getStoredData();
      setuser(storedUser?.email || "Unknown User");
    };
    fetchUserDetails();
  }, []);

  const submitProposal = async () => {
    try {
      const formData = new FormData();
      formData.append("user", user);

      formData.append("title", details.title);
      formData.append("description", details.description);
      formData.append("budget", details.budget.toString());
      formData.append("estimateTime", details.estimateTime);
      formData.append("department", details.department);
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
          name: "gov-proposal.jpg",
        });
      }
      if (details.media[1]) {
        formData.append("media", {
          uri: details.media[1].uri.startsWith("file://")
            ? details.media[1].uri
            : `file://${details.media[1].uri}`,
          type: "image/jpeg",
          name: "gov-proposal.jpg",
        });
      }
      if (details.media[2]) {
        formData.append("media", {
          uri: details.media[2].uri.startsWith("file://")
            ? details.media[2].uri
            : `file://${details.media[2].uri}`,
          type: "image/jpeg",
          name: "gov-proposal.jpg",
        });
      }
      if (details.media[3]) {
        formData.append("media", {
          uri: details.media[3].uri.startsWith("file://")
            ? details.media[3].uri
            : `file://${details.media[3].uri}`,
          type: "image/jpeg",
          name: "gov-proposal.jpg",
        });
      }
      if (details.media[4]) {
        formData.append("media", {
          uri: details.media[4].uri.startsWith("file://")
            ? details.media[4].uri
            : `file://${details.media[4].uri}`,
          type: "image/jpeg",
          name: "gov-proposal.jpg",
        });
      }

      details.documents.forEach((doc, index) => {
        formData.append(`documents`, {
          uri: doc.uri.startsWith("file://") ? doc.uri : `file://${doc.uri}`,
          type: doc.type,
          name: sanitizeFilename(doc.name || `document_${index + 1}`),
        });
      });

      console.log("FormData:", formData);

      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/branchCoordinator/newProposal`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.status) {
        Alert.alert(
          "Success",
          response.data.message,
          [
            {
              text: "OK",
              onPress: () => {
                console.log("User acknowledged success");
                router.replace("/branchCoordinators/MakeNew");
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          "Error ❌",
          response.data.message,
          [
            {
              text: "Retry",
              onPress: () => {
                console.log("User chose to retry");
              },
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ],
          { cancelable: true }
        );
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const [errors, setErrors] = useState({});
  const safeDetails = details || {};
  const validate = () => {
    let valid = true;
    let newErrors = {};

    if (safeDetails.media.length < 1) {
      newErrors.media = "Please select atlease 1 image";
      valid = false;
    }
    if (safeDetails.documents.length < 1) {
      newErrors.files = "Please select atlease 1 document file";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleNextButtonPress = () => {
    if (validate()) {
      console.log("all good");
      submitProposal();
    } else {
      console.log("enter all details");
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: currentColors.backgroundDarker },
      ]}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.headerContainer}>
        <ImageBackground
          resizeMode="cover"
          source={require("../../assets/images/gradients/orangegradient.png")}
          style={styles.imgBack}>
          <Animatable.Text animation="fadeInDown" style={styles.title}>
            Create your Proposal
          </Animatable.Text>
          <Animatable.Text animation="fadeInDown" style={styles.subTitle}>
            Add relevant Media and Files for your Proposal
          </Animatable.Text>
          <Animatable.View
            animation="fadeInDown"
            style={styles.progressContainer}>
            <Text style={styles.progressBarOne}></Text>
            <Text style={styles.progressBarTwo}></Text>
            <Text style={styles.progressBarThree}></Text>
          </Animatable.View>
        </ImageBackground>
      </View>

      <View
        style={{
          flex: 1,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "center",
          gap: 30,
        }}>
        <TouchableOpacity style={styles.dropContainer} onPress={pickMedia}>
          <LottieView
            source={uploadMedia}
            autoPlay
            loop
            style={{ width: 200, height: 200, marginBottom: -30 }}
          />
          <Text style={{ color: currentColors.text }}>Upload Media</Text>
        </TouchableOpacity>

        {errors.media && (
          <Text style={{ color: "red", textAlign: "center" }}>
            {errors.media}
          </Text>
        )}

        <View style={styles.mediaContainer}>
          {details.media.map((item, index) => (
            <View key={index} style={styles.mediaItem}>
              {item.type === "image" ? (
                <Image source={{ uri: item.uri }} style={styles.image} />
              ) : (
                <VideoComponent uri={item.uri} />
              )}
              <TouchableOpacity
                onPress={() => handleRemoveItem(item.uri)}
                style={styles.removePosition}>
                <Ionicons
                  name="close"
                  style={styles.removeBtn}
                  color={"white"}
                  size={20}></Ionicons>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.dropContainer} onPress={pickDocuments}>
          <LottieView
            source={uploadMedia}
            autoPlay
            loop
            style={{ width: 200, height: 200, marginBottom: -30 }}
          />
          <Text style={{ color: currentColors.text }}>Upload Files</Text>
        </TouchableOpacity>

        {errors.files && (
          <Text style={{ color: "red", textAlign: "center" }}>
            {errors.files}
          </Text>
        )}
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
                  ? `${doc.name.slice(0, 50)}...`
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
            <Text style={{ color: currentColors.secondary }}>
              Document upload limit reached (5/5).
            </Text>
          )}
        </View>

        <View style={[styles.btnMainContainer, { marginBottom: 100 }]}>
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
            onPress={handleNextButtonPress}>
            {/* onPress={() => router.push("/issues/SaveIssue")}> */}
            <Text style={styles.nextButton}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    height: 300,
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

  dropContainer: {
    width: "100%",
    height: 300,
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
    padding: 20,
    gap: 10,
  },
  mediaItem: {
    alignItems: "center",
    position: "relative",
    width: "45%",
  },
  image: {
    width: "100%",
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
  progressContainer: {
    width: "70%",

    display: "flex",
    flexDirection: "row",
    justifyContent: "center",

    alignItems: "center",
  },
  progressBarOne: {
    backgroundColor: "black",
    width: "33%",
    height: "30%",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  progressBarTwo: {
    backgroundColor: "black",
    width: "33%",
    height: "30%",
  },
  progressBarThree: {
    backgroundColor: "black",
    width: "33%",
    height: "30%",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  documentContainer: {
    width: "100%",
    flexDirection: "column",

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
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 5,
  },
  documentName: {
    fontSize: 14,
    color: "#333",
    marginRight: 10,
  },
});

export default branchMedia;

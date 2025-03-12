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
import { useIssueContext } from "@/context/IssueContext";
import * as ImagePicker from "expo-image-picker";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import uploadMedia from "../../assets/images/issues/uploadMedia.json";
import axios from "axios";
import { getStoredRawToken, getStoredData } from "../../hooks/useJwt";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import * as Animatable from "react-native-animatable";
export default function IssueMedia() {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const { details, setDetails, addMedia, removeMedia } = useIssueContext();
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

  const handleRemoveItem = (uri: string) => {
    removeMedia(uri);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const storedUser = await getStoredData();
      setuser(storedUser?.name || "Unknown User");
    };
    fetchUserDetails();
  }, []);

  const submitIssue = async () => {
    try {
      const formData = new FormData();

      formData.append("title", details.title);
      formData.append("user", user);
      formData.append("anonymous", details.anonymous);
      formData.append("description", details.description);
      formData.append("suggestions", details.suggestions);
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
          name: "issue.jpg",
        });
      }
      if (details.media[1]) {
        formData.append("media", {
          uri: details.media[1].uri.startsWith("file://")
            ? details.media[1].uri
            : `file://${details.media[1].uri}`,
          type: "image/jpeg",
          name: "issue.jpg",
        });
      }
      if (details.media[2]) {
        formData.append("media", {
          uri: details.media[2].uri.startsWith("file://")
            ? details.media[2].uri
            : `file://${details.media[2].uri}`,
          type: "image/jpeg",
          name: "issue.jpg",
        });
      }
      if (details.media[3]) {
        formData.append("media", {
          uri: details.media[3].uri.startsWith("file://")
            ? details.media[3].uri
            : `file://${details.media[3].uri}`,
          type: "image/jpeg",
          name: "issue.jpg",
        });
      }
      if (details.media[4]) {
        formData.append("media", {
          uri: details.media[4].uri.startsWith("file://")
            ? details.media[4].uri
            : `file://${details.media[4].uri}`,
          type: "image/jpeg",
          name: "issue.jpg",
        });
      }

      console.log("FormData:", formData);

      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/users/submitIssue`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Response from server:", response.data);
      router.push("/issues/SaveIssue");
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

    setErrors(newErrors);
    return valid;
  };

  const handleNextButtonPress = () => {
    if (validate()) {
      submitIssue();
    } else {
      console.log("enter all details");
    }
  };

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
      <View style={styles.headerContainer}>
        <ImageBackground
          resizeMode="cover"
          source={require("../../assets/images/blobs/b8.png")}
          style={styles.imgBack}>
          <Animatable.Text animation="fadeInDown" style={styles.title}>
            Create your report
          </Animatable.Text>
          <Animatable.Text animation="fadeInDown" style={styles.subTitle}>
            Add relevant images for your issue
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

      <Animatable.View animation="fadeInUp" style={styles.dataContainer}>
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
            onPress={handleNextButtonPress}>
            {/* onPress={() => router.push("/issues/SaveIssue")}> */}
            <Text style={styles.nextButton}>Next</Text>
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
  progressContainer: {
    width: "70%",

    display: "flex",
    flexDirection: "row",
    justifyContent: "center",

    alignItems: "center",
  },
  progressBarOne: {
    backgroundColor: "#0066ff",
    width: "33%",
    height: "30%",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  progressBarTwo: {
    backgroundColor: "#0066ff",
    width: "33%",
    height: "30%",
  },
  progressBarThree: {
    backgroundColor: "#0066ff",
    width: "33%",
    height: "30%",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
});

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
import * as Animatable from "react-native-animatable";
import { getStoredRawToken, getStoredData } from "../../hooks/useJwt";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { useSocketNotifications } from "@/hooks/useSocketNotifications";

export default function ProposalMedia() {
  const { details, setDetails, addMedia, removeMedia } = useProposalContext();
  const [user, setuser] = useState("");
  const router = useRouter();
  const colorTheme = useColorScheme();
  const currentColors = colorTheme == "dark" ? Colors.dark : Colors.light;

  useSocketNotifications("lekhwargokul84@gmail.com");
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
      router.push("/proposals/ProposalFIles");
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
      <Animatable.View animation="fadeInDown" style={styles.headerContainer}>
        <ImageBackground
          resizeMode="cover"
          source={require("../../assets/images/blobs/b8.png")}
          style={styles.imgBack}>
          <Text style={styles.title}>Submit Your Idea</Text>
          <Text style={styles.subTitle}>
            Attach relevant images to your proposals
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
        <TouchableOpacity
          style={[styles.dropContainer, {}]}
          onPress={pickMedia}>
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
    backgroundColor: "white",
    width: "20%",
    height: "30%",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
});

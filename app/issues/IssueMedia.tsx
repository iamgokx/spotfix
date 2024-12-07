import { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { useIssueContext } from "@/context/IssueContext";
import * as ImagePicker from "expo-image-picker";
import LottieView from "lottie-react-native";
import uploadMedia from "../../assets/images/issues/uploadMedia.json";
export default function IssueMedia({
  goToAddressScreen,
  goToSavingScreen,
}: any) {
  const { details, setDetails, addMedia, removeMedia } = useIssueContext();

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 5 - details.media.length,
    });

    if (!result.canceled) {
      result.assets.forEach((asset) => {
        addMedia({
          uri: asset.uri,
          type: asset.type === "video" ? "video" : "image",
        });
      });
    }
  };

  const handleRemoveItem = (uri: string) => {
    removeMedia(uri);
  };

  return (
    <View style={styles.container}>
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
          <Text style={styles.title}>Create your report</Text>
          <Text style={styles.subTitle}>
            Fill in with the details to get your report registered
          </Text>
        </ImageBackground>
      </View>

      <View style={styles.dataContainer}>
        <TouchableOpacity style={styles.dropContainer} onPress={pickMedia}>
        <LottieView
                source={uploadMedia}
                autoPlay
                loop
                style={{ width: 200, height: 200, marginBottom : -30 }}
              />
          <Text>Upload Media</Text>
        </TouchableOpacity>

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
            style={styles.backBtnContainer}
            onPress={goToAddressScreen}>
            <Text style={styles.backButton}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnContainer}
            onPress={goToSavingScreen}>
            <Text style={styles.nextButton}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
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
});

import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  StatusBar,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  FlatList,
  Switch,
  Image,
} from "react-native";

import { useVideoPlayer, VideoView } from "expo-video";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAnnouncementContext } from "@/context/AnnouncementContext";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";
import uploadMedia from "../../assets/images/issues/uploadMedia.json";

const CreateAnnouncement = ({ goToAddressScreen }: any) => {
  const router = useRouter();
  const { details, setDetails, clearDetails, removeMedia, addMedia } =
    useAnnouncementContext();
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;

  const handleRemoveItem = (uri: string) => {
    removeMedia(uri);
  };
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

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelect = (dep: string) => {
    setDetails((prev) => ({ ...prev, department: dep }));
    setIsModalVisible(false);
  };

  const handleClearButtonPress = () => {
    clearDetails();
    // router.push("/home/reportIssue");
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: currentColors.backgroundDarker },
      ]}
      scrollEnabled={true}>
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
            Create Announcement
          </Animatable.Text>
          <Animatable.Text animation="fadeInDown" style={styles.subTitle}>
            Fill in the details below to make your announcement.
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
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Animatable.View animation="fadeInUp" style={styles.dataContainer}>
          <View style={styles.subContainer}>
            <Text style={[styles.inputTitles, { color: currentColors.text }]}>
              Announcement Title
            </Text>
            <TextInput
              style={[
                styles.dataInput,
                {
                  backgroundColor: currentColors.inputField,
                  color: currentColors.text,
                },
              ]}
              value={details.title}
              onChangeText={(text) =>
                setDetails((prev) => ({ ...prev, title: text }))
              }
              placeholderTextColor={currentColors.textShade}
              placeholder="eg. Major Power Outage in Tiswadi"></TextInput>
          </View>
          <View style={styles.subContainer}>
            <TouchableOpacity
              onPress={() => router.push("/branchAnnouncement/AnnouncementMap")}
              style={[
                styles.dataInput,
                {
                  backgroundColor: currentColors.secondary,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 10,
                },
              ]}>
              <Text style={{ color: "white", fontWeight: 600, fontSize: 15 }}>
                {" "}
                Select Location
              </Text>
              <Feather name="map-pin" size={24} color={"white"} />
            </TouchableOpacity>

            {
              details.generatedAddress && (
                <View style={[styles.subContainer ,{marginTop : 20}]}>
              <Text style={[styles.inputTitles, { color: currentColors.text }]}>
                Generated Address
              </Text>
              <Text
                style={[
                  styles.dataInput,
                  {
                    backgroundColor: currentColors.background,
                    color: currentColors.text,
                  },
                ]}>
                {details.generatedAddress}
              </Text>
            </View>
              )
            }
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
                  style={[
                    styles.backButton,
                    { color: currentColors.secondary },
                  ]}>
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
                <Text style={styles.nextButton}>Next</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </Animatable.View>
      </TouchableWithoutFeedback>
      <View style={{ width: "100%", height: 100 }}></View>
    </ScrollView>
  );
};

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
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "rgb(230, 240, 255)",
  },
  headerContainer: {
    width: "100%",
    height: "20%",

    overflow: "hidden",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  imgBack: {
    width: "100%",
    height: "100%",
    objectFit: "contain",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  title: {
    color: "white",
    textAlign: "center",
    fontSize: 24,
    fontWeight: 600,
  },
  subTitle: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
  },
  progressContainer: {
    width: "70%",

    display: "flex",
    flexDirection: "row",
    justifyContent: "center",

    alignItems: "center",
  },
  progressBarOne: {
    backgroundColor: "yellow",
    width: "33%",
    height: "30%",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  progressBarTwo: {
    backgroundColor: "white",
    width: "33%",
    height: "30%",
  },
  progressBarThree: {
    backgroundColor: "white",
    width: "33%",
    height: "30%",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  dataContainer: {
    width: "100%",
    height: "65%",
    padding: 20,

    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 50,
  },
  subContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  mapContainer: {
    width: "100%",
    backgroundColor: "rgb(0, 102, 255)",
    borderRadius: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    padding: 10,
    gap: 10,
  },
  mapText: {
    fontWeight: 600,
  },
  inputTitles: {
    fontSize: 15,
    width: " 100%",
    marginBottom: 10,
  },
  textInput: {
    height: "auto",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 14,
    padding: 10,
    textAlignVertical: "top",
  },
  dataInput: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 14,
    padding: 10,
  },
  cityTown: {
    width: "100%",

    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 14,
    textAlignVertical: "top",
    padding: 10,
  },
  street: {
    width: "100%",

    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 14,
    textAlignVertical: "top",
    padding: 10,
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
    justifyContent: "space-between",
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

  dropdownButton: {
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,

    alignItems: "center",
    justifyContent: "center",
  },
  dropdownText: {
    width: "100%",
    fontSize: 16,
    color: "#333",
    textAlign: "left",
  },
  modalOverlay: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    maxHeight: 500,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
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
  dropContainer: {
    width: "100%",
    height: 200,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#0066ff",
    borderStyle: "dashed",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    paddingVertical: 40,
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
});
export default CreateAnnouncement;

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
import docIcon from "../../assets/images/proposals/docs.png";
import pdfIcon from "../../assets/images/proposals/pdf.png";
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
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useEffect } from "react";
import { getStoredData } from "@/hooks/useJwt";
import { nextWednesday } from "date-fns";

const CreateAnnouncement = ({ goToAddressScreen }: any) => {
  const router = useRouter();
  const {
    details,
    setDetails,
    clearDetails,
    removeMedia,
    addMedia,
    addDocument,
    removeDocument,
  } = useAnnouncementContext();
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const [errors, setErrors] = useState({});
  const [departmentDetails, setdepartmentDetails] = useState();

  const handleRemoveItem = (uri: string) => {
    removeMedia(uri);
  };
  const addedDetails = details || {};
  const validateAnnouncement = () => {
    let valid = true;
    let newErrors = {};

    if (!addedDetails.title || addedDetails.title.trim() === "") {
      newErrors.title = "Please enter title";
      valid = false;
    } else if (/^\d+$/.test(addedDetails.title)) {
      newErrors.title = "Title cannot contain only numbers";
      valid = false;
    } else if (addedDetails.title.length < 20) {
      newErrors.title = "Title should be at least 20 characters long";
      valid = false
    } else if (addedDetails.title.length >= 100) {
      newErrors.title = "Title should be at most 100 characters long";
      valid = false
    }

    if (!addedDetails.generatedAddress) {
      newErrors.generatedAddress = "Please select the locaton";
      valid = false;
    }

    if (addedDetails.media.length < 1) {
      newErrors.media = "Please select at leaset 1 media file";
      valid = false;
      console.log("media array lenght : ", details.media.length);
    }

    setErrors(newErrors);
    return valid;
  };

  const handleNextBtnPress = () => {
    if (validateAnnouncement()) {
      router.push("/branchAnnouncement/AnnoucnementDescription");
    } else {
      console.log("add all fields ");
    }
  };

  useEffect(() => {
    const getDepartmentDetails = async () => {
      try {
        const user = await getStoredData();
        console.log(user);
        const idResponse = await axios.post(
          `http://${API_IP_ADDRESS}:8000/api/department/getDepartmentId`,
          {
            email: user.email,
          }
        );

        if (idResponse) {
          console.log(idResponse.data.results);
          setdepartmentDetails(idResponse.data.results);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getDepartmentDetails();
  }, []);

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
        console.log(result);
        const newDocuments = result.assets.map((asset) => ({
          uri: asset.uri,
          type: asset.mimeType,
          name: asset.name,
          size: asset.size,
        }));

        console.log("details : ", result.assets[0].uri);
        console.log("details : ", result.assets[0].mimeType);
        console.log("details : ", result.assets[0].name);
        console.log("details : ", result.assets[0].size);

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

  const handleRemoveDocument = (uri: string) => {
    removeDocument(uri);
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
          </Animatable.View>
        </ImageBackground>
      </View>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        style={{ flex: 1 }}>
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
            {errors.title && (
              <Text
                style={{ color: "red", textAlign: "center", marginTop: 10 }}>
                {errors.title}
              </Text>
            )}
          </View>
          <View style={styles.subContainer}>
            <Text style={[styles.inputTitles, { color: currentColors.text }]}>
              Location
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/branchAnnouncement/AnnouncementMap")}
              style={[
                styles.dataInput,
                {
                  backgroundColor: currentColors.secondary,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 10,
                },
              ]}>
              {details.generatedAddress === "" ? (
                <>
                  <Text
                    style={{ color: "white", fontWeight: "600", fontSize: 15 }}>
                    Select Location
                  </Text>
                  <Feather name="map-pin" size={24} color="white" />
                </>
              ) : (
                <TextInput
                  multiline
                  style={{ color: "white", fontSize: 15 }}
                  editable={false}>
                  {details.generatedAddress}
                </TextInput>
              )}
            </TouchableOpacity>
            {errors.generatedAddress && (
              <Text
                style={{ color: "red", textAlign: "center", marginTop: 10 }}>
                {errors.generatedAddress}
              </Text>
            )}
          </View>

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

          <TouchableOpacity
            style={styles.dropContainer}
            onPress={pickDocuments}>
            <LottieView
              source={uploadMedia}
              autoPlay
              loop
              style={{ width: 200, height: 200, marginBottom: -30 }}
            />
            <Text style={{ color: currentColors.text }}>Upload Files</Text>
          </TouchableOpacity>

          {details.documents && (
            <View style={styles.documentContainer}>
              {details.documents.map((doc, index) => (
                <View key={index} style={styles.documentItem}>
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={doc.type == "application/pdf" ? pdfIcon : docIcon}
                  />
                  <Text
                    style={[
                      styles.documentName,
                      { color: currentColors.text },
                    ]}>
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
                <Text style={{ color: "white" }}>
                  Document upload limit reached (5/5).
                </Text>
              )}
            </View>
          )}

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
              onPress={handleNextBtnPress}>
              <Text style={styles.nextButton}>Next</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </TouchableWithoutFeedback>
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

export const styles = StyleSheet.create({
  video: {
    flex: 1,
    width: "200%",
    height: "100%",
    alignSelf: "center",
  },
  container: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: "rgb(230, 240, 255)",
  },
  headerContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  imgBack: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginTop: 5,
  },
  progressContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBarOne: {
    width: 30,
    height: 5,
    backgroundColor: "black",
    borderRadius: 10,
    marginHorizontal: 3,
  },
  progressBarTwo: {
    width: 30,
    height: 5,
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: 3,
  },
  progressBarThree: {
    width: 30,
    height: 5,
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: 3,
  },
  dataContainer: {
    flex: 1,
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    gap: 20,
  },
  subContainer: {
    marginBottom: 15,
  },
  inputTitles: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  dataInput: {
    minHeight: 50,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "black",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  dropContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#0066ff",
    borderStyle: "dashed",

    paddingVertical: 20,
    marginBottom: 15,
  },
  mediaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
    gap: 10,
  },
  mediaItem: {
    width: "48%",
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  removePosition: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 15,
    padding: 5,
  },
  removeBtn: {
    fontSize: 16,
  },
  documentContainer: {
    marginTop: 10,

    padding: 10,
    borderRadius: 10,
  },
  mediaWrapper: {
    width: 200,
    height: 100,
    overflow: "hidden",
    backgroundColor: "#000",
    borderRadius: 20,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  documentName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  btnMainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  backBtnContainer: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 50,
    alignItems: "center",
    marginRight: 10,
  },
  backButton: {
    fontSize: 16,
    fontWeight: "600",
  },
  btnContainer: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: "center",
  },
  nextButton: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default CreateAnnouncement;

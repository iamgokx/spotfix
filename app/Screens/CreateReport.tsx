import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Image } from "react-native";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import uploadMedia from "../../assets/images/issues/uploadMedia.json";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";
import { getStoredData } from "@/hooks/useJwt";

import { Alert } from "react-native";
const CreateReport = () => {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const image = params?.image || "";
  const title = params?.title || "No Title";
  const priority = params?.priority || "Low";
  const status = params?.status || "Pending";
  const city = params?.city || "Unknown City";
  const date = params?.date || "Unknown Date";
  const state = params?.state || "Goa";
  const pincode = params?.pincode || "000000";
  const id = params?.id;
  const router = useRouter();

  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [reporttitle, setreportTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<{ uri: string; type: string }[]>([]);
  const rouer = useRouter();
  const [errors, setErrors] = useState({});

  const validateReport = () => {
    let valid = true;
    let newErrors = {};

    if (!reporttitle || reporttitle.trim() === "") {
      newErrors.title = "Please enter title";
    } else if (/^\d+$/.test(reporttitle)) {
      newErrors.title = "Title cannot contain only numbers";
      valid = false;
    } else if (reporttitle.length < 20) {
      newErrors.title = "Title should be at least 20 characters long";
      valid = false;
    } else if (reporttitle.length >= 100) {
      newErrors.title = "Title should be at most 100 characters long";
      valid = false;
    }

    if (!description || description.trim() === "") {
      newErrors.description = "Please enter description";
      valid = false;
    } else if (/^\d+$/.test(description)) {
      newErrors.description = "Description cannot contain only numbers";
      valid = false;
    } else if (description.length < 50) {
      newErrors.description =
        "Description should be at least 50 characters long";
      valid = false;
    }

    if (media.length < 1) {
      newErrors.media =
        "Please add atleast 1 image to show your work one towards this issue";
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  const submitReport = async () => {
    const user = await getStoredData();
    const email = user.email;
    console.log("email: ", email);
    try {
      const formData = new FormData();

      formData.append("title", reporttitle);
      formData.append("description", description);
      formData.append("email", email);
      formData.append("issueId", id);

      if (media[0]) {
        formData.append("media", {
          uri: media[0].uri.startsWith("file://")
            ? media[0].uri
            : `file://${media[0].uri}`,
          type: "image/jpeg",
          name: "reports.jpg",
        });
      }
      if (media[1]) {
        formData.append("media", {
          uri: media[1].uri.startsWith("file://")
            ? media[1].uri
            : `file://${media[1].uri}`,
          type: "image/jpeg",
          name: "issue.jpg",
        });
      }
      if (media[2]) {
        formData.append("media", {
          uri: media[2].uri.startsWith("file://")
            ? media[2].uri
            : `file://${media[2].uri}`,
          type: "image/jpeg",
          name: "issue.jpg",
        });
      }
      if (media[3]) {
        formData.append("media", {
          uri: media[3].uri.startsWith("file://")
            ? media[3].uri
            : `file://${media[3].uri}`,
          type: "image/jpeg",
          name: "issue.jpg",
        });
      }
      if (media[4]) {
        formData.append("media", {
          uri: media[4].uri.startsWith("file://")
            ? media[4].uri
            : `file://${media[4].uri}`,
          type: "image/jpeg",
          name: "issue.jpg",
        });
      }

      console.log("form data , ", formData);
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/subBranchCoordinator/makeReport`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.status) {
        console.log(response.data.message);
        Alert.alert(
          "Report Status",
          response.data.message,
          [
            {
              text: "OK",
              onPress: () => {
                console.log("OK Pressed");
                rouer.back();
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log("error");
    }
  };

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 5 - media.length,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const newImages = result.assets.map((asset) => ({
        uri: asset.uri.startsWith("file://")
          ? asset.uri
          : `file://${asset.uri}`,
        type: asset.type === "video" ? "video" : "image",
      }));
      result.assets.forEach((asset) => {
        setMedia([
          ...media,
          ...result.assets.map((file) => ({ uri: file.uri, type: file.type })),
        ]);
      });
    } else {
      console.log("No media selected or operation canceled.");
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
  };

  const handleSubmitPress = () => {
    if (validateReport()) {
      console.log("all details entered");
      submitReport();
    } else {
      console.log(" add all fields");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: currentColors.backgroundDarker,
        gap: 20,
        alignItems: "center",
        flexDirection: "column",
        alignContent: "center",
      }}>
      <View
        style={{
          paddingTop: insets.top + 10,
          backgroundColor: currentColors.background,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          width: "100%",
        }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: currentColors.background,
            padding: 20,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ position: "absolute", left: 10 }}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={currentColors.secondary}
            />
          </TouchableOpacity>

          <Text
            style={{
              color: currentColors.secondary,
              textAlign: "center",
              fontSize: 20,
              fontWeight: 900,
            }}>
            Create Report
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 50 }}>
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/screens/SubBranchDetailedIssue",
              params: { issue_id: id },
            });
          }}
          style={{
            width: "90%",
            backgroundColor: currentColors.backgroundDarkest,
            flexDirection: "row",
            borderRadius: 20,

            marginTop: 10,
            zIndex: 1,
          }}>
          {image && (
            <Image
              source={{
                uri: `http://${API_IP_ADDRESS}:8000/uploads/issues/${image}`,
              }}
              resizeMode="cover"
              style={{ width: "30%", borderRadius: 20 }}
            />
          )}

          <View style={{ width: "70%", padding: 10 }}>
            <Text
              style={{
                color: currentColors.text,
                fontSize: 18,
                fontWeight: "bold",
              }}>
              {title}
            </Text>
            <Text style={{ color: currentColors.textShade }}>
              Location: {city}, {state} - {pincode}
            </Text>
            <Text style={{ color: currentColors.text }}>{date}</Text>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <Text
                style={{
                  backgroundColor: currentColors.secondary,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 20,
                  color: currentColors.text,
                }}>
                {status}
              </Text>
              <Text
                style={{
                  backgroundColor: currentColors.text,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 20,
                  color: currentColors.textSecondary,
                }}>
                Priority: {priority}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={{ width: "100%", padding: 20, gap: 10 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 10,
              color: currentColors.text,
            }}>
            Create Report
          </Text>

          <Text style={{ color: currentColors.text }}>Report Title</Text>
          <TextInput
            placeholderTextColor={currentColors.textShade}
            value={reporttitle}
            onChangeText={setreportTitle}
            placeholder="Enter title"
            style={{
              borderWidth: 1,
              backgroundColor: currentColors.background,
              padding: 15,
              borderRadius: 30,
              marginBottom: 10,
              color: currentColors.text,
              marginBottom: 10,
            }}
          />
          {errors.title && (
            <Text style={{ color: "red", textAlign: "center" }}>
              {errors.title}
            </Text>
          )}

          <Text style={{ color: currentColors.text }}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            placeholderTextColor={currentColors.textShade}
            multiline
            style={{
              backgroundColor: currentColors.background,
              borderRadius: 20,
              padding: 10,
              minHeight: 100,
              textAlign: "left",
              textAlignVertical: "top",
              color: currentColors.text,
              marginBottom: 10,
            }}
          />
          {errors.description && (
            <Text style={{ color: "red", textAlign: "center" }}>
              {errors.description}
            </Text>
          )}
          <Text style={{ color: currentColors.text }}>
            Add work completed Images{" "}
          </Text>
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
            {media.map((item, index) => (
              <View key={index} style={styles.mediaItem}>
                {item.type === "image" ? (
                  <Image source={{ uri: item.uri }} style={styles.image} />
                ) : (
                  <VideoComponent uri={item.uri} />
                )}
                <TouchableOpacity
                  onPress={() => handleRemoveMedia(index)}
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

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                flex: 1,
                padding: 15,
                borderRadius: 25,
                backgroundColor: "#ddd",
                alignItems: "center",
                marginRight: 10,
              }}>
              <Text style={{ color: "#000", fontWeight: "bold", fontSize: 18 }}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmitPress}
              style={{
                flex: 1,
                padding: 15,
                borderRadius: 25,
                backgroundColor: currentColors.secondary,
                alignItems: "center",
              }}>
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
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
  dropContainer: {
    width: "100%",
    height: 250,
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
  mediaWrapper: {
    width: 200,
    height: 100,
    overflow: "hidden",
    backgroundColor: "#000",
    borderRadius: 20,
    objectFit: "cover",
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
});

export default CreateReport;

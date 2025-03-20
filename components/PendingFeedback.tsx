import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FontAwesome } from "@expo/vector-icons";

import axios from "axios";
import { API_IP_ADDRESS } from "../ipConfig.json";
import { useState, useEffect, useCallback } from "react";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getStoredData } from "@/hooks/useJwt";
import { useRouter } from "expo-router";
import { styles } from "@/app/branchAnnouncement/AnnoucnementDescription";
import { Feather, Ionicons } from "@expo/vector-icons";
import watermark from "../assets/images/watermark.png";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";
import loadingAni from "../assets/lottie/loading.json";
const PendingFeedback = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [pendingFeedbackData, setPendingFeedbackData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [visible, setVisible] = useState(null);
  const [loading, setloading] = useState(false);
  const [selectedStars, setSelectedStars] = useState(0);

  const [success, setsuccess] = useState(false);
  const [modalMessage, setmodalMessage] = useState("");

  const handleStarPress = (star) => {
    setSelectedStars(star);
  };

  const router = useRouter();
  const getPendingFeedback = async () => {
    try {
      const user = await getStoredData();
      const email = user.email;
      console.log("email: ", email);

      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/users/getPendingFeedback`,
        { email }
      );

      if (response.data.status) {
        console.log(response.data.results);
        setPendingFeedbackData(response.data.results);
      } else {
        console.log("No pending feedback for this user");
        setPendingFeedbackData([]);
      }
    } catch (error) {
      console.log("Error fetching pending feedback:", error);
    }
  };

  useEffect(() => {
    getPendingFeedback();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getPendingFeedback().then(() => setRefreshing(false));
  }, []);

  const [errors, seterrors] = useState({});

  const validate = () => {
    let newErrors = {};
    let valid = true;

    if (!feedback || feedback.trim() === "") {
      newErrors.feedback = "Please enter feedback to submit...";

      valid = false;
    } else if (/^\d+$/.test(feedback)) {
      newErrors.feedback = "Title cannot contain only numbers";
      valid = false;
    } else if (feedback.length < 50) {
      newErrors.feedback = "feedback cannot be so short...";
      valid = false;
    } else if (feedback.length > 1000) {
      newErrors.feedback = "Feedback cannot be so long...";
      valid = false;
    }

    if (selectedStars < 1) {
      newErrors.stars = "Please rate how satisfied you are...";
      valid = false;
    }

    seterrors(newErrors);
    return valid;
  };

  const submitFeedback = async (issueId) => {
    try {
      setloading(true);

      setTimeout(() => {
        setloading(false)
      }, 10000);
      console.log(issueId);

      const resposne = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/users/sendFeedback`,
        {
          issueId: issueId,
          feedback: feedback,
          ratings: selectedStars,
        }
      );

      if (resposne.data.status) {
        setloading(false);
        setmodalMessage(resposne.data.message);
        setsuccess(true);
      } else {
        setloading(false);
        Alert.alert("Feedback Status", resposne.data.message, [{ text: "OK" }]);
      }
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  const handleSubmitBtnpress = (issueId) => {
    if (validate()) {
      console.log("all good to submit");
      submitFeedback(issueId);
    } else {
      console.log("add all fields");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        console.log("press");
        console.log(item.issue_id);
        setVisible(item.issue_id);
      }}
      style={{
        marginVertical: 8,
        marginHorizontal: 10,
        backgroundColor: currentColors.backgroundDarker,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
        flexDirection: "row",
        gap: 10,
        overflow : 'hidden'
      }}>
      <Modal visible={success} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <View
            style={{
              backgroundColor: currentColors.secondary,
              padding: 20,
              borderRadius: 10,
              width: "80%",
              alignItems: "center",
              elevation: 5,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
                color: "white",
              }}>
              - Feedback Status -
            </Text>

            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                marginBottom: 20,
              }}>
              {modalMessage}
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: "white",
                paddingVertical: 10,
                paddingHorizontal: 40,
                borderRadius: 20,
                elevation: 5,
                shadowColor: "black",
              }}
              onPress={() => {
                console.log("close");
                setFeedback("");
                setSelectedStars(0);
                setsuccess(false);
                setloading(false);
                setVisible(false);
                getPendingFeedback();
              }}>
              <Text style={{ color: "black", fontSize: 18, fontWeight: 900 }}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={visible === item.issue_id}
        transparent
        animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}>
          <View
            style={{
              backgroundColor: currentColors.backgroundDarker,
              borderWidth: 1,
              borderColor:
                colorScheme == "dark"
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.2)",
              borderRadius: 20,

              width: "90%",
              gap: 20,
              alignItems: "center",
              elevation: 10,
              shadowColor: "rgba(0,0,0,0.4)",
            }}>
            <View style={{ width: "100%", marginBottom: 10 }}>
              <TouchableOpacity
                onPress={() => setVisible(null)}
                style={{
                  borderRadius: 20,

                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  position: "absolute",
                  right: 0,
                  padding: 10,
                }}>
                <Ionicons name="close-circle" color={"white"} size={29} />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                color: currentColors.text,
                fontSize: 20,
                textAlign: "center",
                fontWeight: 900,
                padding: 15,
              }}>
              <Text style={{ color: currentColors.secondary }}>Title : </Text>
              {item.title}
            </Text>
            <Text
              style={{
                padding: 15,
                marginTop: 20,
                fontSize: 17,
                color: currentColors.text,
              }}>
              <Text
                style={{
                  color: currentColors.secondary,
                  fontSize: 20,
                  fontWeight: 900,
                }}>
                Description :{" "}
              </Text>
              {item.issue_description.length > 40
                ? item.issue_description.slice(0, 90) + "..."
                : item.issue_description}
            </Text>

            <TextInput
              style={{
                backgroundColor: currentColors.background,
                color: currentColors.text,
                borderRadius: 20,
                minHeight: 100,
                textAlignVertical: "top",
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.2)",
                elevation: 10,
                width: "90%",
                padding: 10,
              }}
              placeholder="Tell us about your experience..."
              placeholderTextColor={currentColors.textShade}
              multiline
              value={feedback}
              onChangeText={setFeedback}
            />
            {errors.feedback && (
              <Text style={{ color: "red", textAlign: "center" }}>
                {errors.feedback}
              </Text>
            )}
            <View
              style={{
                flexDirection: "column",
                gap: 10,
                alignSelf: "flex-start",
                padding: 15,
              }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: 900,
                  alignSelf: "flex-start",
                  color: currentColors.text,
                }}>
                How satisfied are you with the solution?
              </Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                {[1, 2, 3, 4, 5].map((star, index) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => handleStarPress(star)}>
                    <AntDesign
                      name={star <= selectedStars ? "star" : "staro"}
                      size={24}
                      color={star <= selectedStars ? "gold" : "gray"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {errors.stars && (
              <Text style={{ color: "red", textAlign: "center" }}>
                {errors.stars}
              </Text>
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 20,
                width: "90%",
                padding: 15,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: currentColors.primary,
                  padding: 10,
                  borderRadius: 60,
                  width: "50%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                }}
                onPress={() => {
                  handleSubmitBtnpress(item.issue_id);
                }}>
                <FontAwesome name="send" color={"white"} size={24} />
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: 800,
                    textAlign: "center",
                  }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>

            {loading && (
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,0.6)",
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <LottieView
                  source={loadingAni}
                  style={{ width: 100, height: 80 }}
                  autoPlay
                  loop></LottieView>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Image
        source={{
          uri: `http://${API_IP_ADDRESS}:8000/uploads/issues/${item.media_file}`,
        }}
        style={{ width: "30%", height: "100%" }}></Image>
      <View style={{ width: "70%", padding: 10, alignItems: "flex-start" }}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 18,
            color: currentColors.secondary,
          }}>
          {item.title}
        </Text>
        <Text style={{ color: currentColors.textShade, marginTop: 5 }}>
          Locality: {item.locality}, {item.city}, {item.pincode}
        </Text>
        <Text
          style={{
            color: "white",
            marginTop: 20,
            backgroundColor: currentColors.primary,
            borderRadius: 20,
            padding: 10,
            fontWeight: 900,
            alignSelf: "flex-end",
          }}>
          Status: {item.issue_status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: currentColors.backgroundDarkest,
        padding: 10,
      }}>
      <FlatList
        data={pendingFeedbackData}
        keyExtractor={(item) => item.issue_id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No pending feedback
          </Text>
        }
        ListFooterComponent={
          <Animatable.View
            animation={"fadeInUp"}
            style={{
              marginTop: 100,
              paddingBottom: insets.bottom + 20,
              gap: 10,
            }}>
            <Image
              source={watermark}
              style={{ width: "100%", height: 100, objectFit: "contain" }}
            />
          </Animatable.View>
        }
      />
    </View>
  );
};

export default PendingFeedback;

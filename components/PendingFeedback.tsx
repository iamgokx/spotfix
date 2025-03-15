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
} from "react-native";
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

const PendingFeedback = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [pendingFeedbackData, setPendingFeedbackData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [visible, setVisible] = useState(false);

  const [selectedStars, setSelectedStars] = useState(0);

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

  const onSubmit = () => {
    try {
      
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        console.log("press");
        console.log(item.issue_id);
        setVisible(true);
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
      }}>
      <Modal visible={visible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 20,
              padding: 10,
              width: "90%",
              gap: 20,
              alignItems: "center",
            }}>
            <Text
              style={{
                color: currentColors.secondary,
                fontSize: 20,
                textAlign: "center",
                fontWeight: 900,
                padding: 10,
              }}>
              {item.title}
            </Text>
            <Text style={{ padding: 10, marginTop: 20, fontSize: 17 }}>
              {item.issue_description.length > 40
                ? item.issue_description.slice(0, 90) + "..."
                : item.issue_description}
            </Text>

            <TextInput
              style={{
                backgroundColor: "white",
                borderRadius: 20,
                minHeight: 100,
                textAlignVertical: "top",
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.1)",
                elevation: 10,
                width: "100%",
                padding: 10,
              }}
              placeholder="Tell us about your experience..."
              multiline
              value={feedback}
              onChangeText={setFeedback}
            />

            <View
              style={{
                flexDirection: "column",
                gap: 10,
                alignSelf: "flex-start",
              }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: 900,
                  alignSelf: "flex-start",
                }}>
                Rate Your Experience
              </Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                {[1, 2, 3, 4, 5].map((star, index) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => handleStarPress(star)}>
                    <Ionicons
                      name={star <= selectedStars ? "star" : "star-outline"}
                      size={24}
                      color={star <= selectedStars ? "gold" : "gray"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 20,
                width: "90%",
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: currentColors.primary,
                  padding: 10,
                  borderRadius: 20,
                  width: "50%",
                }}
                onPress={() => {
                  onSubmit(feedback, rating);
                  setFeedback("");
                  setRating(0);
                }}>
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

              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={{
                  backgroundColor: "red",
                  padding: 10,
                  borderRadius: 20,
                  width: "50%",
                }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: 800,
                    textAlign: "center",
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
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
      {/* //feedback form  */}

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
      />
    </View>
  );
};

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContainer: {
//     width: "85%",
//     backgroundColor: "white",
//     padding: 20,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   description: {
//     fontSize: 14,
//     color: "#777",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   input: {
//     width: "100%",
//     height: 80,
//     borderColor: "#ddd",
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 10,
//     textAlignVertical: "top",
//     marginBottom: 10,
//   },
//   ratingTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginTop: 10,
//   },
//   starsContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginVertical: 10,
//   },
//   submitButton: {
//     backgroundColor: "#007BFF",
//     width: "100%",
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   submitText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   closeButton: {
//     marginTop: 10,
//   },
//   closeText: {
//     color: "#777",
//     fontSize: 14,
//   },
// });

export default PendingFeedback;

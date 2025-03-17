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
const CompletedFeedback = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [repliedFeedback, setrepliedFeedback] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const [visible, setvisible] = useState(null);
  const router = useRouter();
  const getRepliedFeedback = async () => {
    try {
      const user = await getStoredData();
      const email = user.email;
      console.log("email: ", email);

      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/users/getRepliedFeedback`,
        { email }
      );

      if (response.data.status) {
        console.log('*********',response.data.results);
        setrepliedFeedback(response.data.results);
      } else {
        console.log("No pending feedback for this user");
        setrepliedFeedback([]);
      }
    } catch (error) {
      console.log("Error fetching pending feedback:", error);
    }
  };

  useEffect(() => {
    getRepliedFeedback();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getRepliedFeedback().then(() => setRefreshing(false));
  }, []);

  const renderItem = ({ item }) => (
    <View
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
        overflow: "hidden",
      }}>
      <Modal visible={visible == item.issue_id} transparent animationType="fade">
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
              alignItems: "flex-start",
              elevation: 10,
              paddingHorizontal: 10,
              shadowColor: "rgba(0,0,0,0.4)",
            }}>
            <View style={{ width: "100%", marginBottom: 10 }}>
              <TouchableOpacity
                onPress={() => setvisible(null)}
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

                fontWeight: 900,
                padding: 15,
              }}>
              <Text style={{ color: currentColors.secondary }}>Title : </Text>
              {item.title}
            </Text>
            <Text
              style={{
                padding: 15,

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
                width: "100%",
                padding: 10,
              }}
              placeholder="Tell us about your experience..."
              placeholderTextColor={currentColors.textShade}
              multiline
              value={item.feedback_text}
              editable={false}
            />

            <View
              style={{
                flexDirection: "column",
                gap: 10,
                alignSelf: "flex-start",
                padding: 15,
              }}>
              <View style={{ flexDirection: "row", gap: 10 }}>
                {Array.from({ length: item.rating }, (_, index) => (
                  <AntDesign key={index} name="star" size={24} color={"gold"} />
                ))}
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 20,
                width: "90%",
                padding: 15,
              }}></View>
          </View>
        </View>
      </Modal>

      <View style={{ width: "100%", flexDirection: "row", gap: 10 }}>
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
      </View>

      <TouchableOpacity
        onPress={() => {
          setvisible(item.issue_id);
        }}
        style={{
          width: "100%",
          backgroundColor: currentColors.secondary,
          padding: 10,
        }}>
        <Text
          style={{
            textAlign: "center",
            fontWeight: 900,
            color: currentColors.text,
          }}>
          Tap to view Feedback
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: currentColors.backgroundDarkest,
        padding: 10,
      }}>
      <FlatList
        data={repliedFeedback}
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

export default CompletedFeedback;

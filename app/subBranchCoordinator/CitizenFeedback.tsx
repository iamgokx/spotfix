import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Image,
} from "react-native";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { getStoredData } from "@/hooks/useJwt";
import { ScrollView } from "react-native-gesture-handler";
import { CurrentRenderContext } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import watermark from "../../assets/images/watermark.png";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
const CitizenFeedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const [mediaFiles, setmediaFiles] = useState();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const getUserFeedback = async () => {
    try {
      const user = await getStoredData();
      const email = user.email;
      console.log("email: ", email);

      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/subBranchCoordinator/getFeedback`,
        { email: email }
      );

      if (response.data.status) {
        console.log(response.data.results);
        setFeedbackData(response.data.results);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserFeedback();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getUserFeedback().then(() => setRefreshing(false));
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(",", "");
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentColors.backgroundDarkest, padding: 10 },
      ]}>
      {feedbackData.length > 0 ? (
        <FlatList
          data={feedbackData}
          keyExtractor={(item) => item.issue_id.toString()}
          renderItem={({ item, index }) => {
            const mediaArray = item.media_files
              ? item.media_files.split(",")
              : [];

            return (
              <Animatable.View
                delay={50 * index}
                animation={"fadeInUp"}
                style={{
                  width: "100%",
                  padding: 10,
                  backgroundColor: currentColors.background,
                  borderRadius: 20,
                  gap: 10,
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}>
                  <Image
                    source={{
                      uri: `http://${API_IP_ADDRESS}:8000/uploads/profile/${item.issue_creator_picture_name}`,
                    }}
                    style={{ width: 70, height: 70, borderRadius: 500 }}
                  />

                  <View>
                    <Text
                      style={{ color: currentColors.secondary, fontSize: 20 }}>
                      {item.issue_creator_name}
                    </Text>
                    <Text
                      style={{ color: currentColors.textShade, fontSize: 15 }}>
                      {formatDate(item.date_time_submitted)}
                    </Text>
                  </View>
                </View>

                <View style={{ gap: 10 }}>
                  <Text style={{ color: currentColors.text }}>
                    <Text
                      style={{
                        color: currentColors.secondary,
                        fontSize: 18,
                      }}></Text>
                    {item.feedback_text}
                  </Text>

                  <View style={{ flexDirection: "row" }}>
                    {Array.from({ length: item.rating }, (_, index) => (
                      <AntDesign
                        key={index}
                        name="star"
                        size={20}
                        color="#FFD700"
                      />
                    ))}
                  </View>
                </View>

                <View style={{ marginTop: 20, gap: 10 }}>
                  <Text
                    style={{ color: currentColors.secondary, fontSize: 18 }}>
                    Issue Details{" "}
                  </Text>

                  <Text style={{ color: currentColors.text }}>
                    {item.issue_title}
                  </Text>
                  <Text style={{ color: currentColors.text }}>
                    {`${item.issue_description.slice(0, 100)}...`}
                  </Text>
                  {mediaArray.length > 0 && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={{ marginTop: 10,borderRadius : 20 }}>
                      {mediaArray.map((fileName, idx) => (
                        <Image
                          key={idx}
                          source={{
                            uri: `http://${API_IP_ADDRESS}:8000/uploads/issues/${fileName}`,
                          }}
                          style={{
                            width: 220,
                            height: 120,
                            borderRadius: 10,
                            marginRight: 10,
                          }}
                        />
                      ))}
                    </ScrollView>
                  )}
                </View>
              </Animatable.View>
            );
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={
            <Animatable.View
              animation={"slideInUp"}
              style={{ marginTop: 100, paddingBottom: insets.bottom + 20 }}>
              <Image
                source={watermark}
                style={{ width: "100%", height: 100, objectFit: "contain" }}
              />
            </Animatable.View>
          }
        />
      ) : (
        <Text style={styles.noData}>No feedback available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  feedbackCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  feedback: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
  },
  rating: {
    fontSize: 14,
    color: "#ff9800",
    fontWeight: "bold",
  },
  pincode: {
    fontSize: 12,
    color: "#777",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    color: "#444",
  },
  text: {
    fontSize: 14,
    color: "#666",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 10,
  },
  noData: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});

export default CitizenFeedback;

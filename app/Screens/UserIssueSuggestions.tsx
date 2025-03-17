import { View, Text, FlatList, RefreshControl, Image } from "react-native";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useState, useEffect, useCallback } from "react";
import { getStoredData } from "@/hooks/useJwt";
import { CurrentRenderContext } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import * as Animatable from "react-native-animatable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import watermark from "../../assets/images/watermark.png";
import { Feather } from "@expo/vector-icons";
const UserIssueSuggestions = () => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const getUserIssueSuggestion = async () => {
    const user = await getStoredData();
    const email = user.email;

    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/users/getIssueProfileSuggestions`,
        { email }
      );

      if (response.data.status) {
        setData(response.data.results);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getUserIssueSuggestion();
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await getUserIssueSuggestion();
    setRefreshing(false);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        backgroundColor: currentColors.backgroundDarker,
      }}>
      {data.length === 0 ? (
        <Text
          style={{
            textAlign: "center",
            marginTop: 20,
            color: currentColors.text,
          }}>
          No Suggestions Found
        </Text>
      ) : (
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          keyExtractor={(file, index) => `${file.id}-${index}-images`}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                backgroundColor: "#ddd",
                marginHorizontal: 20,
                marginVertical: 20,
              }}
            />
          )}
          renderItem={({ item }) => {
            const mediaFiles =
              item.media_files !== "No Media"
                ? item.media_files.split(",").map((file) => file.trim())
                : [];

            return (
              <View
                style={{
                  padding: 20,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: currentColors.secondary,
                  }}>
                  {item.title}
                </Text>
                <Text style={{ color: "gray" }}>
                  {item.locality}, {item.pincode}
                </Text>
                <Text style={{ marginTop: 5, color: currentColors.text }}>
                  {item.issue_description.split(" ").slice(0, 20).join(" ")}
                  {item.issue_description.split(" ").length > 20 ? "..." : ""}
                </Text>
                {item.suggestion && (
                  <Text
                    style={{
                      fontStyle: "italic",
                      marginTop: 5,
                      color: currentColors.secondary,
                      alignItems: "center",
                    }}>
                    <Feather name="message-circle" size={24} /> {" "}
                    {item.suggestion}
                  </Text>
                )}

                {mediaFiles.length > 0 && (
                  <View style={{ marginTop: 10 }}>
                    <FlatList
                      data={mediaFiles}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(file, index) =>
                        `${item.id}-${file}-${index}-images`
                      }
                      renderItem={({ item: file }) => (
                        <Image
                          source={{
                            uri: `http://${API_IP_ADDRESS}:8000/uploads/issues/${file}`,
                          }}
                          style={{
                            width: 100,
                            height: 100,
                            borderRadius: 10,
                            marginRight: 10,
                          }}
                          resizeMode="cover"
                        />
                      )}
                    />
                  </View>
                )}
              </View>
            );
          }}
          ListFooterComponent={
            <Animatable.View
              animation={"fadeInUp"}
              style={{
                marginTop: 100,
                paddingBottom: insets.bottom + 100,
                gap: 10,
              }}>
              <Image
                source={watermark}
                style={{ width: "100%", height: 100, objectFit: "contain" }}
              />
            </Animatable.View>
          }
        />
      )}
    </View>
  );
};

export default UserIssueSuggestions;

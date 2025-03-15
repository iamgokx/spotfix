import {
  View,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useEffect, useState, useCallback } from "react";
import { clearStorage, getStoredData } from "@/hooks/useJwt";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import watermark from "../../assets/images/watermark.png";
const PendingIssues = () => {
  const router = useRouter();
  const [issuesData, setIssuesData] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const getIssues = async () => {
    const user = await getStoredData();
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/subBranchCoordinator/getIssues`,
        {
          email: user.email,
        }
      );

      if (response.data.status) {
        console.log(response.data.results);
        setIssuesData(response.data.results);
        setFilteredIssues(response.data.results);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getIssues();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getIssues();
    setRefreshing(false);
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: currentColors.backgroundDarkest,
        paddingBottom: insets.bottom + 10,
        padding: 20,
        paddingHorizontal: 20,
      }}>
      <FlatList
        data={filteredIssues}
        keyExtractor={(item) => item.issue_id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          <View style={{ marginTop: 100, paddingBottom: insets.bottom + 20 }}>
            <Image
              source={watermark}
              style={{ width: "100%", height: 100, objectFit: "contain" }}
            />
          </View>
        }
        renderItem={({ item }) => {
          const firstFileName = item.file_names
            ? item.file_names.split(",")[0].trim()
            : null;
          const imageUrl = firstFileName
            ? `http://${API_IP_ADDRESS}:8000/uploads/issues/${firstFileName}`
            : null;

          return (
            <>
              <View
                style={{
                  width: "100%",
                  backgroundColor: currentColors.backgroundDarker,
                  flexDirection: "row",
                  borderRadius: 20,

                  marginTop: 40,
                  zIndex: 1,
                }}>
                {imageUrl && (
                  <Image
                    source={{ uri: imageUrl }}
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
                    {item.title}
                  </Text>
                  <Text style={{ color: currentColors.textShade }}>
                    Location: {item.city}, {item.state} - {item.pincode}
                  </Text>
                  <Text style={{ color: currentColors.text }}>
                    {formatDate(item.date_time_created)}
                  </Text>
                  <View
                    style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                    <Text
                      style={{
                        backgroundColor: currentColors.secondary,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 20,
                        color: currentColors.text,
                      }}>
                      {item.issue_status}
                    </Text>
                    <Text
                      style={{
                        backgroundColor: currentColors.text,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 20,
                        color: currentColors.textSecondary,
                      }}>
                      Priority: {item.priority}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ alignItems: "flex-end", paddingTop: 10 }}>
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: "/screens/CreateReport",
                      params: {
                        image: firstFileName ?? "",
                        title: item.title,
                        priority: item.priority,
                        status: item.issue_status,
                        date: formatDate(item.date_time_created),
                        city: item.city,
                        pincode: item.pincode,
                        id: item.issue_id,
                      },
                    });
                  }}
                  style={{
                    backgroundColor: currentColors.background,
                    padding: 10,
                    borderRadius: 10,
                  }}>
                  <Ionicons
                    name="pencil"
                    size={24}
                    color={currentColors.secondary}
                  />
                </TouchableOpacity>
              </View>
            </>
          );
        }}
      />
    </SafeAreaView>
  );
};
export default PendingIssues;

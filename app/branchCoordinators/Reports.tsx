import {
  View,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
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
import * as Animatable from "react-native-animatable";

import { Modal } from "react-native";
const Reports = () => {
  const router = useRouter();
  const [issuesData, setIssuesData] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIssueId, setActiveIssueId] = useState(null);
  const getIssues = async () => {
    const user = await getStoredData();
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/branchCoordinator/getReports`,
        {
          email: user.email,
        }
      );

      if (response.data.status) {
        setIssuesData(response.data.results);
        console.log("response.data.results: ", response.data.results);
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

    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 5000));

    await Promise.race([getIssues(), timeoutPromise]);

    setRefreshing(false);
  }, []);

  useEffect(() => {
    const filtered = issuesData.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredIssues(filtered);
  }, [searchQuery, issuesData]);

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
      style={{
        flex: 1,
        backgroundColor: currentColors.backgroundDarkest,
        paddingBottom: insets.bottom + 10,
      }}>
      <View
        style={{
          width: "100%",
          backgroundColor: currentColors.backgroundDarkest,
        }}>
        <Animatable.View
          animation={"fadeInDown"}
          style={{
            backgroundColor: currentColors.background,
            width: "100%",
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            paddingTop: insets.top + 10,
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
          }}>
          <View
            style={{
              backgroundColor: currentColors.backgroundLighter,
              width: "90%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 30,
              paddingHorizontal: 10,
              overflow: "hidden",
            }}>
            <TextInput
              style={{ width: "90%", color: currentColors.text }}
              placeholder="Search for a report..."
              placeholderTextColor={currentColors.textShade}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Ionicons name="search" color={currentColors.secondary} size={24} />
          </View>
        </Animatable.View>
      </View>
      <FlatList
        data={filteredIssues}
        style={{ padding: 10 }}
        keyExtractor={(item) => item.issue_id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
        renderItem={({ item }) => {
          const firstFileName = item.issue_media_files
            ? item.issue_media_files.split(",")[0].trim()
            : null;
          const imageUrl = firstFileName
            ? `http://${API_IP_ADDRESS}:8000/uploads/issues/${firstFileName}`
            : null;

          const reportImgsArray = item.report_media_files
            ? item.report_media_files.split(",")
            : null;
          console.log("reportImgsArray: ", reportImgsArray);
          const delay = 100;

          return (
            <Animatable.View animation={"slideInUp"} delay={delay + 100}>
              <TouchableOpacity
                style={{
                  width: "100%",
                  backgroundColor: currentColors.backgroundDarker,
                  flexDirection: "row",
                  borderRadius: 20,
                  overflow: "hidden",
                  marginTop: 20,
                }}
                onPress={() => {
                  console.log("press");

                  router.push({
                    pathname: "/screens/ReportDetailedView",
                    params: {
                      sub_dep_id: item.sub_department_coordinator_id,
                      item: JSON.stringify(item),
                    },
                  });
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
              </TouchableOpacity>
            </Animatable.View>
          );
        }}
      />
    </View>
  );
};

export default Reports;

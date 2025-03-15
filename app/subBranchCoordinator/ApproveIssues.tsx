import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useEffect, useState, useCallback } from "react";
import { clearStorage, getStoredData } from "@/hooks/useJwt";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
const ApproveIssues = () => {
  const router = useRouter();
  const [issuesData, setIssuesData] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
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

  const logout = () => {
    console.log("logout clicked");
    clearStorage();
    router.replace("/auth");
  };

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

  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;

  const handleFilterPress = (filter) => {
    if (activeFilter === filter) {
      setActiveFilter(null);
      setFilteredIssues(issuesData);
    } else {
      setActiveFilter(filter);
      setFilteredIssues(
        issuesData.filter((issue) => issue.issue_status === filter)
      );
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: currentColors.backgroundDarkest,
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 10,

      }}>
      <View style={{ flexDirection: "row", margin: 10, gap: 10 }}>
        {["registered", "approved", "in process"].map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => handleFilterPress(status)}
            style={{
              backgroundColor:
                activeFilter === status
                  ? currentColors.secondary
                  : currentColors.background,
              paddingHorizontal: 15,
              borderRadius: 50,
              paddingVertical: 8,
            }}>
            <Text
              style={{
                color:
                  activeFilter === status ? "#fff" : currentColors.textShade,
                fontSize: 16,
              }}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredIssues}
        keyExtractor={(item) => item.issue_id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={<Text style={{color : currentColors.text, textAlign :"center", margin  :20}}>Nothing more to view</Text>}
        renderItem={({ item }) => {
          const firstFileName = item.file_names
            ? item.file_names.split(",")[0].trim()
            : null;
          const imageUrl = firstFileName
            ? `http://${API_IP_ADDRESS}:8000/uploads/issues/${firstFileName}`
            : null;

          return (
            <View
              style={{
                backgroundColor: currentColors.backgroundDarker,
                borderRadius: 30,
                marginBottom: 15,
                overflow: "hidden",
              }}>
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/screens/SubBranchDetailedIssue",
                    params: { issue_id: item.issue_id },
                  });
                }}
                style={{
                  backgroundColor: currentColors.backgroundDarker,
                  borderRadius: 30,
                  marginBottom: 15,
                }}>
                {imageUrl && (
                  <Image
                    source={{ uri: imageUrl }}
                    style={{
                      width: "100%",
                      height: 200,
                      borderRadius: 8,
                      marginBottom: 10,
                    }}
                    resizeMode="cover"
                  />
                )}

                <View style={{ padding: 10 }}>
                  <Text
                    style={{
                      color: currentColors.text,
                      fontWeight: "bold",
                      fontSize: 25,
                    }}>
                    {item.title}
                  </Text>

                  <Text style={{ color: currentColors.secondary }}>
                    Location: {item.city}, {item.state} - {item.pincode}
                  </Text>

                  <Text
                    style={{
                      color: currentColors.textShade,
                      fontWeight: "bold",
                      fontSize: 16,
                    }}>
                    {formatDate(item.date_time_created)}
                  </Text>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    color: currentColors.text,
                    backgroundColor:
                      item.issue_status == "approved"
                        ? currentColors.secondary
                        : "black",
                    padding: 10,
                    borderRadius: 30,
                
                    textAlign: "center",
                  }}>
                  {item.issue_status}
                </Text>
                <Text
                  style={{
                    color: currentColors.text,
                    backgroundColor: currentColors.secondary,
                    padding: 10,
                    borderRadius: 30,
            
                    textAlign: "center",
                  }}>
                  Priority : {item.priority}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default ApproveIssues;

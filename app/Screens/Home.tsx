import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  FlatList,
  Image,
  TextInput,
  RefreshControl,
  useColorScheme,
} from "react-native";
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_200ExtraLight,
} from "@expo-google-fonts/poppins";
import { getStoredRawToken } from "../../hooks/useJwt";
import Issue from "@/components/Issue";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { Colors } from "../../constants/Colors";
import LottieView from "lottie-react-native";
import loading from "../../assets/images/welcome/loading.json";
import * as Animatable from "react-native-animatable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import watermark from "../../assets/images/watermark.png";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }: any) => {
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_400Regular,
    Poppins_300Light,
    Poppins_200ExtraLight,
  });

  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  
  const [isLoading, setIsLoading] = useState(false);
  const [issuedata, setIssueData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/issues/getIssues`
      );
      if (response) {
        const sortedData = [...response.data].sort((a, b) =>
          b.date_time_created.localeCompare(a.date_time_created)
        );
        setIssueData(sortedData);
      }
    } catch (error) {
      console.error("Error getting issues: ", error);
    }
    setIsLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchIssues();
  };

  const refreshIssue = async (issue_id: number) => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/issues/getDetailedIssue`,
        { issue_id }
      );

      if (response && response.data) {
        setIssueData((prevData) =>
          prevData.map((issue) =>
            issue.issue_id === issue_id ? response.data : issue
          )
        );
      }
    } catch (error) {
      console.error("Error refreshing issue data: ", error);
    }
  };

 
  const filteredIssues = issuedata.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.issue_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: currentColors.backgroundDarkest }]}>
      
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor: currentColors.backgroundDarker,
            paddingTop: insets.top == 0 ? 10 : insets.top * 1.2,
            width: "100%",
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconButton}>
          <Ionicons name="menu" size={28} color={currentColors.secondary} />
        </TouchableOpacity>

        <TextInput
          style={[styles.searchInput, { backgroundColor: currentColors.background, color: currentColors.text }]}
          placeholder="Search"
          placeholderTextColor={currentColors.textShade}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <TouchableOpacity onPress={() => alert("Notification Clicked")} style={styles.iconButton}>
          <Ionicons name="notifications-circle" size={35} color={currentColors.secondary} />
        </TouchableOpacity>
      </View>

      <StatusBar translucent hidden />

      {/* Loading Animation */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LottieView source={loading} autoPlay loop style={{ width: 100, height: 100 }} />
        </View>
      ) : (
        <FlatList
          data={filteredIssues}
          keyExtractor={(item) => item.issue_id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<Text style={{ marginTop: 10 }}></Text>}
          ListFooterComponent={
            <Animatable.View animation="fadeInUp" style={styles.footerContainer}>
              <Image source={watermark} style={styles.watermarkImage} />
            </Animatable.View>
          }
          renderItem={({ item }) => (
            <Issue
              issue_id={item.issue_id}
              username={item.full_name}
              dateTime={item.date_time_created}
              title={item.title}
              status={item.issue_status}
              description={item.issue_description}
              mediaLinks={item.media_files}
              is_anonymous={item.is_anonymous}
              upvotes={item.upvote_count}
              downvotes={item.downvote_count}
              suggestions={item.total_suggestions}
              refreshIssue={refreshIssue}
              pfp={item.picture_name}
              latitude={item.latitude}
              longitude={item.longitude}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgb(246, 247, 249)",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    elevation: 10,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    zIndex: 1,
  },
  iconButton: {
    padding: 5,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    fontSize: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  listContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  footerContainer: {
    marginTop: 100,
    paddingBottom: 100,
    gap: 10,
  },
  watermarkImage: {
    width: 300,
    height: 100,
    resizeMode: "contain",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;

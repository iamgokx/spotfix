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
  ScrollView,
  ImageBackground,
  Alert,
} from "react-native";
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_200ExtraLight,
} from "@expo-google-fonts/poppins";
import { useRouter } from "expo-router";
import { getStoredData, getStoredRawToken } from "../../hooks/useJwt";
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
import mapImg from "../../assets/images/issues/location2.png";
import gradient from "../../assets/images/gradients/orangegradient.png";


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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [issuedata, setIssueData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("date_latest");
  const [user, setuser] = useState("");
  const applyFilters = (issues) => {
    let sortedIssues = [...issues];

    switch (filter) {
      case "status_open":
        sortedIssues = sortedIssues.filter(
          (issue) => issue.issue_status === "open"
        );
        break;
      case "status_closed":
        sortedIssues = sortedIssues.filter(
          (issue) => issue.issue_status === "closed"
        );
        break;
      case "date_latest":
        sortedIssues.sort(
          (a, b) =>
            new Date(b.date_time_created) - new Date(a.date_time_created)
        );
        break;
      case "date_oldest":
        sortedIssues.sort(
          (a, b) =>
            new Date(a.date_time_created) - new Date(b.date_time_created)
        );
        break;
      case "votes_highest":
        sortedIssues.sort((a, b) => b.upvote_count - a.upvote_count);
        break;
      case "votes_lowest":
        sortedIssues.sort((a, b) => a.upvote_count - b.upvote_count);
        break;
      case "suggestions_highest":
        sortedIssues.sort((a, b) => b.total_suggestions - a.total_suggestions);
        break;
      case "suggestions_lowest":
        sortedIssues.sort((a, b) => a.total_suggestions - b.total_suggestions);
        break;
    }

    return sortedIssues;
  };

  const filteredIssues = applyFilters(
    issuedata.filter(
      (issue) =>
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.issue_description
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    )
  );

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    const user = await getStoredData();
    const email = user.email;
    setuser(email);
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/issues/getIssues`,
        {
          email,
        }
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

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentColors.backgroundDarkest },
      ]}>
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor: currentColors.backgroundDarker,
            paddingTop: insets.top == 0 ? 10 : insets.top * 1.2,
            width: "100%",
          },
        ]}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.iconButton}>
          <Ionicons name="menu" size={28} color={currentColors.secondary} />
        </TouchableOpacity>

        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: currentColors.background,
              color: currentColors.text,
            },
          ]}
          placeholder="Search"
          placeholderTextColor={currentColors.textShade}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <TouchableOpacity
          onPress={() => router.push("/screens/Notifications")}
          style={styles.iconButton}>
          <Ionicons
            name="notifications-circle"
            size={35}
            color={currentColors.secondary}
          />
        </TouchableOpacity>
      </View>

      <StatusBar translucent hidden />

      {/* Loading Animation */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LottieView
            source={loading}
            autoPlay
            loop
            style={{ width: 100, height: 100 }}
          />
        </View>
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: "row",

              marginTop: 20,
              height: 60,
              gap: 10,
              alignItems: "flex-start",

              paddingHorizontal: 20,
              paddingBottom: 10,
            }}>
            {[
              { label: "Latest", value: "date_latest" },
              { label: "Oldest", value: "date_oldest" },
              { label: "Votes ↑", value: "votes_highest" },
              { label: "Votes ↓", value: "votes_lowest" },
              { label: "Suggestions ↑", value: "suggestions_highest" },
              { label: "Suggestions ↓", value: "suggestions_lowest" },
            ].map(({ label, value }) => (
              <TouchableOpacity key={value} onPress={() => setFilter(value)}>
                <Text
                  style={[
                    {
                      color: currentColors.text,

                      fontSize: 19,
                      backgroundColor:
                        filter != value
                          ? currentColors.textShade
                          : currentColors.secondary,
                      borderRadius: 20,
                      padding: 3,
                      paddingHorizontal: 10,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            onPress={() => router.push("/screens/IssueMapView")}
            style={{
              position: "absolute",
              right: 10,
              bottom: insets.bottom + 70,
              zIndex: 10,
            }}>
            <ImageBackground
              source={gradient}
              style={{
                padding: 10,
                zIndex: 10,
                borderRadius: 500,
                overflow: "hidden",
              }}>
              <Image source={mapImg} style={{ width: 40, height: 40 }}></Image>
            </ImageBackground>
          </TouchableOpacity>
          <FlatList
            data={filteredIssues}
            keyExtractor={(item) => item.issue_id.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={<Text style={{ marginTop: 10 }}></Text>}
            ListFooterComponent={
              <Animatable.View
                animation="fadeInUp"
                style={styles.footerContainer}>
                <Image source={watermark} style={styles.watermarkImage} />
              </Animatable.View>
            }
            renderItem={({ item }) => (
              <View style={{ alignItems: "center", padding: 5 }}>
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
              </View>
            )}
          />
        </>
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
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  filterButton: { padding: 8, color: "gray" },
  filterSelected: { fontWeight: "bold", color: "black" },
});

export default HomeScreen;

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  useColorScheme,
} from "react-native";
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_200ExtraLight,
} from "@expo-google-fonts/poppins";
import CustomHeader from "@/components/CustomHeader";
import { getStoredRawToken } from "../../hooks/useJwt";
import Issue from "@/components/Issue";
import socket from "@/hooks/useSocket";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { FlatList } from "react-native";
import { isThisMinute } from "date-fns";
import { Colors } from "../../constants/Colors";
import { ServerContainer } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import loading from "../../assets/images/welcome/loading.json";
import * as Animatable from "react-native-animatable";
import { RefreshControl } from "react-native-gesture-handler";
const HomeScreen = ({ navigation }: any) => {
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_400Regular,
    Poppins_300Light,
    Poppins_200ExtraLight,
  });
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [isLoading, setIsLoading] = useState(false);
  const [issuedata, setIssueData] = useState();
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    tokenF();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    getIssueData();
    setIsLoading(false);
  };

  const tokenF = async () => {
    const token = await getStoredRawToken();
    const dtoken = jwtDecode(token);
  };

  const getIssueData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/issues/getIssues`
      );

      if (response) {
        setIssueData(response.data);

        setRefreshing(false);
      }
    } catch (error) {
      console.log("error getting issues from backend : ", error);
    }
  };
  useEffect(() => {
    getIssueData();
    setIsLoading(false);
  }, []);

  const refreshIssue = async (issue_id: number) => {
    console.log("refreshing issue");
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
      <CustomHeader navigation={navigation} />
      <StatusBar translucent hidden />

      {!isLoading && (
        <FlatList
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={7}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
          data={issuedata}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View style={{ width: "100%", height: 100, margin: 30 }}>
              <Text
                style={{
                  color: currentColors.text,
                  fontFamily: "Poppins_300Light",
                }}>
                Nothing more to view.
              </Text>
            </View>
          }
          ItemSeparatorComponent={(item) => {
            return (
              <Text
                style={{
                  // backgroundColor: currentColors.textShade,
                  height: 1,
                  margin: 10,
                }}></Text>
            );
          }}
          ListHeaderComponent={(item) => {
            return <Text style={{ marginTop: 10 }}></Text>;
          }}
          renderItem={({ item }: any) => {
            return (
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
              />
            );
          }}></FlatList>
      )}

      {isLoading && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <LottieView
            source={loading}
            autoPlay
            loop
            style={{ width: 100, height: 100 }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    // backgroundColor: "#EEF7FF",
    backgroundColor: "rgb(246, 247, 249)",
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "#0066ff",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  scrollContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;

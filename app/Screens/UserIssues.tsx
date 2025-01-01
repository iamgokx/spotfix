import { View, Text, RefreshControl, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import Swiper from "react-native-swiper";
import { Image } from "react-native-animatable";
import { StyleSheet } from "react-native";
import { getStoredRawToken } from "@/hooks/useJwt";
import { jwtDecode } from "jwt-decode";
import { useFonts, Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import * as Animatable from "react-native-animatable";
import { format, formatDate } from "date-fns";
import UserIssueCard from "@/components/UserIssueCard";
const UserIssues = () => {
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
  });
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorTheme = useColorScheme();
  const currentColors = colorTheme == "dark" ? Colors.dark : Colors.light;

  const [isLoading, setIsLoading] = useState(false);
  const [issuedata, setIssueData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState({ name: "", email: "" });
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const tokenFromStorage = await getStoredRawToken();
        const decodedToken = jwtDecode(tokenFromStorage);
        setUser({
          name: decodedToken?.name || "",
          email: decodedToken?.email || "",
        });
      } catch (error) {
        console.error("Error decoding token: ", error);
      }
    };

    fetchUserData();
  }, []);

  const getIssueData = async () => {
    setIsLoading(true);
    console.log("user email : ", user.email);
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/users/getUserIssues`,
        {
          email: "lekhwargokul84@gmail.com",
        }
      );

      if (response?.data) {
        setIssueData(response.data);
      }
    } catch (error) {
      console.log("Error getting issues from backend:", error);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getIssueData();
  }, [user.email]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getIssueData();
  };

  return (
    <View
      style={{
        backgroundColor: currentColors.background,
        flex: 1,
        paddingTop: insets.top + 5,
      }}>
      <Animatable.View
        animation="fadeInDown"
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Ionicons
          name="chevron-back"
          size={24}
          color={currentColors.secondary}
          style={{ position: "absolute", left: 15 }}
          onPress={() => router.back()}
        />
        <Text
          style={{
            color: currentColors.secondary,
            fontFamily: "Poppins_600SemiBold",
            fontSize: 20,
          }}>
          Reports History
        </Text>
      </Animatable.View>

      <Animatable.View
      animation='fadeIn'
        style={{
          backgroundColor: currentColors.backgroundDarker,
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          marginTop: 30,
          flex: 1,
          paddingTop: 15,
          elevation: 123,
        }}>
        <FlatList
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={7}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{
            width: "100%",
            flexGrow: 1,
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
          ItemSeparatorComponent={() => (
            <Text
              style={{
                height: 1,
                margin: 10,
              }}></Text>
          )}
          ListHeaderComponent={() => <Text style={{ marginTop: 10 }}></Text>}
          renderItem={({ item }) => {
            return (
              <UserIssueCard
                mediaLinks={item.media_files}
                title={item.title}
                status={item.issue_status}
                latitude={item.latitude}
                longitude={item.longitude}
                dateTime={item.date_time_created}
                issue_id={item.issue_id}
              />
            );
          }}
        />
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    backgroundColor: "gray",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "white",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  wrapper: {
    height: 200,
  },

  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ani: {
    width: 400,
    height: 400,
  },
  carouselContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "95%",
    height: "auto",
    alignSelf: "auto",
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  subContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  nameContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    gap: 10,
    alignItems: "center",
  },
  userPfp: {
    width: "10%",
    backgroundColor: "orange",
    borderRadius: 20,
    textAlign: "center",
    paddingVertical: 5,
  },
  userName: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
  },
  imgContainer: {
    height: 200,
    objectFit: "cover",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: "100%",
    height: 200,
  },
  title: {
    width: " 70%",
    fontSize: 20,
    textAlign: "left",
    paddingLeft: 10,
    fontFamily: "Poppins_400Regular",
  },
  titleContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  progress: {
    width: "25%",
    textAlign: "center",
    paddingVertical: 5,
    paddingHorizontal: 0,
    borderRadius: 20,
    color: "white",
    fontFamily: "Poppins_400Regular",
  },
  desc: {
    fontSize: 17,
  },
  iconsContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  reactions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    // backgroundColor: "rgba(182, 231, 255, 0.8)",
    borderRadius: 20,
    padding: 15,
    paddingVertical: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 250,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    aspectRatio: 1,
  },
  caption: {
    marginTop: 10,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  noMediaContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  noMediaText: {
    fontSize: 16,
    color: "#888",
  },
});

export default UserIssues;

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { getStoredData } from "@/hooks/useJwt";
import * as Animatable from "react-native-animatable";

const UserVotes = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [userVotesData, setUserVotesData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getUserDetailsFromStorage = async () => {
    const user = await getStoredData();
    return user.email;
  };

  const getUserVotes = async () => {
    try {
      const email = await getUserDetailsFromStorage();
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/users/getUserVotes`,
        { email }
      );

      if (response.data.status) {
        setUserVotesData(response.data.results);
      } else {
        setUserVotesData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserVotes();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getUserVotes();
    setRefreshing(false);
  }, []);

  const getColorDetails = (status) => {
    switch (status) {
      case "registered":
        return { background: "rgb(203, 202, 202)", color: "black" };
      case "approved":
        return { background: "rgb(195, 255, 193)", color: "orange" };
      case "in process":
        return { background: "orange", color: "white" };
      case "completed":
        return { background: "rgb(196, 241, 255)", color: "rgb(0, 194, 255)" };
      default:
        return { background: "orange", color: "white" };
    }
  };

  const renderItem = ({ item }) => {
    const colors = getColorDetails(item.issue_status);
    return (
      <Animatable.View animation={"fadeIn"} style={{ width: "100%" }}>
        <TouchableOpacity
          style={{
            backgroundColor: currentColors.backgroundLighter,
            marginTop: 10,
            padding: 10,
            paddingVertical: 20,
            borderRadius: 30,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
          onPress={() =>
            router.push(`/screens/DetailedIssue?issue_id=${item.issue_id}`)
          }>
          <Animatable.Image
            source={{
              uri: `http://${API_IP_ADDRESS}:8000/uploads/issues/${item.file_name}`,
            }}
            style={{ borderRadius: 50, width: "20%", aspectRatio: 1 }}
          />

          <Animatable.View style={{ width: "80%", position: "relative" }}>
            <Text style={{ color: currentColors.secondary, fontSize: 20 }}>
              {item.title}
            </Text>
            <Text style={{ color: currentColors.text }}>
              {item.department_name}
            </Text>
            <Text style={{ color: currentColors.textShade }}>
              {item.locality} {item.pincode}
            </Text>
            {/* <Text
              style={{
                width: 100,
                textAlign: "center",
                padding: 10,
                borderRadius: 20,

                backgroundColor: colors.background,
                color: colors.color,
                alignSelf: "flex-end",
              }}>
              {item.issue_status}
            </Text> */}
          </Animatable.View>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: currentColors.backgroundDarker }}>
      <View
        style={{
          paddingTop: insets.top + 10,
          backgroundColor: currentColors.background,
          paddingBottom: 10,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}>
          <Ionicons
            onPress={() => router.back()}
            name="chevron-back-outline"
            size={24}
            color={currentColors.secondary}
            style={{ position: "absolute", left: 10 }}
          />
          <Text
            style={{
              color: currentColors.secondary,
              fontSize: 20,
              fontWeight: "600",
            }}>
            My Votes
          </Text>
        </View>
      </View>

      <FlatList
        data={userVotesData}
        keyExtractor={(item) => item.issue_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10, paddingTop: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              color: currentColors.text,
            }}>
            No data
          </Text>
        }
      />
    </View>
  );
};

export default UserVotes;

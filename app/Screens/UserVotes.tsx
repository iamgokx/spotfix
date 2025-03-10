import { View, Text, Image, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { getStoredData } from "@/hooks/useJwt";
import * as Animatable from "react-native-animatable";
const UserVotes = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const [colors, setColors] = useState({
    background: "",
    color: "",
  });
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [userVotesData, setUserVotesData] = useState();
  const getUserDetailsFromStorage = async () => {
    const user = await getStoredData();
    const userEmail = user.email;
    return userEmail;
  };

  const getUserVotes = async () => {
    try {
      const email = await getUserDetailsFromStorage();
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/users/getUserVotes`,
        {
          email: email,
        }
      );

      if (response.data.status) {
        console.log(response.data.results);
        setUserVotesData(response.data.results);
      } else {
        console.log("no data for votes");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserVotes();
  }, []);

  const getColorDetails = (status: string) => {
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

  return (
    <View style={{ flex: 1, backgroundColor: currentColors.backgroundDarker }}>
      <View
        style={{
          position: "relative",

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
              fontWeight: 600,
            }}>
            My Votes
          </Text>
        </View>
      </View>

      {userVotesData ? (
        <ScrollView style={{ flex: 1, padding: 10, paddingTop: 40 }}>
          {userVotesData.map((issue, index) => {
            const colors = getColorDetails(issue.issue_status);
            return (
              <Animatable.View
                animation={"fadeIn"}
                key={index}
                style={{
                  width: "100%",
                 
                }}>
                <TouchableOpacity
                style={
                  {
                    backgroundColor: currentColors.backgroundLighter,
                    marginTop: 20,
                    padding: 10,
                    paddingVertical: 20,
                    borderRadius: 30,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }
                }
                  onPress={() =>
                    router.push(
                      `/screens/DetailedIssue?issue_id=${issue.issue_id}`
                    )
                  }>
                  <Animatable.Image
                    source={{
                      uri: `http://${API_IP_ADDRESS}:8000/uploads/issues/${issue.file_name}`,
                    }}
                    style={{ borderRadius: 50, width: 100, height: 100 }}
                  />

                  <Animatable.View
                    style={{
                      width: "70%",
                      height: "100%",
                      position: "relative",
                    }}>
                    <Text
                      style={{ color: currentColors.secondary, fontSize: 20 }}>
                      {issue.title}
                    </Text>
                    <Text style={{ color: currentColors.text }}>
                      {issue.category}
                    </Text>
                    <Text style={{ color: currentColors.textShade }}>
                      {issue.locality} {issue.pincode}
                    </Text>
                    <Text
                      style={{
                        width: 100,
                        textAlign: "center",
                        padding: 10,
                        borderRadius: 20,
                        position: "absolute",
                        right: 10,
                        bottom: 0,
                        backgroundColor: colors.background,
                        color: colors.color,
                        alignSelf: "flex-start",
                      }}>
                      {issue.issue_status}
                    </Text>
                  </Animatable.View>
                </TouchableOpacity>
              </Animatable.View>
            );
          })}
        </ScrollView>
      ) : (
        <Text>No data</Text>
      )}
    </View>
  );
};
export default UserVotes;

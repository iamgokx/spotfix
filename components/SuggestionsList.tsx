import { Ionicons } from "@expo/vector-icons";
import { KeyboardAvoidingView, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import axios from "axios";
import { API_IP_ADDRESS } from "../ipConfig.json";
import hero from "../assets/images/hero.jpg";
import socket from "@/hooks/useSocket";
import { formatDistanceToNow } from "date-fns";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Keyboard,
  Platform,
  FlatList,
  Image,
  Switch,
  Animated,
} from "react-native";

import { useEffect, useState, useRef } from "react";
import { formatDate, format } from "date-fns";
import { formatDistanceToNowStrict } from "date-fns";
import { FadeInUp, withDecay } from "react-native-reanimated";
import { getStoredData } from "@/hooks/useJwt";
import { io } from "socket.io-client";
import * as Animatable from "react-native-animatable";
const SuggestionsList = ({ issue_id }: any) => {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets(); 
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [userSuggestions, setUserSuggestions] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    getIssueSuggestions();
  }, []);

  const getDateFormatted = (date: Date | string) => {
    const distance = formatDistanceToNowStrict(new Date(date), {
      addSuffix: false,
      roundingMethod: "floor",
    });

    return (
      distance
        .replace(" seconds", "s")
        .replace(" second", "s")
        .replace(" minutes", "m")
        .replace(" minute", "m")
        .replace(" hours", "h")
        .replace(" hour", "h")
        .replace(" days", "d")
        .replace(" day", "d")
        .replace(" months", "mo")
        .replace(" month", "mo")
        .replace(" years", "y")
        .replace(" year", "y") + " ago"
    );
  };

  const getIssueSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/issues/getIssueSuggestions`,
        {
          issue_id,
        }
      );
      if (response.data) {
        console.log("Response Data:", response.data);
        setSuggestions(response.data);
      } else {
        console.log("No suggestions available");
      }
    } catch (error) {
      console.log("Error getting issue suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => {
        if (event && event.endCoordinates) {
          setKeyboardHeight(event.endCoordinates.height); // Update keyboard height
        } else {
          setKeyboardHeight(0); // Fallback
        }
      }
    );
  
    const keyboardHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardHeight(0)
    );
  
    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);
  const getUserDetails = async () => {
    const user = await getStoredData();
    console.log("returned user email : ", user.email);
    return user.email;
  };

  const handleSubmitSuggestion = async () => {
    try {
      const user = await getUserDetails();
      const suggestion = userSuggestions;

      if (!user || !suggestion) {
        console.error("User details are missing or incomplete.");
        return;
      }

      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/issues/submitSuggestion`,
        {
          issueId: issue_id,
          email: user,
          userSuggestion: suggestion,
          isanonymous: isAnonymous,
        }
      );
      if (response) {
        // console.log(response.data);
        setUserSuggestions("");
      }
    } catch (error) {
      console.log("error submitting issue : ", error);
    }
  };

  useEffect(() => {
    const handleNewSuggestion = (data: any) => {
      console.log("New suggestion received via socket:", data.message);
      getIssueSuggestions();
    };

    socket.on("newSuggestion", handleNewSuggestion);

    return () => {
      socket.off("newSuggestion", handleNewSuggestion); // Cleanup
    };
  }, []);

  return (
    <Animatable.View
      animation="fadeInUpBig"
      duration={800}
      style={{
        width: "100%",
        height: 500,
        backgroundColor: currentColors.backgroundDarkest,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: "hidden",
        position: "relative",

      }}>
        <Text style={{textAlign : 'center', color : currentColors.text, textDecorationLine : 'underline', padding : 5}}>Suggestions</Text>
      {!isLoading ? (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={suggestions}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text
              style={{
                color: currentColors.text,
                textAlign: "center",
                marginTop: 60,
              }}>
              No suggestions yet
            </Text>
          }
          renderItem={({ item }) => (
            <Animatable.View
              style={{
           
                width: "100%",
                marginTop: 10,
                marginBottom: 10,
                flex: 1,
                flexDirection: "row",
                padding: 10,
              }}>
              <View
                style={{ width: "20%", height: "100%", alignItems: "center" }}>
                <Image
                  source={hero}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 500,
                    marginBottom: 10,
                  }}
                />
                <Text
                  style={{
                    width: 2,
                    flexGrow: 1,
                    backgroundColor: currentColors.textShade,
                  }}></Text>
              </View>

              <View style={{ width: "80%" }}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    marginTop: 10,
                    marginBottom: 20,
                  }}>
                  <Text
                    style={{
                      color: currentColors.text,

                      width: "60%",
                    }}>
                    {!item.is_anonymous ? item.full_name : "Spotfix User"}
                  </Text>
                  <Text
                    style={{
                      color: currentColors.link,
                      textAlign: "right",
                      width: "35%",
                    }}>
                    {getDateFormatted(item.date_time_created)}
                  </Text>
                </View>
                <Text style={{ color: currentColors.text, width: "95%" }}>
                  {item.content}
                </Text>
              </View>
            </Animatable.View>
          )}
        />
      ) : (
        <Text>Loading...</Text>
      )}

      <KeyboardAvoidingView
       onLayout={() => setKeyboardHeight((prev) => prev)}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          width: "100%",
          backgroundColor: currentColors.background,
          maxHeight: 100,
          height: 60,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          position: "relative",
          bottom: keyboardHeight ? keyboardHeight : 0,
          paddingHorizontal: 5,
          marginBottom: insets.bottom,
        }}>
        <Switch
          trackColor={{
            false: currentColors.primary,
            true: currentColors.secondary,
          }}
          thumbColor={isAnonymous ? currentColors.text : currentColors.text}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setIsAnonymous((prev) => !prev)}
          value={isAnonymous}
        />

        <TextInput
          style={{ width: "80%", color: currentColors.text }}
          value={userSuggestions}
          multiline
          onChangeText={(text) => setUserSuggestions(text)} //
        />

        <Ionicons
          name="send"
          size={25}
          color={currentColors.secondary}
          onPress={() => handleSubmitSuggestion()}
        />
      </KeyboardAvoidingView>
    </Animatable.View>
  );
};

export default SuggestionsList;

const styles = StyleSheet.create({
  header: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    position: "absolute",
    top: 0,
    zIndex: 4,
    height: 100,
  },
  headerText: {
    color: "white",
    fontSize: 25,
  },
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
    height: 350,
  },
  img: {
    width: "100%",
    height: 350,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  container: {
    padding: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    flexDirection: "column",
  },
  desc: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    // backgroundColor: "#D4F6FF",
    padding: 20,
    borderRadius: 20,
    textAlign: "justify",
  },
  solution: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    // backgroundColor: "#D4F6FF",
    padding: 20,
    borderRadius: 20,
    textAlign: "justify",
  },
  noMediaContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 250,
  },
  noMediaText: {
    fontSize: 16,
    color: "#888",
  },
  issueCreatorContainer: {
    width: "90%",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(231, 238, 242, 0.6)",
    margin: 20,
    borderRadius: 20,
  },
  iconsContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    margin: 20,
  },
  reactions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 5,
    // backgroundColor: "rgba(182, 231, 255, 0.8)",
    borderRadius: 20,
    padding: 15,
    paddingVertical: 1,
  },
});

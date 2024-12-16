import { Ionicons } from "@expo/vector-icons";
import { KeyboardAvoidingView, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import axios from "axios";
import { API_IP_ADDRESS } from "../ipConfig.json";
import hero from "../assets/images/hero.jpg";
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
} from "react-native";

import { useEffect, useState } from "react";
import { formatDate, format } from "date-fns";
import { withDecay } from "react-native-reanimated";
const SuggestionsList = ({ issue_id }: any) => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [userSuggestions, setUserSuggestions] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  useEffect(() => {
    getIssueSuggestions();
  }, []);

  const getDateFormatted = (date: any) => {
    const formattedDate = format(new Date(date), "eeee d MMMM yyyy");
    return formattedDate;
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
      (event) => setKeyboardHeight(event.endCoordinates.height)
    );
  
    const keyboardHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardHeight(0)
    );
  
  
    setKeyboardHeight(0);
  
    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);
  

  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: 500,
        backgroundColor: currentColors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: "hidden",
        position: "relative",
      }}>
      {!isLoading ? (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={suggestions}
          renderItem={(
            { item } 
          ) => (
            <View
              style={{
                margin: 10,
                padding: 10,
                display: "flex",
                flexDirection: "row",
                gap: 10,
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}>
              <Image
                source={hero}
                style={{ width: 40, height: 40, borderRadius: 500 }}
              />
              <View style={{ width: "90%" }}>
                <View>
                  <Text style={{ color: currentColors.text, padding: 10 }}>
                    {item.full_name}
                  </Text>
                  <View
                    style={{
                      backgroundColor: currentColors.backgroundLighter,
                      padding: 10,
                      borderRadius: 20,
                    }}>
                    <Text style={{ width: "100%", color: currentColors.text }}>
                      {item.content}
                    </Text>
                    <Text
                      style={{
                        color: currentColors.link,
                        width: "100%",
                        textAlign: "right",
                      }}>
                      {getDateFormatted(item.date_time_created)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      ) : (
        <Text>Loading...</Text>
      )}

      <View
        style={{
          width: "100%",
          backgroundColor: currentColors.backgroundDarkest,
          maxHeight : 100,
          height: 60,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "flex-start",
          position: "relative",
          bottom: keyboardHeight ? keyboardHeight : 0,
          paddingTop :5
        }}>
        <Switch
          trackColor={{ false: currentColors.primary, true: currentColors.secondary }}
          thumbColor={isAnonymous ? currentColors.text : currentColors.text}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setIsAnonymous((prev) => !prev)}
          value={isAnonymous}
        />

        <TextInput
          style={{ width: "80%", color:currentColors.text }}
          value={userSuggestions}
          multiline
          onChange={(text) => setUserSuggestions(text)}
        />
        <Ionicons name="send" size={25} color={"#0066ff"} />
      </View>
    </SafeAreaView>
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

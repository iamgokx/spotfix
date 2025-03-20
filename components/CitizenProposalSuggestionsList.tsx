import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Switch,
  TextInput,
  Keyboard,
} from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_IP_ADDRESS } from "../ipConfig.json";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { formatDistanceToNowStrict } from "date-fns";
import { Image } from "react-native";
import { getStoredData } from "../hooks/useJwt";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import defaultPfp from "../assets/images/profile/defaultProfile.jpeg";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import socket from "@/hooks/useSocket";
const CitizenProposalSuggestionsList = ({
  handleSuggestionClick,
  proposalId,
}: any) => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const [suggestions, setSuggestions] = useState([]);
  const [userSuggestions, setUserSuggestions] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();

  const [isSuggestionsAllowed, setisSuggestionsAllowed] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const user = await getStoredData();
      const userType = user.userType;

      if (userType == "citizen") {
        setisSuggestionsAllowed(true);
      }
    };

    getUser();
  }, [proposalId]);

  const getProposalSuggestions = async () => {
    const response = await axios.post(
      `http://${API_IP_ADDRESS}:8000/api/proposals/getCitizenProposalSuggestions`,
      {
        proposalId: proposalId,
      }
    );
    if (response.data.message) {
      console.log(response.data);
    }

    if (response) {
      console.log(response.data);
      setSuggestions(response.data);
    }
  };

  useEffect(() => {
    getProposalSuggestions();
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
        `http://${API_IP_ADDRESS}:8000/api/proposals/citizenAddProposalSuggestion`,
        {
          proposalId: proposalId,
          email: user,
          userSuggestion: suggestion,
          isanonymous: isAnonymous,
        }
      );
      if (response) {
        setUserSuggestions("");
      }
    } catch (error) {
      console.log("error submitting issue : ", error);
    }
  };

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => {
        if (event && event.endCoordinates) {
          setKeyboardHeight(event.endCoordinates.height);
        } else {
          setKeyboardHeight(0);
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

  useEffect(() => {
    const handleNewSuggestion = (data: any) => {
      console.log("New suggestion received via socket:", data.message);
      getProposalSuggestions();
    };

    socket.on("newSuggestionProposal", handleNewSuggestion);

    return () => {
      socket.off("newSuggestionProposal", handleNewSuggestion);
    };
  }, []);

  return (
    <Animatable.View
      animation="fadeInUp"
      duration={400}
      style={{
        width: "100%",
        backgroundColor: currentColors.backgroundDarkest,
        height: 500,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}>
      <View
        style={{
          width: "100%",
          alignItems: "flex-end",
          paddingVertical: 5,
          paddingRight: 5,
          flexDirection: "row",
        }}>
        <Text
          style={{
            textAlign: "center",
            color: currentColors.text,
            textDecorationLine: "underline",
            padding: 5,
            width: "100%",
          }}>
          Suggestions
        </Text>
        <Ionicons
          onPress={handleSuggestionClick}
          size={30}
          name="close-circle"
          color={currentColors.secondary}
          style={{ position: "absolute", right: 10 }}
        />
      </View>

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
              {item.is_anonymous == "0" ? (
                <Image
                  source={
                    item.citizen_picture_name != "null"
                      ? {
                          uri: `http://${API_IP_ADDRESS}:8000/uploads/profile/${item.citizen_picture_name}`,
                        }
                      : defaultPfp
                  }
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 500,
                    marginBottom: 10,
                  }}
                />
              ) : (
                <Image
                  source={defaultPfp}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 500,
                    marginBottom: 10,
                  }}
                />
              )}
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
                {item.suggestion_content}
              </Text>
            </View>
          </Animatable.View>
        )}
      />
      {isSuggestionsAllowed && (
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
            onChangeText={(text) => setUserSuggestions(text)}
          />

          <Ionicons
            name="send"
            size={25}
            color={currentColors.secondary}
            onPress={() => handleSubmitSuggestion()}
          />
        </KeyboardAvoidingView>
      )}
    </Animatable.View>
  );
};
export default CitizenProposalSuggestionsList;

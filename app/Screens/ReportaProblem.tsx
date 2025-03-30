import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ImageBackground } from "react-native";
import imgBackground from "../../assets/images/gradients/bluegradient.png";
import { clearStorage, getStoredData } from "@/hooks/useJwt";
import { Modal } from "react-native";
import { useState, useEffect } from "react";
import * as Animatable from "react-native-animatable";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
const ReportaProblem = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [problemText, setproblemText] = useState("");

  const reportProblem = async () => {
    if (!problemText || problemText.length < 50) {
      alert("Please add appropriate details (minimumn 50 character)");
    } else {
      const user = await getStoredData();
      const email = user.email;
      try {
        const response = await axios.post(
          `http://${API_IP_ADDRESS}:8000/api/users/reportProblem`,
          {
            email,
            problemText,
          }
        );

        if (response.data.status) {
          console.log("submitted");
          alert("Problem reported");
          setproblemText("");
        } else {
          console.log("could not report ");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ImageBackground
        source={imgBackground}
        style={{
          position: "relative",
          height: 140,
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
            color={"white"}
            style={{ position: "absolute", left: 10 }}
          />
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: 600,
            }}>
            Help & Support
          </Text>
        </View>
      </ImageBackground>

      <Animatable.View
        animation={"slideInUp"}
        style={{
          flex: 1,
          backgroundColor: currentColors.background,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          marginTop: -30,
          overflow: "hidden",
        }}>
        <View style={styles.container}>
          <Text style={styles.title}>Report a Problem</Text>
          <Text style={styles.instructions}>
            Briefly describe the issue you're facing. Providing details will
            help us resolve it faster.
          </Text>
          <TextInput
            style={styles.textBox}
            multiline
            numberOfLines={4}
            placeholder="Type your problem here..."
            placeholderTextColor="#888"
            textAlignVertical="top"
            value={problemText}
            onChangeText={(text) => {
              setproblemText(text);
            }}
          />
          <TouchableOpacity style={styles.button} onPress={reportProblem}>
            <Text style={styles.buttonText}>Report Problem</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "blue",
    textAlign: "center",
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    fontWeight: "semibold",
    color: "black",
    textAlign: "left",
    marginBottom: 20,
  },
  textBox: {
    height: 200,
    width: "100%",
    borderRadius: 20,
    padding: 10,
    marginBottom: 30,
    backgroundColor: "rgba(3, 219, 252,0.1)",
    borderWidth: 1,
    borderColor: "rgba(3, 219, 252,0.5)",
  },
  button: {
    backgroundColor: "blue",
    width: "100%",
    padding: 10,
    borderRadius: 28,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ReportaProblem;

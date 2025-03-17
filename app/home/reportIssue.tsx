import { useRouter } from "expo-router";
import {
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { View, Text } from "react-native";
import { useIssueContext } from "@/context/IssueContext";
import * as Animatable from "react-native-animatable";
import { IssueProvider } from "@/context/IssueContext";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useEffect, useState } from "react";
import LottieView from "lottie-react-native";
import userUsingPhone from "../../assets/images/issues/usingPhone.json";
import { useIsFocused } from "@react-navigation/native";
import construction from "../../assets/images/issues/construction.json";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import watermark from "../../assets/images/watermark.png";

const screenWidth = Dimensions.get("window").width - 40;
import {
  useFonts,
  Poppins_100Thin,
  Poppins_300Light,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import { getStoredRawToken, getStoredData } from "@/hooks/useJwt";
import { jwtDecode } from "jwt-decode";

//TODO single file upload fix , it breaks the
const ReportIssue = () => {
  const [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_500Medium,
  });
  const isFocused = useIsFocused();
  const colorTheme = useColorScheme();
  const currentColors = colorTheme == "dark" ? Colors.dark : Colors.light;
  const router = useRouter();
  const [user, setUser] = useState("");

  const getUserDetails = async () => {
    try {
      const rawToken = await getStoredData();
      if (!rawToken || !rawToken.name) {
        console.error("Token data is missing or invalid");
        setUser("User");
        return;
      }
      const fName = rawToken.name.split(" ");
      setUser(fName[0] || "User");
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUser("User");
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        {
          backgroundColor: currentColors.backgroundDarker,
        },
      ]}
      contentContainerStyle={{
        alignItems: "center",
        paddingVertical: 20,
        gap: 50,
        paddingTop: 100,
        justifyContent: "center",

        paddingBottom: 200,
      }}>
      <View
        style={{
          width: "90%",

          display: "flex",
          flexDirection: "column",
        }}>
        <Animatable.Text
          animation={isFocused ? "slideInLeft" : undefined}
          duration={1000}
          style={{
            fontFamily: "Poppins_100Thin",
            fontSize: 35,
            color: currentColors.text,
          }}>
          Hey {user}
        </Animatable.Text>

        <Animatable.Text
          animation={isFocused ? "slideInLeft" : undefined}
          duration={900}
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 35,
            color: currentColors.secondary,
          }}>
          What's On Your Mind ?
        </Animatable.Text>
      </View>
      <Animatable.View
        animation={isFocused ? "slideInUp" : "undefined"}
        duration={600}
        style={{
          width: "90%",
          overflow: "hidden",
          backgroundColor: currentColors.card,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",

          padding: 10,
          borderRadius: 20,
          alignItems: "center",
          paddingVertical: 20,
        }}>
        <View
          style={{
            flexGrow: 1,

            width: "60%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 50,
          }}>
          <Text
            style={{
              color: currentColors.cardText,
              fontFamily: "Poppins_300Light",
              fontSize: 20,
              textAlign: "auto",
              padding: 10,
            }}>
            See something wrong? {"\n"}Report it now!
          </Text>
          <TouchableOpacity
            style={styles.btnContainer}
            onPress={() => router.push("/issues/issue")}>
            <Text
              style={[
                styles.btn,
                {
                  backgroundColor: currentColors.cardButton,
                  color: currentColors.cardButtonText,
                },
              ]}>
              New Issue
            </Text>
          </TouchableOpacity>
        </View>
        <LottieView
          autoPlay
          loop
          source={userUsingPhone}
          style={{ width: 150, height: 150 }}
        />
      </Animatable.View>
      <Animatable.View
        animation={isFocused ? "slideInUp" : "undefined"}
        duration={700}
        style={{
          width: "90%",
          overflow: "hidden",
          backgroundColor: currentColors.card,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",

          padding: 10,
          borderRadius: 20,
          alignItems: "center",
          paddingVertical: 20,
        }}>
        <View
          style={{
            flexGrow: 1,
            width: "60%",

            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 50,
          }}>
          <Text
            style={{
              color: currentColors.cardText,
              fontFamily: "Poppins_300Light",
              fontSize: 20,
              textAlign: "auto",
              padding: 10,
            }}>
            Got a plan? {"\n"}Propose your project here!
          </Text>
          <TouchableOpacity
            style={styles.btnContainer}
            onPress={() => router.push("/proposals")}>
            <Text
              style={[
                styles.btn,
                {
                  backgroundColor: currentColors.cardButton,
                  color: currentColors.cardButtonText,
                },
              ]}>
              New Project Idea
            </Text>
          </TouchableOpacity>
        </View>
        <LottieView
          source={construction}
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
        />
      </Animatable.View>

      <Animatable.View
        animation={"fadeInUp"}
        style={{
          marginTop: 50,
          paddingBottom: 20,
          gap: 10,
        }}>
        <Image
          source={watermark}
          style={{ width: 300, height: 100, objectFit: "contain" }}
        />
      </Animatable.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
  },

  btn: {
    width: "80%",

    paddingVertical: 15,
    textAlign: "center",
    borderRadius: 30,

    fontFamily: "Poppins_500Medium",
    fontSize: 16,
  },
  btnContainer: {
    width: "100%",
  },
});

export default ReportIssue;

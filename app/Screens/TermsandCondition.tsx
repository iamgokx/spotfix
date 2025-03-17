import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ImageBackground } from "react-native";
import imgBackground from "../../assets/images/gradients/bluegradient.png";
import { clearStorage } from "@/hooks/useJwt";
import { Modal } from "react-native";
import { useState } from "react";
import * as Animatable from "react-native-animatable";
import logo from "../../assets/images/appIcon.png";
const TermsandCondition = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isLogOutModalActive, setisLogOutModalActive] = useState(false);
  const [isDeleteAccountModaActive, setisDeleteAccountModaActive] =
    useState(false);

  const termsList = [
    {
      title: "Acceptance of Terms",
      description:
        "By downloading, installing, or using the SpotFix app, you agree to these Terms and Conditions. If you do not agree, you must not use the app.",
    },
    {
      title: "Use of the App",
      description:
        "The app is designed to allow users to report and address local infrastructure issues (e.g., potholes, broken streetlights) and access related announcements. You are responsible for ensuring that the information you provide is accurate, lawful, and does not violate any third-party rights. Misuse of the app, including false reporting or offensive content, is strictly prohibited and may result in account suspension or termination.",
    },
    {
      title: "User Account",
      description:
        "You must create an account to access certain features of SpotFix. You agree to keep your account credentials secure and not share them with others. Anonymous Mode is available for users who wish to protect their identity while reporting issues.",
    },
    {
      title: "Content Submission",
      description:
        "By submitting content (e.g., reports, images, suggestions) through the app, you grant SpotFix a non-exclusive, royalty-free license to use, modify, and display the content for the purpose of improving local infrastructure. Content must not contain offensive, illegal, or defamatory material.",
    },
    {
      title: "Location-Based Services",
      description:
        "The app collects and uses location data to provide relevant notifications and suggestions. By using SpotFix, you consent to the collection and use of location data in accordance with our Privacy Policy.",
    },
    {
      title: "Prohibited Activities",
      description:
        "You agree not to: Use the app for illegal or unauthorized purposes. Submit false, misleading, or malicious reports. Disrupt the app’s functionality or compromise its security.",
    },
    {
      title: "Intellectual Property",
      description:
        "All app content, including text, graphics, logos, and software, is the property of SpotFix or its licensors and is protected by intellectual property laws. You may not copy, distribute, or create derivative works without explicit permission.",
    },
    {
      title: "Third-Party Links and Services",
      description:
        "The app may include links to third-party websites or services for additional resources. SpotFix is not responsible for the content or practices of these third parties.",
    },
    {
      title: "Limitation of Liability",
      description:
        "SpotFix is not liable for any damages resulting from the use of the app, including loss of data, financial losses, or harm caused by inaccurate reports.",
    },
    {
      title: "Contact Us",
      description:
        "For questions or concerns about these Terms and Conditions, please contact us at: Email: support@spotfixapp.com",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
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
      animation={'slideInUp'}
        style={{
          flex: 1,
          backgroundColor: currentColors.background,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          marginTop: -30,
          overflow: "hidden",
        }}>
        <ScrollView style={styles.container} contentContainerStyle={{  paddingBottom : 100}}>
          <Text style={styles.title}>Terms and Conditions</Text>
          <Text style={styles.updateDate}>Date updated: 5 Feb 2025</Text>
          <Text style={styles.welcomeText}>
            Welcome to SpotFix! By accessing or using our app, you agree to
            comply with and be bound by the following terms and conditions.
            Please read them carefully before using the app.
          </Text>

          <View>
            {termsList.map((term, index) => (
              <View key={index} style={styles.termContainer}>
                <Text style={styles.termTitle}>{`${index + 1}. ${
                  term.title
                }`}</Text>
                <Text style={styles.termDescription}>{term.description}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    paddingBottom : 50
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "blue",
    textAlign: "center",
    paddingBottom: 10,
  },
  updateDate: {
    fontSize: 15,
    color: "grey",
    textAlign: "left",
  },
  welcomeText: {
    fontSize: 12,
    color: "black",
    marginVertical: 16,
  },
  termContainer: {
    marginVertical: 10,
  },
  termTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "blue",
    paddingBottom: 5,
  },
  termDescription: {
    fontSize: 15,
    color: "black",
  },
});

export default TermsandCondition;

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
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
const Faqs = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isLogOutModalActive, setisLogOutModalActive] = useState(false);
  const [isDeleteAccountModaActive, setisDeleteAccountModaActive] =
    useState(false);

  const [expanded, setExpanded] = useState(null);

  const data = [
    {
      question: "How do I report an issue on SpotFix?",
      answer:
        "You can report an issue by selecting the location, adding a description, uploading images (if available), and choosing the priority level. You can also enable anonymous mode while reporting.",
    },
    {
      question: "How can I track the status of my reported issue?",
      answer:
        "Once you submit an issue, you can track its progress under the 'My Reports' section. You'll receive updates when the issue is acknowledged, in progress, or resolved.",
    },
    {
      question: "Can I vote on issues reported by others?",
      answer:
        "Yes, you can upvote issues reported by other users. Higher upvotes increase the priority of an issue, making it more likely to be addressed sooner.",
    },
    {
      question: "What types of announcements will I receive on the app?",
      answer:
        "You will get notifications about power outages, water supply disruptions, road closures, and other important updates from government authorities.",
    },
    {
      question: "How can I suggest improvements for government projects?",
      answer:
        "You can participate in the 'Government Proposals' section, where you can upvote/downvote projects and leave comments or suggestions for improvement.",
    },
    {
      question: "Is Aadhaar verification mandatory for using SpotFix?",
      answer:
        "Aadhaar verification is required for posting and voting to ensure authenticity, but you can browse reports and proposals without signing in.",
    },
  ];

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
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
        <ScrollView style={styles.container}>
          <Text style={styles.title}>FAQs</Text>
          <Text style={styles.subTitle}>
            We’re here to help you with anything and everything on Spotfix
          </Text>
          <Text style={styles.description}>
            SpotFix revolutionizes the way citizens interact with local
            government by providing an all-in-one platform for reporting public
            works issues, tracking progress, and staying informed about
            essential updates such as road closures or power outages.
          </Text>
          {data.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity
                onPress={() => toggleExpand(index)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Text style={styles.question}>{item.question}</Text>
                <Ionicons name="add" size={24} style={styles.question} />
              </TouchableOpacity>
              {expanded === index && (
                <Text style={styles.answer}>{item.answer}</Text>
              )}
            </View>
          ))}
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "blue",
    textAlign: "center",
    paddingBottom: 20,
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
    color: "#555",
  },
  faqItem: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    color: "blue",
  },
  answer: {
    fontSize: 16,
    lineHeight: 20,
    color: "#000",
    marginTop: 10,
  },
});

export default Faqs;

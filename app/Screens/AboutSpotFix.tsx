import {
  View,
  Image,
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
import logo from "../../assets/images/logo.png";

import gokul from "../../assets/images/team/gokul.jpg";
import megan from "../../assets/images/team/meg.jpg";
import aarton from "../../assets/images/team/aarton.jpg";
import rashita from "../../assets/images/team/rashita.jpg";
import tanveer from "../../assets/images/team/taanveer.jpg";
import pinky from "../../assets/images/team/pinky.jpg";
const AboutSpotFix = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isLogOutModalActive, setisLogOutModalActive] = useState(false);
  const [isDeleteAccountModaActive, setisDeleteAccountModaActive] =
    useState(false);

  const teamMembers = [
    {
      name: "Gokul Lekhwar",
      role: "Leader/Coder",
      img: gokul,
    },
    {
      name: "Megan Dias",
      role: "UI/UX",
      img: megan,
    },
    {
      name: "Rashita Gomes",
      role: "Tester",
      img: rashita,
    },
    {
      name: "Arton Bayross ",
      role: "Tester",
      img: aarton,
    },
    {
      name: "Tanaveer Badagi",
      role: "Documentation",
      img: tanveer,
    },
    {
      name: "Pinky Mandal",
      role: "Documentation",
      img: pinky,
    },
    {
      name: "Jordan Demelo",
      role: "",
      img: "../../assets/images/team/gokul.jpg",
    },
    {
      name: "Rhucha Bhobe",
      role: "",
      img: "../../assets/images/team/gokul.jpg",
    },
  ];

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
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 100 }}>
          <Text style={styles.title}>About Spotfix</Text>
          <View style={styles.rectangle}>
            <Image
              source={logo}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </View>
          <Text style={styles.tagline}>See it - Report it - Fix it</Text>

          <Text style={styles.meetTheTeam}>Meet the Team</Text>
          <View style={styles.teamContainer}>
            {teamMembers.map((member, index) => (
              <View key={index} style={styles.profile}>
                <View style={styles.circle}>
                  <Image
                    source={member.img}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      transform: [{ translateX: "-10%" }],
                    }}
                  />
                </View>
                <Text style={styles.name}>{member.name}</Text>
                <Text style={styles.role}>{member.role}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.description}>
            Welcome to SpotFix! - A platform that connects citizens with the
            government, ensuring their concerns are heard and addressed in one
            app.
          </Text>
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "blue",
  },
  rectangle: {
    width: "100%",
    height: 200,
    backgroundColor: "rgba(3, 219, 252,0.2)",
    marginBottom: 15,
    borderRadius: 20,
  },
  tagline: {
    fontSize: 20,
    fontWeight: "bold",

    textAlign: "center",
    marginBottom: 15,
  },
  meetTheTeam: {
    fontSize: 18,
    color: "blue",
    textAlign: "left",
    marginBottom: 10,
  },
  teamContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  profile: {
    alignItems: "center",
    width: "30%",
    marginVertical: 10,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "lightgrey",
    marginBottom: 5,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: '"rgba(3, 219, 252,1)",',
  },
  name: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
  role: {
    fontSize: 12,
    color: "grey",
  },
  description: {
    fontSize: 14,
    textAlign: "left",
    marginTop: 20,
  },
});

export default AboutSpotFix;

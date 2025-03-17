import { View, Text, TouchableOpacity } from "react-native";
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
const Help = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isLogOutModalActive, setisLogOutModalActive] = useState(false);
  const [isDeleteAccountModaActive, setisDeleteAccountModaActive] =
    useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: currentColors.backgroundDarker }}>
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

      <View
        style={{
          flex: 1,
          backgroundColor: currentColors.background,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          marginTop: -18,
          padding: 10,
          gap: 10,
          paddingTop: 30,
        }}>
        <Animatable.View animation="fadeInUp">
          <TouchableOpacity
            onPress={() => router.push("/screens/Faqs")}
            style={{
              width: "100%",
              backgroundColor: currentColors.backgroundDarker,
              padding: 15,
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Text style={{ color: currentColors.text }}>FAQ's</Text>
            <Ionicons
              name="chevron-forward-outline"
              color={currentColors.secondary}
              size={24}
            />
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation={"fadeInUp"} delay={100}>
          <TouchableOpacity
            onPress={() => router.push("/screens/ReportaProblem")}
            style={{
              width: "100%",
              backgroundColor: currentColors.backgroundDarker,
              padding: 15,
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Text style={{ color: currentColors.text }}>Report a problem</Text>
            <Ionicons
              name="chevron-forward-outline"
              color={currentColors.secondary}
              size={24}
            />
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation={"fadeInUp"} delay={150}>
          <TouchableOpacity
            onPress={() => router.push("/screens/Appversion")}
            style={{
              width: "100%",
              backgroundColor: currentColors.backgroundDarker,
              padding: 15,
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Text style={{ color: currentColors.text }}>App Version</Text>
            <Ionicons
              name="chevron-forward-outline"
              color={currentColors.secondary}
              size={24}
            />
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation={"fadeInUp"} delay={200}>
          <TouchableOpacity
            onPress={() => router.push("/screens/TermsandCondition")}
            style={{
              width: "100%",
              backgroundColor: currentColors.backgroundDarker,
              padding: 15,
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Text style={{ color: currentColors.text }}>
              Terms and Conditions
            </Text>
            <Ionicons
              name="chevron-forward-outline"
              color={currentColors.secondary}
              size={24}
            />
          </TouchableOpacity>
        </Animatable.View>
        <Animatable.View animation={"fadeInUp"} delay={200}>
          <TouchableOpacity
            onPress={() => router.push("/screens/AboutSpotFix")}
            style={{
              width: "100%",
              backgroundColor: currentColors.backgroundDarker,
              padding: 15,
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Text style={{ color: currentColors.text }}>About Spotfix</Text>
            <Ionicons
              name="chevron-forward-outline"
              color={currentColors.secondary}
              size={24}
            />
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </View>
  );
};
export default Help;

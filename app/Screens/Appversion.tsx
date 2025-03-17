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
const Appversion = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isLogOutModalActive, setisLogOutModalActive] = useState(false);
  const [isDeleteAccountModaActive, setisDeleteAccountModaActive] =
    useState(false);

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
        <View style={styles.container}>
          <Text style={styles.title}>App Version</Text>
          <View style={styles.box}>
            <Image
              source={logo}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </View>
          <Text style={styles.label}>Version</Text>
          <Text style={styles.version}>1.1.0</Text>
        </View>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "blue",
    textAlign: "center",
    marginBottom: 100,
  },
  box: {
    width: 200,
    height: 200,
    backgroundColor: "white",
    elevation : 5,
    marginBottom: 20,
    borderRadius: 20,
    padding: 10,
  },
  label: {
    fontSize: 16,
    color: "black",
    marginBottom: 5,
  },
  version: {
    fontSize: 24,
    color: "blue",
    fontWeight: "bold",
  },
});

export default Appversion;

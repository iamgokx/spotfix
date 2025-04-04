import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TouchableHighlight,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ImageBackground } from "react-native";
import imgBackground from "../../assets/images/gradients/bluegradient.png";
import SplashScreen from "@/components/SplashScreen";
import { clearStorage } from "@/hooks/useJwt";
import { Modal } from "react-native";
import { useEffect, useState } from "react";
import * as Animatable from "react-native-animatable";
import { getStoredData } from "@/hooks/useJwt";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { API_IP_ADDRESS } from "../../ipConfig.json";
const ChangePassword = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const [IsButtonActive, setIsButtonActive] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [user, setUser] = useState();
  const navigation = useNavigation();
  const getUserPicture = async () => {
    const user = await getStoredData();
    console.log(user);
    setUser(user);
  };

  useEffect(() => {
    getUserPicture();
  }, []);

  const handleChangePasswordPress = () => {
    console.log("change paswword ", user.email);
    router.push({
      pathname: "/password/PasswordOtp",
      params: { email: user.email },
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: currentColors.background,
        paddingBottom: insets.bottom + 10,
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: currentColors.background,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          marginTop: -18,
          padding: 10,
          gap: 50,
          paddingTop: 30,

          position: "relative",
        }}>
        {/* <Text
          style={{
            color: currentColors.text,
            fontSize: 15,
            textAlign: "center",
          }}>
          Select how the SpotFix team can contact you to change your password.
        </Text> */}

        <View
          style={{
            backgroundColor: currentColors.backgroundLighter,
            borderRadius: 30,
            padding: 10,

            flexDirection: "row",
            gap: 10,
            width: "100%",
          }}>
          {user && (
            <Image
              source={
                user.picture
                  ? {
                      uri: `http://${API_IP_ADDRESS}:8000/uploads/profile/${user.picture}`,
                    }
                  : require("../../assets/images/profile/defaultProfile.jpeg")
              }
              style={{ width: 100, height: 100, borderRadius: 300 }}
            />
          )}
          {user && (
            <View>
              <Text style={{ color: currentColors.secondary, fontSize: 20 }}>
                {user.name}
              </Text>
              <Text style={{ color: currentColors.text, fontSize: 20 }}>
                {user.email}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={handleChangePasswordPress}
          style={{
            alignSelf: "center",
            position: "absolute",
            bottom: insets.bottom + 10,
          }}>
          <Text
            style={{
              backgroundColor: currentColors.secondary,
              padding: 10,
              fontSize: 17,
              borderRadius: 30,
              paddingHorizontal: 20,
              color: "white",
            }}>
            Change Password
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePassword;

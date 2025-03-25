import { View, Text, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ImageBackground } from "react-native";
import imgBackground from "../../assets/images/gradients/bluegradient.png";
import { clearStorage, getStoredData } from "@/hooks/useJwt";
import { Modal } from "react-native";
import { useState } from "react";
import * as Animatable from "react-native-animatable";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
const UserSettings = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isLogOutModalActive, setisLogOutModalActive] = useState(false);
  const [isDeleteAccountModaActive, setisDeleteAccountModaActive] =
    useState(false);

  const onCloseLogOut = () => {
    setisLogOutModalActive(false);
  };

  const onConfirmLogOut = () => {
    setisLogOutModalActive(false);
    setTimeout(() => {
      clearStorage();
      router.replace("/welcome");
    }, 100);
  };

  const onCloseDeleteAccount = () => {
    setisDeleteAccountModaActive(false);
  };

  const onConfirmDeleteAccount = async () => {
    console.log("deleting account");
    try {
      const user = await getStoredData();
      const email = user.email;
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/users/deleteAccount`,
        {
          email: email,
        }
      );

      if (response.data.status) {
        console.log(response.data.message);
        console.log("deleted user account");
        router.replace("/welcome");
      } else {
        console.log(response.data.message);
        console.log("could not deleted user account");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: currentColors.backgroundDarker }}>
      <Modal transparent visible={isLogOutModalActive} animationType="slide">
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}>
          <View
            style={{
              backgroundColor: currentColors.backgroundDarkest,
              padding: 20,
              borderRadius: 20,
              gap: 20,
              width: "70%",
            }}>
            <Text
              style={{ color: currentColors.secondary, textAlign: "center" }}>
              Confirmation
            </Text>
            <Text style={{ color: currentColors.text }}>
              Are you sure you want to Log Out?
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}>
              <TouchableOpacity
                style={{ width: "40%" }}
                onPress={onCloseLogOut}>
                <Text
                  style={{
                    padding: 10,
                    textAlign: "center",
                    color: currentColors.secondary,
                    borderRadius: 30,
                    borderWidth: 3,
                    borderColor: currentColors.secondary,
                    fontWeight: 600,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ width: "40%" }}
                onPress={onConfirmLogOut}>
                <Text
                  style={{
                    padding: 10,
                    textAlign: "center",
                    color: "white",
                    borderRadius: 30,
                    backgroundColor: currentColors.secondary,
                    fontWeight: 600,
                  }}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent
        visible={isDeleteAccountModaActive}
        animationType="slide">
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}>
          <View
            style={{
              backgroundColor: currentColors.backgroundDarkest,
              padding: 20,
              borderRadius: 20,
              gap: 20,
              width: "70%",
            }}>
            <Text
              style={{ color: currentColors.secondary, textAlign: "center" }}>
              Confirmation
            </Text>
            <Text style={{ color: currentColors.text }}>
              Are you sure you want to DELETE your account?
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 20,
              }}>
              <TouchableOpacity
                style={{ width: "40%" }}
                onPress={onCloseDeleteAccount}>
                <Text
                  style={{
                    padding: 10,
                    textAlign: "center",
                    color: currentColors.secondary,
                    borderRadius: 30,
                    borderWidth: 3,
                    borderColor: currentColors.secondary,
                    fontWeight: 600,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ width: "40%" }}
                onPress={onConfirmDeleteAccount}>
                <Text
                  style={{
                    padding: 10,
                    textAlign: "center",
                    color: "white",
                    borderRadius: 30,
                    backgroundColor: currentColors.secondary,
                    fontWeight: 600,
                  }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
            Settings
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
            onPress={() => router.push("/password")}
            style={{
              width: "100%",
              backgroundColor: currentColors.backgroundDarker,
              padding: 15,
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Ionicons
                name="key-outline"
                color={currentColors.textShade}
                size={24}
              />
              <Text style={{ color: currentColors.text }}>Change Password</Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              color={currentColors.secondary}
              size={24}
            />
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation={"fadeInUp"} delay={150}>
          <TouchableOpacity
            onPress={() => setisLogOutModalActive((prev) => !prev)}
            style={{
              width: "100%",
              backgroundColor: currentColors.backgroundDarker,
              padding: 15,
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Ionicons
                name="log-out-outline"
                color={currentColors.textShade}
                size={24}
              />
              <Text style={{ color: currentColors.text }}>Log Out</Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              color={currentColors.secondary}
              size={24}
            />
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation={"fadeInUp"} delay={200}>
          <TouchableOpacity
            onPress={() => setisDeleteAccountModaActive(true)}
            style={{
              width: "100%",
              backgroundColor: "red",
              padding: 15,
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Ionicons name="trash-bin-outline" color={"white"} size={24} />
              <Text style={{ color: "white" }}>Delete Account</Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              color={"white"}
              size={24}
            />
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </View>
  );
};
export default UserSettings;

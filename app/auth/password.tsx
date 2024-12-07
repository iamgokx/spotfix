import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSignupContext } from "@/context/SignupContext";
import { ImageBackground } from "react-native";
import { Modal } from "react-native";
import { Pressable } from "react-native";
import "../../global.css";
import useSignup from "@/hooks/userSignup";
import Blob from "../../assets/images/blobs/b7.svg";
import LottieView from "lottie-react-native";
import loading from "../../assets/images/welcome/loading.json";
import useValidation from "@/hooks/useValidate";
const password = () => {
  const { validate, errors } = useValidation();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const { details, setDetails } = useSignupContext();
  const [passwordValue, setpasswordValue] = useState("");
  const [password, setPassword] = useState(false);
  const [confirmPassword, setconfirmPassword] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { Signup, error, isLoading } = useSignup();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleCreateAccoundPress = async () => {
    if (!details.password || !passwordValue) {
      setModalMessage("Please enter all details to proceed...");
      setModalVisible(true);
      return;
    }

    if (details.password !== passwordValue) {
      setModalMessage("Sorry, the passwords do not match.");
      setModalVisible(true);
      return;
    }
    const password = validate("password", details.password);
    if (password) {
      console.log("password is strong");
      const otpSent = await sendUserOtp();
      if (otpSent) {
        router.push("/auth/otp");
      }
    } else {
      console.log(errors.password);
    }
  };

  const sendUserOtp = async () => {
    try {
      const response = await Signup(details.email);
      if (response) {
        console.log("OTP sent successfully:", response);
        return true;
      } else {
        setModalMessage("Failed to send OTP. Please try again.");
        setModalVisible(true);
        return false;
      }
    } catch (error) {
      setModalMessage("An unexpected error occurred. Please try again.");
      setModalVisible(true);
      console.error("Error in sendUserOtp:", error);
      return false;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
          }}>
          <View style={styles.container}>
            {isLoading && (
              <View style={styles.loadingScreen}>
                <LottieView
                  source={loading}
                  autoPlay
                  loop
                  style={{ width: 90, height: 90 }}
                />
              </View>
            )}

            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>{modalMessage}</Text>

                  <Pressable
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            <ImageBackground
              style={styles.topContainer}
              resizeMode="cover"
              source={require("../../assets/images/blobs/b6.png")}>
              <Text className="text-center text-white text-3xl font-extrabold">
                Let's get Started
              </Text>
              <Text className="text-center text-white font-extralight">
                Protect Your Profile
              </Text>
              <View style={styles.progressContainer}>
                <Ionicons
                  className="w-4"
                  color="white"
                  name="ellipse"></Ionicons>
                <Ionicons
                  className="w-4"
                  color="white"
                  name="ellipse"></Ionicons>
                <Ionicons
                  className="w-4"
                  color="white"
                  name="ellipse"></Ionicons>
              </View>
            </ImageBackground>

            <View style={styles.detailsContainer}>
              <View style={[styles.inputContainer]}>
                <TextInput
                  style={[styles.input]}
                  placeholder="Your Password"
                  value={details.password}
                  onChangeText={(text) =>
                    setDetails((prev) => ({ ...prev, password: text }))
                  }
                  secureTextEntry={!password ? true : false}
                />
                <Ionicons
                  size={20}
                  color={"#0066ff"}
                  name={password ? "eye" : "eye-off"}
                  style={{ marginRight: 20 }}
                  onPress={() => setPassword((prev) => !prev)}></Ionicons>
              </View>

              <View style={[styles.inputContainer]}>
                <TextInput
                  style={[styles.input]}
                  placeholder="Confirm Your Password"
                  value={passwordValue}
                  onChangeText={(text) => setpasswordValue(text)}
                  secureTextEntry={!confirmPassword ? true : false}
                />
                <Ionicons
                  size={20}
                  color={"#0066ff"}
                  name={confirmPassword ? "eye" : "eye-off"}
                  style={{ marginRight: 20 }}
                  onPress={() =>
                    setconfirmPassword((prev) => !prev)
                  }></Ionicons>
              </View>
              <View style={{ width: "80%" }}>
                <Text style={{ color: "red" }}>{errors.password}</Text>
              </View>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                onPress={handleCreateAccoundPress}
                style={{ paddingBottom: keyboardVisible ? 100 : 20 }}>
                <Text style={styles.createAccountBtn}>Create Account</Text>
              </TouchableOpacity>
              <View
                style={{
                  height: 2,
                  backgroundColor: "#F4F2F2",
                  width: "70%",
                }}></View>
              <Text style={{ marginBottom: 6, textAlign: "center" }}>
                Already Have An Account?{" "}
                <TouchableOpacity
                  onPress={() => router.push("/auth")}
                  style={{ padding: 0 }}>
                  <Text style={styles.loginText}>Log In</Text>
                </TouchableOpacity>
              </Text>
            </View>

            <Blob style={styles.bottomImg} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
    margin: 0,
    width: "100%",
    height: "100%",
    zIndex: 8,
    backgroundColor: "white",
  },
  topContainer: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignContent: "center",
  },
  progressContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomImg: {
    width: "100%",
    height: 100,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: -10,
  },
  detailsContainer: {},
  inputContainer: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 40,
    elevation: 20,
    marginBottom: 20,
  },
  disabledContainer: {
    backgroundColor: "rgba(125, 230, 255, 1)",
  },
  icon: {
    paddingLeft: 20,
  },
  input: {
    width: "80%",
    height: 60,
    fontSize: 15,
    paddingLeft: 20,
    flex: 1,
    zIndex: 2,
  },

  mapInput: {
    width: "80%",
    height: 60,
    paddingLeft: 20,
    color: "gray",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "blue",
    textDecorationLine: "underline",
    marginTop: 10,
  },
  btnContainer: {
    width: "80%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    display: "flex",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    zIndex: 2,
  },
  blob: {
    position: "absolute",
    bottom: -25,
    width: "100%",
    zIndex: 1,
  },
  blob2: {
    position: "absolute",
    width: "100%",
    top: 0,
  },
  createAccountBtn: {
    fontSize: 20,
    borderRadius: 30,
    color: "white",
    backgroundColor: "#0066ff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    elevation: 10,
  },
  modalContainer: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 30,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  loadingScreen: {
    display: "flex",
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default password;

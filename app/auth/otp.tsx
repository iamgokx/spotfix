import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Keyboard,
  Modal,
  Pressable,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";
import { useSignupContext } from "@/context/SignupContext";
import useSignup from "@/hooks/userSignup";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
const Otp = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [modalVisible, setModalVisible] = useState(false);
  const { details } = useSignupContext();
  const [otpValue, setOtp] = useState(["", "", "", ""]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [otpError, setotpError] = useState(false);
  const { VerfyOtp, error, isLoading, Signup } = useSignup();
  const [timer, setTimer] = useState(300);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    startTimer();

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      clearInterval(timerRef.current!);
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (timer === 0) {
      clearInterval(timerRef.current!);
    }
  }, [timer]);

  const startTimer = () => {
    clearInterval(timerRef.current);
    setTimer(300);
    timerRef.current = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
  };

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otpValue];
    newOtp[index] = text;

    setOtp(newOtp);

    if (text && index < otpValue.length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const handleVerify = async () => {
    setotpError(false);
    console.log("OTP Entered:", otpValue.join(""));

    const user = await VerfyOtp(details.email, otpValue.join(""));

    if (user) {
      console.log("OTP Successfully Verified:", user.data.message);
    } else {
      setotpError(true);
      console.log("OTP Vefification Failed");
      setOtp(["", "", "", ""]);
    }
  };
  const sendUserOtp = async () => {
    if (timer > 0) {
      alert(`Please wait ${formatTime(timer)} before resending.`);
      return;
    }
    try {
      const response = await Signup(details.email);
      if (response) {
        startTimer();
        console.log("OTP sent successfully:", response);
      }
    } catch (error) {
      console.error("Error in sendUserOtp:", error);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: currentColors.background }}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
          <View style={styles.container}>
            <Modal
              animationType="fade"
              transparent
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    Please enter all details to proceed...
                  </Text>
                  <Pressable
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>

            <Animatable.View
              style={styles.topContainer}
              animation="fadeInDown"
              duration={700}>
              <ImageBackground
                style={styles.topContainer}
                resizeMode="cover"
                source={require("../../assets/images/blobs/b6.png")}>
                <Text style={styles.headerText}>
                  An OTP Has Been Sent To Your Email Address
                </Text>
                <Text style={styles.timerText}>{formatTime(timer)}</Text>
                <View style={styles.progressContainer}>
                  <Ionicons name="ellipse" color="white" />
                  <Ionicons name="ellipse" color="white" />
                  <Ionicons name="ellipse" color="white" />
                </View>
              </ImageBackground>
            </Animatable.View>

            <Animatable.View
              animation="fadeInUp"
              duration={700}
              style={styles.otpContainer}>
              {otpValue.map((value, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[
                    styles.input,
                    focusedIndex === index && styles.focused,
                    {
                      backgroundColor: currentColors.otpBox,
                      color: currentColors.text,
                    },
                  ]}
                  value={value}
                  maxLength={1}
                  keyboardType="number-pad"
                  onChangeText={(text) => handleChange(text, index)}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                />
              ))}
            </Animatable.View>
            {otpError && (
              <Text style={{ color: "red" }}>OTP does not match</Text>
            )}

            <Animatable.View
              animation="fadeInUp"
              duration={700}
              style={styles.btnContainer}>
              <TouchableOpacity
                onPress={handleVerify}
                style={{ paddingBottom: keyboardVisible ? 100 : 20 }}>
                <Text style={styles.otpVerifyBtn}>Verify</Text>
              </TouchableOpacity>
              <Pressable style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ color: currentColors.text }}>
                  Didn't receive an OTP ?
                </Text>
                <Text
                  onPress={() => sendUserOtp()}
                  style={{ color: currentColors.secondary }}
                  className="text-blue-600">
                  {" "}
                  Resend
                </Text>
              </Pressable>
              <View style={styles.separator} />
              <Text style={[styles.footerText, { color: currentColors.text }]}>
                Already Have An Account?{" "}
                <TouchableOpacity
                  onPress={() => router.push("/auth")}
                  style={{ paddingTop: 7 }}>
                  <Text
                    style={[
                      styles.loginText,
                      { color: currentColors.secondary },
                    ]}>
                    Log In
                  </Text>
                </TouchableOpacity>
              </Text>
            </Animatable.View>

            <Animatable.View
              style={styles.bottomImg}
              animation="fadeInUp"
              duration={500}>
              <ImageBackground
                style={styles.bottomImg}
                source={require("../../assets/images/blobs/b7.png")}
              />
            </Animatable.View>
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
    margin: 0,
    width: "100%",
    height: "100%",
    zIndex: 8,
  },
  topContainer: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignContent: "center",
  },
  headerText: {
    textAlign: "center",
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  timerText: {
    textAlign: "center",
    color: "white",
    marginTop: 5,
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginVertical: 30,
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  focused: {
    borderColor: "white",
  },
  btnContainer: {
    width: "80%",
    alignItems: "center",
  },
  otpVerifyBtn: {
    backgroundColor: "#007BFF",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  separator: {
    height: 2,
    backgroundColor: "#F4F2F2",
    width: "80%",
    marginVertical: 20,
  },
  footerText: {
    width: "59%",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "blue",
    textDecorationLine: "underline",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  bottomImg: {
    width: "100%",
    height: 100,
  },
});

export default Otp;

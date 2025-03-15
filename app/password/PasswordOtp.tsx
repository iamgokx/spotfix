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
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useSignup from "@/hooks/userSignup";
import { Colors } from "@/constants/Colors";
import imgBackground from "../../assets/images/gradients/bluegradient.png";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { getStoredData } from "@/hooks/useJwt";
import { useColorScheme } from "react-native";
const PasswordOtp = () => {
  const { email } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [modalVisible, setModalVisible] = useState(false);
  const [otpValue, setOtp] = useState(["", "", "", ""]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [otpError, setotpError] = useState(false);

  const [timer, setTimer] = useState(300);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [details, setDetails] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const VerfyOtp = async (email: string, otp: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://${API_IP_ADDRESS}:8000/api/users/otp/verify`,
        { params: { email, otp } }
      );
      setIsLoading(false);
      console.log("response data:", response.data);
      if (response.data.userStatus) {
        console.log("opt matching ");
        router.push("/password/newPassword");
        return true;
      }
      if (response.data.otpStatus == false) {
        console.log("opt dont match");
        return false;
      }
    } catch (err) {
      setIsLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "OTP verification failed.");
        console.error("Axios Error:", err.response?.data || err.message);
      } else {
        setError("Unexpected error occurred.");
        console.error("Unknown Error:", err);
      }
      return null;
    }
  };

  const getUserOtp = async () => {
    const data = await getStoredData();
    console.log("user data : ", data);
    setDetails(data);

    try {
      const response = await axios.get(
        `http://${API_IP_ADDRESS}:8000/api/users/otp`,
        {
          params: {
            email: data.email,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {

    getUserOtp();
  }, []);

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
  const sendUserOtp = async () => {};

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: currentColors.background }}>
      <ImageBackground
        source={imgBackground}
        style={{
          width: "100%",
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
            Change Password
          </Text>
        </View>
      </ImageBackground>
      <View
        style={{
          flex: 1,
          marginTop: -18,
          backgroundColor: currentColors.background,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          alignItems: "center",
          justifyContent: "flex-start",
        }}>
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
          <Text style={styles.headerText}>
            An OTP Has Been Sent To Your Email Address
          </Text>
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          duration={700}
          style={[styles.otpContainer, {}]}>
          {otpValue.map((value, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.input,
                focusedIndex === index && styles.focused,
                {
                  backgroundColor: "white",
                  color: "black",
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
        {otpError && <Text style={{ color: "red" }}>OTP does not match</Text>}

        <Animatable.View
          animation="fadeInUp"
          duration={700}
          style={[styles.btnContainer, { marginBottom: insets.bottom + 10 }]}>
          <TouchableOpacity
            onPress={handleVerify}
            style={{ paddingBottom: keyboardVisible ? 100 : 20 }}>
            <Text style={styles.otpVerifyBtn}>Verify</Text>
          </TouchableOpacity>
          <Pressable style={{ display: "flex", flexDirection: "row" }} onPress={getUserOtp}>
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
        </Animatable.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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

    position: "absolute",
    bottom: 0,
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

export default PasswordOtp;

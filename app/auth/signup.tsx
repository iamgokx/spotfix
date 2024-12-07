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
  Pressable,
} from "react-native";
import { Modal } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { blue } from "react-native-reanimated/lib/typescript/Colors";
import { ImageBackground } from "react-native";
import { useSignupContext } from "@/context/SignupContext";
import Blob6 from "../../assets/images/blobs/b6.svg";
import Blob7 from "../../assets/images/blobs/b7.svg";
import useValidation from "@/hooks/useValidate";
const Signup = () => {
  const router = useRouter();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { details, setDetails } = useSignupContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [formErrors, setFormErrors] = useState(false);
  const { validate, errors } = useValidation();
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

  const goToAddressScreen = () => {
    if (
      !details.name ||
      !details.phoneNumber ||
      !details.aadharCardNumber ||
      !details.email
    ) {
      setModalVisible(true);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const isFullNameValid = validate("fullName", details.name);
    const isPhoneValid = validate("phoneNumber", details.phoneNumber);
    const isAadhaarValid = validate(
      "aadhaarCardNumber",
      details.aadharCardNumber
    );
    const isEmailValid = validate("email", details.email);

    if (isFullNameValid && isPhoneValid && isAadhaarValid && isEmailValid) {
      router.push("/auth/useraddress");
    } else {
      setFormErrors(true);
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
            <Modal
              animationType="fade"
              transparent={true}
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
            <ImageBackground
              style={styles.topContainer}
              resizeMode="cover"
              source={require("../../assets/images/blobs/b6.png")}>
              <Text className="text-center text-white text-3xl font-extrabold">
                Let's get Started
              </Text>
              <Text className="text-center text-white font-extralight">
                Build Your Profile
              </Text>
              <View style={styles.progressContainer}>
                <Ionicons
                  className="w-4"
                  color="white"
                  name="ellipse"></Ionicons>
                <Ionicons
                  className="w-4"
                  color="white"
                  name="ellipse-outline"></Ionicons>
                <Ionicons
                  className="w-4"
                  color="white"
                  name="ellipse-outline"></Ionicons>
              </View>
            </ImageBackground>
            <View style={styles.detailsContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={details.name}
                  onChangeText={(text) =>
                    setDetails((prev) => ({ ...prev, name: text }))
                  }
                />
              </View>
              {errors.fullName && (
                <View style={styles.errorContainer}>
                  <Text
                    style={{
                      width: "90%",
                      textAlign: "left",
                      color: "red",
                    }}>
                    {errors.fullName}
                  </Text>
                </View>
              )}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  value={details.phoneNumber}
                  onChangeText={(text) =>
                    setDetails((prev) => ({ ...prev, phoneNumber: text }))
                  }
                  keyboardType="number-pad"
                />
              </View>
              {errors.phoneNumber && (
                <View style={styles.errorContainer}>
                  <Text
                    style={{
                      width: "90%",
                      textAlign: "left",
                      color: "red",
                    }}>
                    {errors.phoneNumber}
                  </Text>
                </View>
              )}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Aadhar Card Number"
                  value={details.aadharCardNumber}
                  keyboardType="number-pad"
                  onChangeText={(text) =>
                    setDetails((prev) => ({ ...prev, aadharCardNumber: text }))
                  }
                />
              </View>
              {errors.aadhaarCardNumber && (
                <View style={styles.errorContainer}>
                  <Text
                    style={{
                      width: "90%",
                      textAlign: "left",
                      color: "red",
                    }}>
                    {errors.aadhaarCardNumber}
                  </Text>
                </View>
              )}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={details.email}
                  onChangeText={(text) =>
                    setDetails((prev) => ({ ...prev, email: text }))
                  }
                />
              </View>
              {errors.email && (
                <View style={styles.errorContainer}>
                  <Text
                    style={{
                      width: "90%",
                      textAlign: "left",
                      color: "red",
                    }}>
                    {errors.email}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                onPress={goToAddressScreen}
                style={{ paddingBottom: keyboardVisible ? 100 : 20 }}>
                <Text style={styles.nextButton}>Next</Text>
              </TouchableOpacity>
              <View
                style={{
                  height: 2,
                  backgroundColor: "#F4F2F2",
                  width: "80%",
                }}></View>
              <View
                style={{
                  padding: 10,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Text>Already a user? </Text>
                <TouchableOpacity
                  onPress={() => router.push("/auth/signup")}
                  style={{ zIndex: 2 }}>
                  <Text style={styles.loginText}> Log In</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Blob7 style={styles.bottomImg} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    gap: 50,
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
    zIndex: 0,
  },
  progressContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  btnContainer: {
    width: "80%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomImg: {
    width: "100%",
    marginBottom: -10,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    transform: [{ scaleX: 1.1 }],
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
  errorContainer: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    marginBottom: 5,
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
  loginText: {
    color: "blue",
    textDecorationLine: "underline",
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
  nextButton: {
    width: "50%",
    fontSize: 20,
    borderRadius: 30,
    color: "white",
    backgroundColor: "#0066ff",
    paddingVertical: 15,
    paddingHorizontal: 70,
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
});

export default Signup;

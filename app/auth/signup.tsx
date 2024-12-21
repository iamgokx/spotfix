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
import { useColorScheme } from "react-native";
import { Colors } from "../../constants/Colors";
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
import axios from "axios";
import * as Animatable from "react-native-animatable";
import { API_IP_ADDRESS } from "../../ipConfig.json";
const Signup = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const router = useRouter();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { details, setDetails } = useSignupContext();

  const [modalText, setModalText] = useState("");
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
    if (!details.phoneNumber || !details.email) {
      setModalText(" Please enter all details to proceed...");
    } else {
      getAadharDetails();
    }
  };

  const getAadharDetails = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/users/getAadharDetails`,
        {
          phoneNumber: details.phoneNumber,
        }
      );
      if (response.data.userExists) {
        console.log(response.data.results[0]);
        setDetails((prev) => ({
          ...prev,
          aadharCardNumber: response.data.results[0].aadhaar_number,
        }));
        setDetails((prev) => ({
          ...prev,
          name: response.data.results[0].full_name,
        }));
        setDetails((prev) => ({
          ...prev,
          city: response.data.results[0].city,
        }));
        setDetails((prev) => ({
          ...prev,
          locality: response.data.results[0].locality,
        }));
        setDetails((prev) => ({
          ...prev,
          pincode: response.data.results[0].pincode,
        }));
        setDetails((prev) => ({
          ...prev,
          state: response.data.results[0].state,
        }));
        setDetails((prev) => ({
          ...prev,
          address: ` ${response.data.results[0].locality} ${response.data.results[0].city} ${response.data.results[0].pincode} ${response.data.results[0].state}`,
        }));
        console.log(response.data.results[0].city);
        console.log(response.data.results[0].state);
        console.log(response.data.results[0].locality);
        console.log(response.data.results[0].pincode);

        handleSubmit();

        console.log(details);
      } else {
        setModalText(
          " The Number entered is not linked to any Aadhar Card, please enter a valid Number "
        );
      }
    } catch (error) {
      console.log("error getting aadhar details : ", error);
    }
  };

  const handleSubmit = () => {
    const isphoneNumberValid = validate("phoneNumber", details.phoneNumber);
    const isEmailValid = validate("email", details.email);

    if (isphoneNumberValid && isEmailValid) {
      router.push("/auth/password");
    } else {
      setFormErrors(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" translucent />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
          }}>
          <View
            style={[
              styles.container,
              { backgroundColor: currentColors.background },
            ]}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalText == "" ? false : true}
              onRequestClose={() => setModalText("")}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>{modalText}</Text>

                  <Pressable
                    style={styles.closeButton}
                    onPress={() => setModalText("")}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            <Animatable.View
              style={styles.topContainer}
              animation="fadeInDown"
              duration={500}>
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
            </Animatable.View>
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                height: "50%",
                position: "relative",
              }}>
              <Animatable.View
                animation="fadeInUp"
                duration={700}
                style={styles.detailsContainer}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number linked to Aadhar Card"
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
                        textAlign: "center",
                        color: "red",
                      }}>
                      {errors.phoneNumber}
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
                        textAlign: "center",
                        color: "red",
                      }}>
                      {errors.email}
                    </Text>
                  </View>
                )}
                {/* 
                {details.aadharCardNumber && (
                  <>
                    <Text style={{ color: currentColors.text }}>
                      Loaded Details
                    </Text>
                    <View
                      style={{
                        width: "90%",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        backgroundColor: "white",
                        borderRadius: 10,
                        gap: 10,
                        elevation: 20,
                        padding: 10,
                      }}>
                      <Text>
                        Aadhar Card Number : {details.aadharCardNumber}
                      </Text>
                      <Text>Full Name : {details.name}</Text>
                      <Text>Address : {details.address}</Text>
                    </View>
                  </>
                )} */}
              </Animatable.View>
              <Animatable.View
                animation="fadeInUp"
                duration={800}
                style={styles.btnContainer}>
                <TouchableOpacity
                  onPress={goToAddressScreen}
                  style={{ paddingBottom: keyboardVisible ? 20 : 20 }}>
                  <Text
                    style={[
                      styles.nextButton,
                      { backgroundColor: currentColors.secondary },
                    ]}>
                    Next
                  </Text>
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
                  <Text style={[{ color: currentColors.text }]}>
                    Already a user?{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/auth")}
                    style={{ zIndex: 2 }}>
                    <Text
                      style={[
                        styles.loginText,
                        { color: currentColors.secondary },
                      ]}>
                      {" "}
                      Log In
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animatable.View>
            </View>
            <Animatable.View animation="fadeInUp" duration={500}>
              <Blob7 style={styles.bottomImg} />
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
    gap: 50,
    alignItems: "center",
    padding: 0,
    margin: 0,
    width: "100%",
    height: "100%",
    zIndex: 8,
    backgroundColor: "rgb(239, 247, 255)",
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
    margin: 10,
  },
  bottomImg: {
    width: "100%",
    marginBottom: -10,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",

    transform: [{ scaleX: 1.1 }],
  },
  detailsContainer: {
    // backgroundColor: "#ffffff",
    width: "90%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    gap: 20,
    height: "70%",
  },
  inputContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 40,
    elevation: 20,
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
    paddingHorizontal: 50,
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

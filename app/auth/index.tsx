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
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Modal } from "react-native";
import { Pressable } from "react-native";
import useLogin from "@/hooks/useLogin";
import Blob4 from "../../assets/images/blobs/b4.svg";
import Blob5 from "../../assets/images/blobs/b5.svg";
import LottieView from "lottie-react-native";
import { generateJwt, getStoredData } from "../../hooks/useJwt";
import loginLottie from "../../assets/images/welcome/login.json";
import { useColorScheme } from "react-native";
import { Colors } from "../../constants/Colors";
import * as Animatable from "react-native-animatable";
import socket from "@/hooks/useSocket";
const Index = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { login, isLoading, error } = useLogin();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loginModal, setloginModal] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);
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

  // useEffect(() => {
  //   const getUser = async () => {
  //     const user = await getStoredData();
  //     const email = user.email;
  //     socket.emit("setup", email);
  //   };

  //   getUser();
  // }, [socket]);

  const handleLogInPress = async () => {
    console.log(email, password);
    if (!email && !password) {
      setModalVisible(true);
    } else {
      Keyboard.dismiss();

      const user = await login(email, password);
      console.log("user: ", user);

      if (user) {
        const details = {
          name: user.full_name,
          email: user.email,
        };
        console.log("converted details : ", details);
        const jwtRes = await generateJwt(details);

        console.log(jwtRes);
        if (jwtRes) {
          console.log("Login Token Set");
          if (jwtRes == "super_admin") {
            router.replace("/admin/home");
          } else if (jwtRes == "citizen") {
            router.replace("/home");
          } else if (jwtRes == "department_coordinator") {
            router.replace("/branchCoordinators/Home");
          } else if (jwtRes == "sub_branch_coordinator") {
            router.replace("/subBranchCoordinator/ApproveIssues");
          }
        }
      } else {
        setloginModal(true);
        console.log("Login failed with error : ", error);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 0, width: "100%" }}>
      <StatusBar backgroundColor={currentColors.background} />
      <KeyboardAvoidingView
        style={{ flex: 1, padding: 0, width: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 0,
            width: "100%",
          }}>
          <View
            style={[
              styles.container,
              { backgroundColor: currentColors.background },
            ]}>
            <Text
              className="text-3xl font-extrabold"
              style={[{ color: currentColors.text }]}>
              Spotfix Login
            </Text>

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

            <Modal
              animationType="fade"
              transparent={true}
              visible={loginModal}
              onRequestClose={() => setModalVisible(false)}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    Login Failed - Invalid Credentials
                  </Text>

                  <Pressable
                    style={styles.closeButton}
                    onPress={() => setloginModal(false)}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>

            <LottieView
              source={loginLottie}
              autoPlay
              loop
              style={{
                marginTop: "10%",
                marginBottom: "2%",
                width: 300,
                height: 300,
              }}
            />

            <Animatable.View
              animation="fadeInUp"
              duration={500}
              style={styles.inputContainer}>
              <Ionicons name="at" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter email"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </Animatable.View>

            <Animatable.View
              animation="fadeInUp"
              duration={600}
              style={styles.inputContainer}>
              <TouchableOpacity>
                <Ionicons
                  name={passwordVisible ? "eye" : "eye-off"}
                  onPress={() => setPasswordVisible((prev) => !prev)}
                  size={20}
                  color="gray"
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={passwordVisible ? true : false}
              />
            </Animatable.View>

            <TouchableOpacity onPress={handleLogInPress} style={{ zIndex: 3 }}>
              <Animatable.Text
                animation="fadeInUp"
                duration={600}
                style={styles.loginBtn}>
                Log in Now
              </Animatable.Text>
            </TouchableOpacity>

            <View
              style={{
                padding: 10,
                paddingBottom: keyboardVisible ? 100 : 20,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Animatable.Text
                animation="fadeInUp"
                duration={800}
                style={[{ color: currentColors.text }]}>
                Not a user?{" "}
              </Animatable.Text>
              <TouchableOpacity
                onPress={() => router.push("/auth/signup")}
                style={{ zIndex: 4 }}>
                <Animatable.Text
                  animation="fadeInUp"
                  duration={800}
                  style={styles.signupText}>
                  Sign Up
                </Animatable.Text>
              </TouchableOpacity>
            </View>

            <Blob5 style={styles.blob} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    margin: 0,
    width: "100%",
  },
  inputContainer: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 40,
    elevation: 20,
    marginBottom: 20,
    zIndex: 3,
  },
  icon: {
    paddingLeft: 20,
  },
  input: {
    width: "80%",
    height: 60,
    fontSize: 15,
    paddingLeft: 10,
    flex: 1,
    zIndex: 2,
  },
  signupText: {
    color: "orange",
    textDecorationLine: "underline",
    // marginTop: 10,
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
    bottom: -40,
    width: "100%",
    zIndex: 1,
    padding: 0,
    margin: 0,
    transform: [{ scaleX: 1.1 }],
  },
  blob2: {
    position: "absolute",
    width: "100%",
    top: 0,
    transform: [{ scaleX: 1.1 }],
    shadowColor: "black",
    elevation: 15,
  },
  loginBtn: {
    fontSize: 20,
    borderRadius: 30,
    color: "white",
    backgroundColor: "orange",
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
    paddingHorizontal: 30,
    backgroundColor: "#007BFF",
    borderRadius: 30,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Index;

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
import { generateJwt } from "../../hooks/useJwt";
import loginLottie from "../../assets/images/welcome/login.json";
const Index = () => {
  const { login, isLoading, error } = useLogin();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loginModal, setloginModal] = useState(false);
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

  const handleLogInPress = async () => {
    console.log(email , password);
    if (!email && !password) {
      setModalVisible(true);
    } else {
      Keyboard.dismiss();

      const user = await login(email, password);
      if (user) {
        const details = {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
        };
        console.log('converted details : ',details);
        const jwtRes = await generateJwt(details);
        if (jwtRes) {
          console.log("Login Token Set");
          router.push("/home");
        }
      } else {
        setloginModal(true);
        console.log("Login failed with error : ", error);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 0, width: "100%" }}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
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
          <View style={styles.container}>
            <Text className="text-3xl font-extrabold">Spotfix Login</Text>

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

            <View style={styles.inputContainer}>
              <Ionicons name="at" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter email"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="eye" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
              />
            </View>

            <TouchableOpacity onPress={handleLogInPress} style={{ zIndex: 3 }}>
              <Text style={styles.loginBtn}>Log in</Text>
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
              <Text>Not a user? </Text>
              <TouchableOpacity
                onPress={() => router.push("/auth/signup")}
                style={{ zIndex: 2 }}>
                <Text style={styles.signupText}>Sign Up</Text>
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

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
import { useSignupContext } from "@/context/SignupContext";
import { ImageBackground } from "react-native";
import { Modal } from "react-native";
import { Pressable } from "react-native";
import LottieView from "lottie-react-native";
import mapIcon from "../../assets/images/welcome/map.json";
import Blob from "../../assets/images/blobs/b7.svg";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
const useraddress = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const { details, setDetails } = useSignupContext();

  const [password, setPassword] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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

  const openMap = () => {
    router.push("/auth/map");
  };

  const isAddressComplete = () => {
    const isUserAddressComplete =
      details.address &&
      details.city &&
      details.state &&
      details.pincode &&
      details.latitude &&
      details.longitude;

    const isGeneratedAddressComplete =
      details.generatedAddress &&
      details.generatedCity &&
      details.generatedState &&
      details.generatedPincode &&
      details.latitude &&
      details.longitude;

    const isMixedAddressComplete =
      details.latitude &&
      details.longitude &&
      (details.address || details.generatedAddress) &&
      (details.city || details.generatedCity) &&
      (details.state || details.generatedState) &&
      (details.pincode || details.generatedPincode);

    return (
      isUserAddressComplete ||
      isGeneratedAddressComplete ||
      isMixedAddressComplete
    );
  };

  const goToPasswordScreen = () => {
    if (!isAddressComplete()) {
      setModalVisible(true);
    } else {
      router.push("/auth/password");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor={currentColors.background}
      />
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
                Help Us Locate You
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
                  name="ellipse-outline"></Ionicons>
              </View>
            </ImageBackground>
            <View style={styles.detailsContainer}>
              <TouchableOpacity
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                activeOpacity={0.7}
                onPress={openMap}>
                <View
                  style={[
                    styles.inputContainer,
                    { backgroundColor: currentColors.backgroundSecondary },
                  ]}>
                  <TextInput
                    style={[styles.input]}
                    placeholderTextColor={currentColors.textSecondary}
                    placeholder={
                      details.generatedCity === ""
                        ? "Drop Pin On Map"
                        : `${details.generatedState} , ${details.generatedCity} ${details.generatedPincode}`
                    }
                    value={password}
                    editable={false}
                    multiline={false}
                  />

                  <LottieView
                    source={mapIcon}
                    autoPlay
                    loop
                    style={{
                      marginTop: "10%",
                      marginBottom: "2%",
                      width: 60,
                      height: 60,
                      position: "absolute",
                      right: 0,
                    }}
                  />
                </View>
              </TouchableOpacity>
              {details.address && (
                <>
                  <Text style={{ margin: 10 ,color : currentColors.text}}>Location Details</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      !details.generatedAddress
                        ? null
                        : styles.disabledContainer,
                    ]}>
                    <TextInput
                      style={[styles.input]}
                      placeholder="Address"
                      multiline
                      value={
                        details.generatedAddress == ""
                          ? details.address
                          : details.generatedAddress
                      }
                      onChangeText={(text) =>
                        setDetails((prev) => ({ ...prev, address: text }))
                      }
                      editable={!details.generatedAddress}
                    />
                  </View>
                </>
              )}
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                onPress={goToPasswordScreen}
                style={{ paddingBottom: keyboardVisible ? 100 : 20 }}>
                <Text
                  style={[
                    styles.loginBtn,
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
              <Text
                style={{
                  marginBottom: 6,
                  textAlign: "center",
                  color: currentColors.text,
                }}>
                Already Have An Account?{" "}
                <TouchableOpacity
                  onPress={() => router.push("/auth")}
                  style={{ padding: 0 }}>
                  <Text
                    style={[
                      styles.loginText,
                      { color: currentColors.secondary },
                    ]}>
                    Log In
                  </Text>
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
    backgroundColor: "#eff7ff",
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
  detailsContainer: {
    // backgroundColor: "#ffffff",
    width: "90%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    gap: 20,
  },
  inputContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 40,
    elevation: 20,
  },
  disabledContainer: {
    backgroundColor: "white",
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
  loginBtn: {
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

export default useraddress;

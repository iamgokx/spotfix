import { View, Text, Button, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native";
import LottieView from "lottie-react-native";
import verifyUser from "../../assets/images/welcome/verifyingUser.json";
import { jwtDecode } from "jwt-decode";
import { useSignupContext } from "../../context/SignupContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useRouter } from "expo-router";
import { generateJwt, getStoredData, storeData } from "../../hooks/useJwt";
const finalVerification = () => {
  const { details, clearDetails } = useSignupContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [userStatus, setUserStatus] = useState({
    aadharVerification: false,
    userExists: false,
  });
  const [aadharUserExists, setAadharUserExists] = useState(false);
  const handleVerifyUser = async () => {
    setLoading(true);
    setResponseMessage("");
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/users/verifyUser`,
        details
      );

      if (response.data) {
        setUserStatus({
          aadharVerification: response.data.aadharVerification || false,
          userExists: response.data.userExists || false,
        });
        setTimeout(() => {
          setLoading(false);
          if (response.data.aadharVerification && response.data.userExists) {
            setResponseMessage(
              "Aadhar Successfully Verified, User Already Exists Please Log In"
            );
            setAadharUserExists(true);
          } else if (response.data.aadharVerification) {
            setResponseMessage(
              "Aadhar Successfully Verified \n Creating Account"
            );
            const jwtRes = generateJwt(details);
            if (jwtRes) {
              setTimeout(() => {
                clearDetails();
                router.push("/home");
              }, 2000);
            } else {
              console.log("failed to create jwt token");
            }
          } else {
            setResponseMessage("Aadhar verification failed.");
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      setResponseMessage("An error occurred while verifying user details.");
    }
  };

  useEffect(() => {
    handleVerifyUser();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{
          fontSize: 40,
          fontWeight: 900,
          position: "absolute",
          top: 100,
        }}>
        SpotFix
      </Text>

      <View
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}>
        <LottieView
          source={verifyUser}
          autoPlay
          loop
          style={{
            width: 200,
            height: 200,
          }}
        />
      </View>
      {loading && <Text>Verifying Details...</Text>}
      <Text
        style={{
          fontSize: 20,
          width: "90%",
          textAlign: "center",
        }}>
        {responseMessage}
      </Text>

      {aadharUserExists && (
        <TouchableOpacity
          onPress={() => router.push("/auth")}
          style={{ margin: 20, postion: "absolute", bottom: -100 }}>
          <Text
            style={{
              fontSize: 20,
              borderRadius: 30,
              color: "white",
              backgroundColor: "orange",
              paddingVertical: 15,
              paddingHorizontal: 50,
              elevation: 10,
            }}>
            Log In
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};
export default finalVerification;

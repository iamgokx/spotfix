import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { getStoredData } from "@/hooks/useJwt";
import imgBackground from "../../assets/images/gradients/bluegradient.png";

import { API_IP_ADDRESS } from "../../ipConfig.json";
import axios from "axios";
const NewPassword = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [user, setUser] = useState();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  const validatePassword = (pass) => {
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const isValidLength = pass.length >= 8;

    if (!isValidLength) return "Password must be at least 8 characters long.";
    if (!hasUpperCase)
      return "Password must contain at least one uppercase letter.";
    if (!hasNumber) return "Password must contain at least one number.";
    return "";
  };

  useEffect(() => {
    getStoredData().then(setUser);
  }, []);

  useEffect(() => {
    if (!validatePassword(password) && password === confirmPassword) {
      setIsValid(true);
      setError("");
    } else {
      setIsValid(false);
      setError(
        password !== confirmPassword
          ? "Passwords do not match."
          : validatePassword(password)
      );
    }
  }, [password, confirmPassword]);
  const handleChangePasswordPress = async () => {
    console.log("Change Password for:", user?.email);
    setError(""); // Clear previous errors

    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/users/setNewPassword`,
        {
          password: password,
          user: user.email,
        }
      );

      if (response.data.status) {
        console.log("Password changed successfully");
        router.replace("/password/userLogout");
      } else {
        // Set error based on API response message
        setError(
          response.data.message ||
            "Could not change password. Please try again."
        );
      }
    } catch (error) {
      console.error("Error changing password:", error);

      if (error.response) {
        // Server responded with an error status
        if (error.response.status === 400) {
          setError(
            error.response.data.message ||
              "Invalid request. Please check your input."
          );
        } else if (error.response.status === 404) {
          setError("User not found. Please check your email.");
        } else if (error.response.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else if (error.request) {
        // No response received (network issue)
        setError("Network error. Please check your internet connection.");
      } else {
        // Other unexpected errors
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: currentColors.background,
        paddingBottom: insets.bottom + 10,
      }}>
      {/* Header */}
      <ImageBackground source={imgBackground} style={styles.header}>
        <Ionicons
          onPress={() => router.back()}
          name="chevron-back-outline"
          size={24}
          color="white"
          style={styles.backIcon}
        />
        <Text style={styles.headerText}>New Password</Text>
      </ImageBackground>

      {/* Body */}
      <View
        style={[styles.body, { backgroundColor: currentColors.background }]}>
        {/* Password Input */}
        <View style={styles.container}>
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: currentColors.backgroundDarker },
            ]}>
            <TextInput
              style={[styles.input, { color: currentColors.text }]}
              placeholder="Enter Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor={currentColors.textShade}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color={currentColors.secondary}
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.inputContainer,
              { backgroundColor: currentColors.backgroundDarker },
            ]}>
            <TextInput
              style={[styles.input, { color: currentColors.text }]}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor={currentColors.textShade}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={24}
                color={currentColors.secondary}
              />
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
        {isValid && (
          <TouchableOpacity
            onPress={handleChangePasswordPress}
            style={{
              alignSelf: "center",
              position: "absolute",
              bottom: insets.bottom + 10,
              backgroundColor: currentColors.secondary,
              padding: 10,
              borderRadius: 30,
              paddingHorizontal: 20,
            }}>
            <Text style={{ fontSize: 17, color: "white" }}>
              Change Password
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 140,
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backIcon: {
    position: "absolute",
    left: 10,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  body: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -18,
    padding: 20,
    position: "relative",
  },
  container: {
    width: "90%",
    alignSelf: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 30,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 50,
  },
  errorText: {
    color: "red",
    marginTop: 5,
    textAlign: "center",
  },
  button: {
    alignSelf: "center",
    position: "absolute",
    bottom: 20,
    padding: 10,
    fontSize: 17,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
  },
});

export default NewPassword;

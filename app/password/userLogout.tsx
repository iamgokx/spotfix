import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
const userLogout = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentColors.backgroundDarkest },
      ]}>
      <Ionicons
        name="checkmark-circle"
        size={80}
        color={currentColors.secondary}
      />
      <Text style={[styles.successText, { color: currentColors.secondary }]}>
        Password Changed Successfully
      </Text>
      <Text style={[styles.infoText,{color : currentColors.text}]}>Please log in again to continue.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/auth")}>
        <Text style={[styles.buttonText,{backgroundColor : currentColors.primary}]}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
  successText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
    marginVertical: 10,
  },
  button: {
    backgroundColor: Colors.light.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 17,
    color: "white",
    fontWeight: "bold",
  },
});

export default userLogout;

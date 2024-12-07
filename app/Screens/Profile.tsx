import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomHeader from "@/components/CustomHeader";

const ProfileScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Pass the navigation prop to CustomHeader */}
      <CustomHeader navigation={navigation} />
      <Text style={styles.title}>This is the Profile Screen!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#EEF7FF",
    
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default ProfileScreen;

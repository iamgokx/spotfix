import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const Help = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Help and Support</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Help;

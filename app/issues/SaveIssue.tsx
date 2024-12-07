import { View, Text, StyleSheet, Image } from "react-native";
import LottieView from "lottie-react-native";
import { useRef } from "react";
const b1 = require("../../assets/images/blobs/b1.png");
import loading from "../../assets/lottie/process.json";
import { TouchableOpacity } from "react-native";
const SaveIssue = () => {
  const animationRef = useRef(null);

  const handlePress = () => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  };
  return (
    <View style={styles.container}>
      <Image source={b1} style={styles.blob1} />
      <Text style={styles.text}>Saving Your Report</Text>
      <TouchableOpacity onPress={handlePress}>
        <LottieView
          ref={animationRef}
          source={loading}
          style={styles.lottie}
          loop={false}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  text: {
    fontSize: 24,
    color: "orange",
    marginVertical: 20,
    textAlign: "center",
  },
  blob1: {
    width: "120%",
    position: "absolute",
    top: 0,
  },
  lottie: {
    width: 300,
    height: 300,
    borderRadius: 50,
  },
});

export default SaveIssue;

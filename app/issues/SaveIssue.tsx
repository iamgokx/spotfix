import { View, Text, StyleSheet, Image } from "react-native";
import LottieView from "lottie-react-native";
import { useRef, useEffect } from "react";
import Blob9 from "../../assets/images/blobs/b9.svg";
import Blob10 from "../../assets/images/blobs/b10.svg";
import loading from "../../assets/lottie/process.json";
import { TouchableOpacity } from "react-native";
import { useIssueContext } from "../../context/IssueContext";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "expo-router";

const SaveIssue = () => {
  const animationRef = useRef(null);
  const router = useRouter();
  const handlePress = () => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  };
  const [isloading, setisloading] = useState(false);

  useEffect(() => {
    setisloading(true);
    setTimeout(() => {
      setisloading(false);
      //change this later nigga, you are supposed to show a message that issue is registered
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Blob9 style={styles.blob1} />
      <Text style={styles.text}>Saving Your Report</Text>
      <TouchableOpacity onPress={handlePress}>
        <LottieView autoPlay source={loading} style={styles.lottie} loop />
      </TouchableOpacity>
      {isloading && <Text>Loading</Text>}
      <Blob10 style={styles.blob2} />
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
  blob2: {
    width: "120%",
    position: "absolute",
    bottom: -10,
  },
  lottie: {
    width: 300,
    height: 300,
    borderRadius: 50,
  },
});

export default SaveIssue;

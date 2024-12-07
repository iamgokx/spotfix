import { View, Text, StyleSheet, Image } from "react-native";
import LottieView from "lottie-react-native";
import { useRef, useEffect } from "react";
const b1 = require("../../assets/images/blobs/b1.png");
import loading from "../../assets/lottie/process.json";
import { TouchableOpacity } from "react-native";
import { useIssueContext } from "../../context/IssueContext";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import axios from "axios";
import { useState } from "react";

const SaveIssue = () => {
  const animationRef = useRef(null);
  const { details } = useIssueContext();
  const handlePress = () => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  };
  const [isloading, setisloading] = useState(false);

  useEffect(() => {
    submitIssue();
  }, []);

  const submitIssue = async () => {
    setisloading(true);
    try {
      const formData = new FormData();
      formData.append("title", details.title);
      formData.append("description", details.description);
      formData.append("suggestions", details.suggestions);
      formData.append("department", details.department);
      formData.append("latitude", details.latitude);
      formData.append("longitude", details.longitude);
      formData.append("generatedCity", details.generatedCity);
      formData.append("generatedPincode", details.generatedPincode);
      formData.append("generatedAddress", details.generatedAddress);
      formData.append("generatedLocality", details.generatedLocality);

      details.media.forEach((file, index) => {
        const fileType = file.type.split("/")[1];
        formData.append("media", {
          uri: file.uri,
          type: file.type,
          name: `media-${index}.${fileType}`,
        });
      });

      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/users/submitIssue`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setisloading(false);
      console.log("Response from server:", response.data);
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <Image source={b1} style={styles.blob1} />
      <Text style={styles.text}>Saving Your Report</Text>
      <TouchableOpacity onPress={handlePress}>
        <LottieView autoPlay source={loading} style={styles.lottie} loop />
      </TouchableOpacity>
      {isloading && <Text>Loading</Text>}
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

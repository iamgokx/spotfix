import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import LottieView from "lottie-react-native";
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import { FeSpotLight } from "react-native-svg";
const Issue = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.nameContainer}>
        <Ionicons
          name="person"
          color={"black"}
          size={25}
          style={styles.userPfp}></Ionicons>
        <View style={styles.subContainer}>
          <Text style={styles.userName}>Gokul Lekhwar</Text>
          <Text>Wed 9:42 am</Text>
        </View>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Broken Street Light</Text>
        <Text style={styles.progress}>In progress</Text>
      </View>
      <View style={styles.imgContainer}>
       
      </View>
      <Text style={styles.desc}>
        This light has been broken for the past 2 weeks, and the civilians have
        been <Text style={{ color: "#0066ff" }}>View more...</Text>
      </Text>
      <View style={styles.iconsContainer}>
        <View style={styles.reactions}>
          <Ionicons
            style={styles.reactions}
            name="arrow-up-circle"
            size={24}
            color={"#0066ff"}></Ionicons>
          <Text style={{ fontSize: 15 }}>30</Text>
        </View>
        <View style={styles.reactions}>
          <Ionicons
            style={styles.reactions}
            name="arrow-down-circle"
            size={24}
            color={"#0066ff"}></Ionicons>
          <Text style={{ fontSize: 15 }}>2</Text>
        </View>
        <View style={styles.reactions}>
          <Ionicons
            style={styles.reactions}
            name="chatbubbles"
            size={24}
            color={"#0066ff"}></Ionicons>
          <Text style={{ fontSize: 15 }}>6</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ani: {
    width: 400,
    height: 400,
  },
  container: {
    width: "90%",
    height: "auto",
    alignSelf: "auto", //remove later
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    backgroundColor: "white",
    marginTop: 10,
  },

  subContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  nameContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    gap: 10,
    alignItems: "center",
  },
  userPfp: {
    width: "10%",
    backgroundColor: "orange",
    borderRadius: 20,
    textAlign: "center",
    paddingVertical: 5,
  },
  userName: {
    fontSize: 15,
    fontWeight: 900,
  },
  imgContainer: {
    width: "100%",
    height: 200,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  img: {
    objectFit: "cover",
    height: 250,
    aspectRatio: 1,
  },
  title: {
    width: " 70%",
    fontSize: 20,
    textAlign: "left",
    paddingLeft: 10,
  },
  titleContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  progress: {
    backgroundColor: "#fe8301",
    width: "25%",
    textAlign: "center",
    paddingVertical: 5,
    paddingHorizontal: 0,
    borderRadius: 20,
    color: "white",
  },
  desc: {
    fontSize: 20,
  },
  iconsContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  reactions: {
    width: "30%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 5,
  },
});

export default Issue;

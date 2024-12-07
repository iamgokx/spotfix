import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import Blob1 from "../../assets/images/blobs/b1.svg";
import Blob2 from "../../assets/images/blobs/b2.svg";
const { width, height } = Dimensions.get("window");
import loginSignup from "../../assets/images/welcome/loginSignup.json";
import LottieView from "lottie-react-native";
const index = () => {
  const router = useRouter();

  const loginroute = () => {
    router.push("/auth");
  };

  const signuproute = () => {
    router.push("/auth/signup");
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <ImageBackground
        source={require("../../assets/images/gradients/orangegradient.png")}
        style={styles.backgroundImage}
        resizeMode="cover">
        {/* <Image
          source={require("../../assets/images/blobs/Group.svg")}
          style={styles.blob1}
        /> */}
        <Blob1 style={styles.blob1} />
        {/* <Image
          source={require("../../assets/images/welcome/welcome5.png")}
          style={[
            styles.welcomeImage,
            { width: width * 0.8, height: height * 0.4 },
          ]}
        /> */}
         <LottieView
            source={loginSignup}
            autoPlay
            loop
            style={[styles.image, { width: width * 0.8, height: height * 0.4 }]}
          />
       
        <Blob2 style={styles.blob2} />
        <TouchableOpacity onPress={loginroute}>
          <Text style={styles.loginBtn}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={signuproute}>
          <Text style={styles.signupBtn}>Sign Up</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  blob1: {
    position: "absolute",
    top: 0,
    left: 0,

    width: "100%",
  },
  blob2: {
    position: "absolute",
    bottom: -30,
    right: 0,
    width: "100%",
  },
  welcomeImage: {
    position: "relative",
  },
  loginBtn: {
    width: (width * 1) / 2,
    paddingVertical: 15,
    paddingHorizontal: 39,
    fontSize: 20,
    textAlign: "center",
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 60,
    elevation: 20,
    fontWeight: "900",
    backgroundColor: "white",
    color: "black",
  },
  signupBtn: {
    width: (width * 1) / 2,
    paddingVertical: 15,
    paddingHorizontal: 39,
    fontSize: 20,
    textAlign: "center",
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 60,
    elevation: 20,
    fontWeight: "900",
    backgroundColor: "orange",
    color: "white",
  },
});

export default index;

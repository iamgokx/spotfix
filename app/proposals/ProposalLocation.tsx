import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  StatusBar,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useProposalContext } from "@/context/ProposalContext";
import { Ionicons } from "@expo/vector-icons";

import LottieView from "lottie-react-native";
import deopPinOnMap from "../../assets/images/issues/selectLocationOnMap.json";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
const ProposalLocation = () => {
  const { details, setDetails } = useProposalContext();
  const router = useRouter();
  const colorTheme = useColorScheme();
  const currentColors = colorTheme == "dark" ? Colors.dark : Colors.light;
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentColors.backgroundDarker },
      ]}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.headerContainer}>
        <ImageBackground
          resizeMode="cover"
          source={require("../../assets/images/blobs/b8.png")}
          style={styles.imgBack}>
          <Text style={styles.title}>Create your Proposal</Text>
          <Text style={styles.subTitle}>
            Fill in the location details
          </Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressBarOne}></Text>
            <Text style={styles.progressBarTwo}></Text>
            <Text style={styles.progressBarThree}></Text>
            <Text style={styles.progressBarFour}></Text>
          </View>
        </ImageBackground>
      </View>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.dataContainer}>
          {!details.generatedAddress && (
            <TouchableOpacity
              onPress={() => router.push("/proposals/Map")}
              style={styles.mapContainer}>
              <Text className="text-white text-xl" style={styles.mapText}>
                Drop Pin On Map
              </Text>
              <Ionicons
                name="location"
                color="orange"
                size={32}
                style={{ marginRight: 10 }}></Ionicons>
            </TouchableOpacity>
          )}

          {!details.generatedAddress && (
            <View style={styles.imgContainer}>
              <LottieView
                source={deopPinOnMap}
                autoPlay
                loop
                style={{ width: 250, height: 250 }}
              />
            </View>
          )}

          {details.generatedAddress != "" && (
            <View style={styles.subContainer}>
              <Text style={[styles.inputTitles, { color: currentColors.text }]}>
                Location Details
              </Text>
              <TextInput
                style={[
                  styles.dataInput,
                  {
                    backgroundColor: currentColors.inputField,
                    color: currentColors.text,
                  },
                ]}
                multiline={true}
                editable={details.generatedAddress == undefined ? true : false}
                value={details.generatedAddress}
                onChangeText={(text) => {
                  setDetails((prev) => ({ ...prev, generatedAddress: text }));
                }}
                placeholderTextColor={currentColors.textShade}
                placeholder="Enter Address"></TextInput>
              <TextInput
                style={[
                  styles.dataInput,
                  {
                    backgroundColor: currentColors.inputField,
                    color: currentColors.text,
                  },
                ]}
                editable={details.generatedCity == undefined ? true : false}
                onChangeText={(text) => {
                  setDetails((prev) => ({ ...prev, generatedCity: text }));
                }}
                value={details.generatedCity}
                placeholder="Enter City / Town"
                placeholderTextColor={currentColors.textShade}
                ></TextInput>
              <TextInput
               style={[
                styles.dataInput,
                {
                  backgroundColor: currentColors.inputField,
                  color: currentColors.text,
                },
              ]}
                editable={details.generatedPincode == undefined ? true : false}
                onChangeText={(text) => {
                  setDetails((prev) => ({ ...prev, generatedPincode: text }));
                }}
                value={details.generatedPincode}
                placeholder="Enter Pincode"
                placeholderTextColor={currentColors.textShade}
                
                ></TextInput>
              <TextInput
                style={[
                  styles.dataInput,
                  {
                    backgroundColor: currentColors.inputField,
                    color: currentColors.text,
                  },
                ]}
                editable={details.generatedState == undefined ? true : false}
                value={details.generatedState}
                onChangeText={(text) => {
                  setDetails((prev) => ({ ...prev, generatedState: text }));
                }}
                placeholder="Enter State"
                placeholderTextColor={currentColors.textShade}
                
                ></TextInput>
            </View>
          )}

          <View style={styles.btnMainContainer}>
            <TouchableOpacity
              style={[styles.backBtnContainer,{borderColor: currentColors.secondary,}]}
              onPress={() => router.push("/proposals")}>
              <Text style={[styles.backButton,{color: currentColors.secondary}]}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnContainer,{ backgroundColor: currentColors.secondary },]}
              onPress={() => router.push("/proposals/ProposalMedia")}>
              <Text style={styles.nextButton}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "rgb(230, 240, 255)",
  },
  backBtn: {
    position: "absolute",
    top: "15%",
    left: "2%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    borderRadius: 30,
    padding: 5,
  },
  headerContainer: {
    width: "100%",
    height: "25%",

    overflow: "hidden",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  imgBack: {
    width: "100%",
    height: "100%",
    objectFit: "contain",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  title: {
    color: "white",
    textAlign: "center",
    fontSize: 24,
    fontWeight: 600,
  },
  subTitle: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
  },
  progressContainer: {
    width: "80%",

    display: "flex",
    flexDirection: "row",
    justifyContent: "center",

    alignItems: "center",
  },
  progressBarOne: {
    backgroundColor: "#0066ff",
    width: "20%",
    height: "30%",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  progressBarTwo: {
    backgroundColor: "#0066ff",
    width: "20%",
    height: "30%",
  },
  progressBarThree: {
    backgroundColor: "white",
    width: "20%",
    height: "30%",

  },
  progressBarFour: {
    backgroundColor: "white",
    width: "20%",
    height: "30%",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  dataContainer: {
    width: "100%",
    height: "65%",
    padding: 29,

    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  subContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  mapContainer: {
    width: "100%",

    backgroundColor: "rgb(0, 102, 255)",
    borderRadius: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    padding: 10,
    gap: 10,
  },
  imgContainer: {
    width: "100%",
    height: "50%",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  mapIllustration: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  mapText: {
    fontWeight: 600,
  },
  inputTitles: {
    fontSize: 15,
    width: " 100%",
    marginBottom: 10,
  },
  dataInput: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 14,
    padding: 10,
  },
  cityTown: {
    width: "100%",

    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 14,
    textAlignVertical: "top",
    padding: 10,
  },
  street: {
    width: "100%",

    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 14,
    textAlignVertical: "top",
    padding: 10,
  },
  btnContainer: {
    backgroundColor: "rgb(0, 102, 255)",
    fontSize: 20,
    color: "white",
    width: "40%",

    paddingVertical: 10,
    borderRadius: 30,
    fontWeight: 900,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  backBtnContainer: {
    backgroundColor: "white",
    fontSize: 20,
    color: "white",
    width: "40%",

    paddingVertical: 10,
    borderRadius: 30,
    fontWeight: 900,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    borderColor: "blue",
    borderWidth: 1,
  },
  btnMainContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  nextButton: {
    color: "white",
    fontSize: 20,
  },
  backButton: {
    color: "#0066ff",
    fontSize: 20,
  },
});
export default ProposalLocation;
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
import { useIssueContext } from "@/context/IssueContext";
import { Ionicons } from "@expo/vector-icons";
import mapImg from "../../assets/images/issues/map.png";
const IssueLocation = ({
  goToTitleScreen,
  goToMapScreen,
  goToMediaScreen,
}: any) => {
  const { details, setDetails } = useIssueContext();
  const router = useRouter();
  return (
    <View style={styles.container}>
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
          <Text style={styles.title}>Create your report</Text>
          <Text style={styles.subTitle}>
            Fill in with the details to get your report registered
          </Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressBarOne}></Text>
            <Text style={styles.progressBarTwo}></Text>
            <Text style={styles.progressBarThree}></Text>
          </View>
        </ImageBackground>
      </View>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.dataContainer}>
          <TouchableOpacity onPress={goToMapScreen} style={styles.mapContainer}>
            <Text className="text-white text-xl" style={styles.mapText}>
              Drop Pin On Map
            </Text>
            <Ionicons
              name="location"
              color="orange"
              size={32}
              style={{ marginRight: 10 }}></Ionicons>
          </TouchableOpacity>

          {!details.generatedAddress && (
            <View style={styles.imgContainer}>
              <Image style={styles.mapIllustration} source={mapImg} />
            </View>
          )}

          {details.generatedAddress != "" && (
            <View style={styles.subContainer}>
              <Text style={styles.inputTitles}>Location Details</Text>
              <TextInput
                style={styles.dataInput}
                multiline={true}
                editable={false}
                value={details.generatedAddress}
                placeholder="Address"></TextInput>
              <TextInput
                style={styles.cityTown}
                editable={false}
                value={details.generatedCity}
                placeholder="City / Town"></TextInput>
              <TextInput
                style={styles.street}
                editable={false}
                value={details.generatedPincode}
                placeholder="Pincode"></TextInput>
              <TextInput
                style={styles.street}
                editable={false}
                value={details.generatedState}
                placeholder="State"></TextInput>
            </View>
          )}

          <View style={styles.btnMainContainer}>
            <TouchableOpacity
              style={styles.backBtnContainer}
              onPress={goToTitleScreen}>
              <Text style={styles.backButton}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={(goToMediaScreen)}>
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
    width: "70%",

    display: "flex",
    flexDirection: "row",
    justifyContent: "center",

    alignItems: "center",
  },
  progressBarOne: {
    backgroundColor: "#0066ff",
    width: "33%",
    height: "30%",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  progressBarTwo: {
    backgroundColor: "#0066ff",
    width: "33%",
    height: "30%",
  },
  progressBarThree: {
    backgroundColor: "white",
    width: "33%",
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
export default IssueLocation;

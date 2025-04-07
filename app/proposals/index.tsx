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
  Modal,
  FlatList,
  Switch,
} from "react-native";
import { ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { Calendar } from "react-native-calendars";
import { useProposalContext } from "@/context/ProposalContext";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import * as Animatable from "react-native-animatable";
const index = () => {
  const router = useRouter();

  const { details, setDetails, clearDetails } = useProposalContext();

  const colorTheme = useColorScheme();
  const currentColors = colorTheme == "dark" ? Colors.dark : Colors.light;

  const handleClearButtonPress = () => {
    router.push("/home/reportIssue");
  };
  const [errors, setErrors] = useState({});
  const safeDetails = details || {};
  const validate = () => {
    let valid = true;
    let newErrors = {};

    if (!safeDetails.title || safeDetails.title.trim() === "") {
      newErrors.title = "Please enter title";
      valid = false;
    } else if (/^\d+$/.test(safeDetails.title)) {
      newErrors.title = "Title cannot contain only numbers";
      valid = false;
    } else if (safeDetails.title.length < 20) {
      newErrors.title = "Title should be at least 20 characters long";
      valid = false;
    } else if (safeDetails.title.length >= 100) {
      newErrors.title = "Title should be at most 100 characters long";
      valid = false;
    }

    if (!safeDetails.description || safeDetails.description.trim() === "") {
      newErrors.description = "Please enter description";
      valid = false;
    } else if (/^\d+$/.test(safeDetails.description)) {
      newErrors.description = "Description cannot contain only numbers";
      valid = false;
    } else if (safeDetails.description.length < 50) {
      newErrors.description =
        "Description should be at least 50 characters long";
        valid = false
    }

    setErrors(newErrors);
    return valid;
  };

  const handleNextButtonPress = () => {
    if (validate()) {
      console.log(details);
      router.push("/proposals/ProposalLocation");
    } else {
      console.log("enter all details");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: currentColors.backgroundDarker },
      ]}
      scrollEnabled={true}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor="transparent"
        translucent
      />
      <Animatable.View animation="fadeInDown" style={styles.headerContainer}>
        <ImageBackground
          resizeMode="cover"
          source={require("../../assets/images/blobs/b8.png")}
          style={styles.imgBack}>
          <Text style={styles.title}>Submit Your Idea</Text>
          <Text style={styles.subTitle}>
            Fill in the details to make your proposal
          </Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressBarOne}></Text>
            <Text style={styles.progressBarTwo}></Text>
            <Text style={styles.progressBarThree}></Text>
            <Text style={styles.progressBarThree}></Text>
          </View>
        </ImageBackground>
      </Animatable.View>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Animatable.View animation="fadeInUp" style={styles.dataContainer}>
          <View style={styles.subContainer}>
            <Text style={[styles.inputTitles, { color: currentColors.text }]}>
              Proposal Title
            </Text>
            <TextInput
              style={[
                styles.dataInput,
                {
                  backgroundColor: currentColors.inputField,
                  color: currentColors.text,
                },
              ]}
              value={details.title}
              onChangeText={(text) =>
                setDetails((prev) => ({ ...prev, title: text }))
              }
              placeholder="eg. Underground Power Cabling (mimimum 20 characters)"
              placeholderTextColor={currentColors.textShade}></TextInput>
            {errors.title && (
              <Text style={{ color: "red", textAlign: "center" }}>
                {errors.title}
              </Text>
            )}
          </View>
          <View style={styles.subContainer}>
            <Text style={[styles.inputTitles, { color: currentColors.text }]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  minHeight: 100,
                  backgroundColor: currentColors.inputField,
                  color: currentColors.text,
                },
              ]}
              multiline={true}
              value={details.description}
              onChangeText={(text) =>
                setDetails((prev) => ({ ...prev, description: text }))
              }
              placeholder="Describe your proposal here (mimimum 50 characters)"
              placeholderTextColor={currentColors.textShade}></TextInput>
            {errors.description && (
              <Text style={{ color: "red", textAlign: "center" }}>
                {errors.description}
              </Text>
            )}
          </View>

          <View style={styles.btnMainContainer}>
            <TouchableOpacity
              style={[
                styles.backBtnContainer,
                {
                  borderColor: currentColors.secondary,
                },
              ]}
              onPress={() => handleClearButtonPress()}>
              <Text
                style={[styles.backButton, { color: currentColors.secondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btnContainer,
                { backgroundColor: currentColors.secondary },
              ]}
              onPress={handleNextButtonPress}>
              <Text style={styles.nextButton}>Next</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </TouchableWithoutFeedback>
      <View style={{ width: "100%", height: 500 }}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
    // backgroundColor: "rgb(230, 240, 255)",
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
    backgroundColor: "white",
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
    gap: 10,
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
  mapText: {
    fontWeight: 600,
  },
  inputTitles: {
    fontSize: 15,
    width: " 100%",
    marginBottom: 10,
  },
  textInput: {
    height: "auto",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 14,
    padding: 10,
    textAlignVertical: "top",
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

  dropdownButton: {
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,

    alignItems: "center",
    justifyContent: "center",
  },
  dropdownText: {
    width: "100%",
    fontSize: 16,
    color: "#333",
    textAlign: "left",
  },
  modalOverlay: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    maxHeight: 500,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default index;

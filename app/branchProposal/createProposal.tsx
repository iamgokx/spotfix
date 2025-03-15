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

import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import * as Animatable from "react-native-animatable";
import { useGovProposalContext } from "@/context/govProposalContext";
import { endOfYear } from "date-fns";
const createProposal = () => {
  const router = useRouter();
  const { details, setDetails, clearDetails } = useGovProposalContext();
  const colorTheme = useColorScheme();
  const currentColors = colorTheme == "dark" ? Colors.dark : Colors.light;
  const [startDate, setStartDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setselectedMonth] = useState("January");
  const [selectEndYear, setSelectEndYear] = useState("2025");
  const [selectedEndMonth, setselectedEndMonth] = useState("January");

  const handleClearButtonPress = () => {
    clearDetails();
    router.back();
  };

  const [errors, setErrors] = useState({});
  const addedDetails = details || {};
  const validateAnnouncement = () => {
    let valid = true;
    let newErrors = {};

    if (!addedDetails.title || addedDetails.title.trim() === "") {
      newErrors.title = "Please enter title";
      valid = false;
    } else if (/^\d+$/.test(addedDetails.title)) {
      newErrors.title = "Title cannot contain only numbers";
      valid = false;
    } else if (addedDetails.title.length < 20) {
      newErrors.title = "Title should be at least 20 characters long";
    } else if (addedDetails.title.length >= 100) {
      newErrors.title = "Title should be at most 100 characters long";
    }

    if (!addedDetails.description || addedDetails.description.trim() === "") {
      newErrors.description = "Please enter description";
      valid = false;
    } else if (/^\d+$/.test(addedDetails.description)) {
      newErrors.description = "Title cannot contain only numbers";
      valid = false;
    } else if (addedDetails.description.length < 50) {
      newErrors.description = "Description should be atleast 50 characters long";
      valid =false
    }

    if (!addedDetails.budget || addedDetails.budget < 1000) {
      newErrors.budget =
        "Budget cannot ideally be below RS. 1000 for a Project ";
      valid = false;
    }

    const startYear = parseInt(selectedYear);
    const endYear = parseInt(selectEndYear);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const startMonthIndex = months.indexOf(selectedMonth);
    const endMonthIndex = months.indexOf(selectedEndMonth);

    if (startYear < 2025) {
      newErrors.startYear = "Start year cannot be before 2025";
      valid = false;
    }

    if (endYear < startYear) {
      newErrors.endYear = "End year cannot be before start year";
      valid = false;
    } else if (endYear === startYear && endMonthIndex <= startMonthIndex) {
      newErrors.endMonth =
        "End month should be after start month in the same year";
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  const getFormattedDuration = (startYear, startMonth, endYear, endMonth) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const startMonthIndex = months.indexOf(startMonth);
    const endMonthIndex = months.indexOf(endMonth);

    if (startMonthIndex === -1 || endMonthIndex === -1) {
      throw new Error("Invalid month name provided.");
    }

    const startDate = new Date(startYear, startMonthIndex, 1);
    const endDate = new Date(endYear, endMonthIndex, 1);

    if (endDate < startDate) {
      throw new Error("End date cannot be before start date.");
    }

    let totalMonths =
      (endYear - startYear) * 12 + (endMonthIndex - startMonthIndex);

    let years = Math.floor(totalMonths / 12);
    let monthsLeft = totalMonths % 12;

    let result = [];
    if (years > 0) {
      result.push(`${years} year${years > 1 ? "s" : ""}`);
    }
    if (monthsLeft > 0) {
      result.push(`${monthsLeft} month${monthsLeft > 1 ? "s" : ""}`);
    }

    return result.join(", ") || "0 months";
  };

  const updateEstimateTime = (newTime: string) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      estimateTime: newTime,
    }));
  };

  const handleNextBtnPress = () => {
    if (validateAnnouncement()) {
      const time = getFormattedDuration(
        selectedYear,
        selectedMonth,
        selectEndYear,
        selectedEndMonth
      );
      console.log(time);
      updateEstimateTime(time);
      console.log(details);
      router.push("/branchProposal/locationDetailsProposal");
    } else {
      console.log("add all fields ");
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
          source={require("../../assets/images/gradients/orangegradient.png")}
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
              placeholder="eg. Underground Power Cabling"
              placeholderTextColor={currentColors.textShade}></TextInput>
            {errors.title && (
              <Text
                style={{ color: "red", textAlign: "center", marginTop: 10 }}>
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
              placeholder="Describe your proposal here"
              placeholderTextColor={currentColors.textShade}></TextInput>
            {errors.description && (
              <Text
                style={{ color: "red", textAlign: "center", marginTop: 10 }}>
                {errors.description}
              </Text>
            )}
          </View>
          <View style={styles.subContainer}>
            <Text style={[styles.inputTitles, { color: currentColors.text }]}>
              Budget
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: currentColors.inputField,
                  color: currentColors.text,
                },
              ]}
              multiline={true}
              value={details.budget ? details.budget.toString() : ""}
              onChangeText={(num) =>
                setDetails((prev) => ({ ...prev, budget: parseFloat(num) || 0 }))
              }
              keyboardType="numeric"
              placeholder="Enter budget"
              placeholderTextColor={currentColors.textShade}></TextInput>
            {errors.budget && (
              <Text
                style={{ color: "red", textAlign: "center", marginTop: 10 }}>
                {errors.budget}
              </Text>
            )}
          </View>

          <View style={styles.subContainer}>
            <Text style={[styles.inputTitles, { color: currentColors.text }]}>
              Select Start Date
            </Text>

            <View
              style={{ borderRadius: 30, width: "100%", overflow: "hidden" }}>
              <Picker
                style={{
                  width: "100%",
                  backgroundColor: currentColors.background,
                  borderRadius: 30,
                  color: currentColors.text,
                }}
                selectedValue={selectedYear}
                onValueChange={(itemValue) => setSelectedYear(itemValue)}>
                {[...Array(50)].map((_, i) => {
                  const year = 2025 + i;
                  return (
                    <Picker.Item
                      key={year}
                      label={`${year}`}
                      value={`${year}`}
                    />
                  );
                })}
              </Picker>
            </View>
            <View
              style={{ borderRadius: 30, width: "100%", overflow: "hidden" }}>
              <Picker
                style={{
                  width: "100%",
                  backgroundColor: currentColors.background,
                  borderRadius: 30,
                  color: currentColors.text,
                }}
                selectedValue={selectedMonth}
                onValueChange={(itemValue) => setselectedMonth(itemValue)}>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month, index) => (
                  <Picker.Item key={index} label={month} value={month} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.subContainer}>
            <Text style={[styles.inputTitles, { color: currentColors.text }]}>
              Select End Date
            </Text>

            <View
              style={{ borderRadius: 30, width: "100%", overflow: "hidden" }}>
              <Picker
                style={{
                  width: "100%",
                  backgroundColor: currentColors.background,
                  borderRadius: 30,
                  color: currentColors.text,
                }}
                selectedValue={selectEndYear}
                onValueChange={(itemValue) => setSelectEndYear(itemValue)}>
                {[...Array(50)].map((_, i) => {
                  const year = 2025 + i;
                  return (
                    <Picker.Item
                      key={year}
                      label={`${year}`}
                      value={`${year}`}
                    />
                  );
                })}
              </Picker>
            </View>

            <View
              style={{ borderRadius: 30, width: "100%", overflow: "hidden" }}>
              <Picker
                style={{
                  width: "100%",
                  backgroundColor: currentColors.background,
                  borderRadius: 30,
                  color: currentColors.text,
                }}
                selectedValue={selectedEndMonth}
                onValueChange={(itemValue) => setselectedEndMonth(itemValue)}>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month, index) => (
                  <Picker.Item key={index} label={month} value={month} />
                ))}
              </Picker>
            </View>
          </View>

          {errors.endYear && (
            <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
              {errors.endYear}
            </Text>
          )}
          {errors.endMonth && (
            <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
              {errors.endMonth}
            </Text>
          )}

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
              onPress={handleNextBtnPress}>
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
  picker: {
    backgroundColor: "#333",
    color: "white",
  },
  container: {
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
  },
  headerContainer: {
    width: "100%",
    height: 300,

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
    backgroundColor: "black",
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
    gap: 30,
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

export default createProposal;

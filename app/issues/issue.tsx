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
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useIssueContext } from "@/context/IssueContext";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import * as Animatable from "react-native-animatable";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
const Issue = ({ goToAddressScreen }: any) => {
  const router = useRouter();
  const { details, setDetails, clearDetails } = useIssueContext();
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const [isEnabled, setIsEnabled] = useState(false);
  const [errors, setErrors] = useState({});
  const toggleSwitch = () => setDetails((previousState) => !previousState);

  // const departments = [
  //   "Public Works Department",
  //   "Electricity Department",
  //   "Municipal Administration",
  //   "Department of Water Resources",
  //   "Department of Health",
  //   "Department of Transport",
  //   "Department of Environment and Forests",
  //   "Department of Tourism",
  //   "Department of Rural Development",
  //   "Department of Agriculture",
  //   "Department of Social Welfare",
  // ];

  const [departmentData, setdepartmentData] = useState();

  const getDepartmentList = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/department/getDepartments`
      );

      if (response.data.status) {
        console.log(response.data.results);
        setdepartmentData(response.data.results);
      } else {
        console.log("no departments");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDepartmentList();
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userSelectedDep, setuserSelectedDep] = useState();

  function getDepartmentName(departmentId) {
    const department = departmentData.find(
      (dep) => dep.department_id === departmentId
    );
    return department ? department.department_name : "Department not found";
  }

  const handleSelect = (dep: string) => {
    const a = getDepartmentName(dep);
    console.log(a);
    setuserSelectedDep(a);
    setDetails((prev) => ({ ...prev, department: dep }));
    setIsModalVisible(false);
  };

  const handleClearButtonPress = () => {
    clearDetails();
    router.push("/home/reportIssue");
  };

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
    } else if (safeDetails.title.length <= 100) {
      newErrors.title = "Title should be at most 100 characters long";
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
    }

    if (!safeDetails.suggestions || safeDetails.suggestions.trim() === "") {
      newErrors.suggestions = "Please enter suggestions";
      valid = false;
    } else if (/^\d+$/.test(safeDetails.suggestions)) {
      newErrors.suggestions = "suggestions cannot contain only numbers";
      valid = false;
    } else if (safeDetails.suggestions.length < 50) {
      newErrors.suggestions =
        "Description should be at least 50 characters long";
    }

    if (!safeDetails.department) {
      newErrors.department = "Please select department";
    }

    setErrors(newErrors);
    return valid;
  };

  const handleNextButtonPress = () => {
    if (validate()) {
      console.log();
      console.log();
      console.log();
      console.log();
      console.log();
      console.log(details);
      router.push("/issues/issueLocation");
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
      <View style={styles.headerContainer}>
        <ImageBackground
          resizeMode="cover"
          source={require("../../assets/images/blobs/b8.png")}
          style={styles.imgBack}>
          <Animatable.Text animation="fadeInDown" style={styles.title}>
            Create your report
          </Animatable.Text>
          <Animatable.Text animation="fadeInDown" style={styles.subTitle}>
            Fill in with the details to get your report registered
          </Animatable.Text>
          <Animatable.View
            animation="fadeInDown"
            style={styles.progressContainer}>
            <Text style={styles.progressBarOne}></Text>
            <Text style={styles.progressBarTwo}></Text>
            <Text style={styles.progressBarThree}></Text>
          </Animatable.View>
        </ImageBackground>
      </View>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Animatable.View animation="fadeInUp" style={styles.dataContainer}>
          <ImageBackground
            source={require("../../assets/images/blobs/b8.png")}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#60b5ff",
              paddingVertical: 10,
              paddingHorizontal: 28,
              borderRadius: 40,
              overflow: "hidden",
            }}>
            <Text style={{ color: "white", fontWeight: 900 }}>
              Report Anonymously
            </Text>
            <Switch
              trackColor={{ false: "rgba(255,255,255,0.4)", true: "orange" }}
              thumbColor={details.anonymous ? "white" : "white"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() =>
                setDetails((prev) => ({ ...prev, anonymous: !prev.anonymous }))
              }
              value={details.anonymous}
            />
          </ImageBackground>
          <View style={styles.subContainer}>
            <Text style={[styles.inputTitles, { color: currentColors.text }]}>
              Report Title
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
              placeholderTextColor={currentColors.textShade}
              placeholder="eg. Broke Street Light"></TextInput>
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
                  backgroundColor: currentColors.inputField,
                  color: currentColors.text,
                },
              ]}
              multiline={true}
              value={details.description}
              onChangeText={(text) =>
                setDetails((prev) => ({ ...prev, description: text }))
              }
              placeholder="Briefly describe your issue"
              placeholderTextColor={currentColors.textShade}></TextInput>
            {errors.description && (
              <Text style={{ color: "red", textAlign: "center" }}>
                {errors.description}
              </Text>
            )}
          </View>
          <View style={styles.subContainer}>
            <Text style={[styles.inputTitles, { color: currentColors.text }]}>
              Suggestions
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
              value={details.suggestions}
              onChangeText={(text) =>
                setDetails((prev) => ({ ...prev, suggestions: text }))
              }
              placeholderTextColor={currentColors.textShade}
              placeholder="Tell us about your solutions and suggestions to fix this issue"></TextInput>
            {errors.suggestions && (
              <Text style={{ color: "red", textAlign: "center" }}>
                {errors.suggestions}
              </Text>
            )}
          </View>
          <View style={styles.subContainer}>
            <Text style={[styles.inputTitles, { color: currentColors.text }]}>
              Select Department
            </Text>
            <TouchableOpacity
              style={[
                styles.dropdownButton,
                { backgroundColor: currentColors.secondary },
              ]}
              onPress={() => setIsModalVisible(true)}>
              <Text style={[styles.dropdownText, { color: "white" }]}>
                {userSelectedDep || "Choose a department"}
              </Text>
            </TouchableOpacity>

            {errors.department && (
              <Text style={{ color: "red", textAlign: "center" }}>
                {errors.department}
              </Text>
            )}
          </View>
          {isModalVisible && (
            <Modal
              transparent={true}
              animationType="fade"
              visible={isModalVisible}>
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => setIsModalVisible(false)}>
                <View
                  style={[
                    styles.modalContent,
                    { backgroundColor: currentColors.background },
                  ]}>
                  <FlatList
                    data={departmentData}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.item}
                        onPress={() => handleSelect(item.department_id)}>
                        <Text
                          style={[
                            styles.itemText,
                            { color: currentColors.text },
                          ]}>
                          {item.department_name}
                        </Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          )}

          <View style={styles.btnMainContainer}>
            <TouchableOpacity
              style={[
                styles.backBtnContainer,
                { borderColor: currentColors.secondary },
              ]}
              onPress={() => handleClearButtonPress()}>
              <Text
                style={[styles.backButton, { color: currentColors.secondary }]}>
                Close
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
    backgroundColor: "rgb(230, 240, 255)",
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
    backgroundColor: "white",
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
    marginVertical: 20,
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
export default Issue;

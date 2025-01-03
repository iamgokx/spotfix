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
import { useIssueContext } from "@/context/IssueContext";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import * as Animatable from 'react-native-animatable'
const Issue = ({ goToAddressScreen }: any) => {
  const router = useRouter();
  const { details, setDetails, clearDetails } = useIssueContext();
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setDetails((previousState) => !previousState);

  const departments = [
    "Public Works Department",
    "Electricity Department",
    "Municipal Administration",
    "Department of Water Resources",
    "Department of Health",
    "Department of Transport",
    "Department of Environment and Forests",
    "Department of Tourism",
    "Department of Rural Development",
    "Department of Agriculture",
    "Department of Social Welfare",
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelect = (dep: string) => {
    setDetails((prev) => ({ ...prev, department: dep }));
    setIsModalVisible(false);
  };

  const handleClearButtonPress = () => {
    clearDetails();
    router.push("/home/reportIssue");
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
          <Animatable.Text animation='fadeInDown' style={styles.title}>Create your report</Animatable.Text>
          <Animatable.Text animation='fadeInDown' style={styles.subTitle}>
            Fill in with the details to get your report registered
          </Animatable.Text>
          <Animatable.View animation='fadeInDown' style={styles.progressContainer}>
            <Text style={styles.progressBarOne}></Text>
            <Text style={styles.progressBarTwo}></Text>
            <Text style={styles.progressBarThree}></Text>
          </Animatable.View>
        </ImageBackground>
      </View>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Animatable.View animation='fadeInUp' style={styles.dataContainer}>
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
                { backgroundColor: currentColors.inputField,color:currentColors.text },
              ]}
              value={details.title}
              onChangeText={(text) =>
                setDetails((prev) => ({ ...prev, title: text }))
              }
              placeholderTextColor={currentColors.textShade}
              placeholder="eg. Broke Street Light"></TextInput>
          </View>
          <View style={styles.subContainer}>
            <Text style={[styles.inputTitles, { color: currentColors.text }]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { backgroundColor: currentColors.inputField,color:currentColors.text },
              ]}
              multiline={true}
              value={details.description}
              onChangeText={(text) =>
                setDetails((prev) => ({ ...prev, description: text }))
              }
              placeholder="Briefly describe your issue"
              placeholderTextColor={currentColors.textShade}></TextInput>
          </View>
          <View style={styles.subContainer}>
            <Text style={[styles.inputTitles, { color: currentColors.text }]}>
              Suggestions
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { backgroundColor: currentColors.inputField,color:currentColors.text },
              ]}
              multiline={true}
              value={details.suggestions}
              onChangeText={(text) =>
                setDetails((prev) => ({ ...prev, suggestions: text }))
              }
              placeholderTextColor={currentColors.textShade}
              placeholder="Tell us about your solutions and suggestions to fix this issue"></TextInput>
          </View>
          <View style={styles.subContainer}>
            <Text style={[styles.inputTitles, {color : currentColors.text}]}>Select Department</Text>
            <TouchableOpacity
              style={[styles.dropdownButton, {backgroundColor : currentColors.secondary}]}
              onPress={() => setIsModalVisible(true)}>
              <Text style={[styles.dropdownText, {color : 'white'}]}>
                {details.department || "Choose a department"}
              </Text>
            </TouchableOpacity>
          </View>
          {isModalVisible && (
            <Modal
              transparent={true}
              animationType="fade"
              visible={isModalVisible}>
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => setIsModalVisible(false)}>
                <View style={[styles.modalContent,{backgroundColor : currentColors.background}]}>
                  <FlatList
                    data={departments}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.item}
                        onPress={() => handleSelect(item)}>
                        <Text style={[styles.itemText, {color : currentColors.text}]}>{item}</Text>
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
              style={[styles.backBtnContainer, {borderColor : currentColors.secondary}]}
              onPress={() => handleClearButtonPress()}>
              <Text style={[styles.backButton,{color : currentColors.secondary}]}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnContainer, {backgroundColor : currentColors.secondary}]}
              onPress={() => router.push("/issues/issueLocation")}>
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
export default Issue;

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import * as Animatable from "react-native-animatable";
import { useState } from "react";
import { useRouter } from "expo-router";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { getStoredData } from "@/hooks/useJwt";

// TODO need to add minimum 1 img and file for all the components while submitting anything
// TODO need to handle location outside state of goa
import { useAnnouncementContext } from "@/context/AnnouncementContext";
import { openBrowserAsync } from "expo-web-browser";
const Description = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const { details, setDetails } = useAnnouncementContext();

  //handle submit announcment function

  const handleSubmitAnnouncement = async () => {
    const user = await getStoredData();
    console.log(details);
    try {
      const formData = new FormData();

      formData.append("title", details.title);
      formData.append("generatedAddress", details.generatedAddress);
      formData.append("generatedCity", details.generatedCity);
      formData.append("generatedPincode", details.generatedPincode);
      formData.append("generatedLocality", details.generatedLocality);
      formData.append("generatedState", details.generatedState);
      formData.append("latitude", details.latitude);
      formData.append("longitude", details.longitude);
      formData.append("announcementType", details.announcementType);

      details.media.forEach((media, index) => {
        if (media && media.uri) {
          formData.append("media", {
            uri: media.uri.startsWith("file://")
              ? media.uri
              : `file://${media.uri}`,
            type: "image/jpeg",
            name: "gov-proposal.jpg",
          });
        }
      });

      details.documents.forEach((doc, index) => {
        formData.append(`documents`, {
          uri: doc.uri.startsWith("file://") ? doc.uri : `file://${doc.uri}`,
          type: doc.type,
          name: doc.name || `gov-document${index + 1}`,
        });
      });
      console.log("FormData:", formData);

      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/branchCoordinator/newAnnouncement`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    } catch (error) {
      console.log("Error", error);
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
          source={require("../../assets/images/gradients/orangegradient.png")}
          style={styles.imgBack}>
          <Animatable.Text animation="fadeInDown" style={styles.title}>
            Create Announcement
          </Animatable.Text>
          <Animatable.Text animation="fadeInDown" style={styles.subTitle}>
            Fill in the details below to make your announcement.
          </Animatable.Text>
          <Animatable.View
            animation="fadeInDown"
            style={styles.progressContainer}>
            <Text style={styles.progressBarOne}></Text>
            <Text style={styles.progressBarTwo}></Text>
          </Animatable.View>
        </ImageBackground>
      </View>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        style={{ flex: 1 }}>
        <Animatable.View animation="fadeInUp" style={styles.dataContainer}>
          <View style={styles.subContainer}>
            <Text style={[styles.inputTitles, { color: currentColors.text }]}>
              Announcement Description
            </Text>
            <TextInput
              multiline={true}
              numberOfLines={512}
              textAlignVertical="top"
              style={[
                styles.dataInput,
                {
                  backgroundColor: currentColors.inputField,
                  color: currentColors.text,
                },
              ]}
              value={details.description}
              onChangeText={(text) =>
                setDetails((prev) => ({ ...prev, description: text }))
              }
              placeholderTextColor={currentColors.textShade}
              placeholder="Brief description about your announcement"></TextInput>
          </View>
          <View style={styles.subContainer}>
            <Text style={[styles.inputTitles, { color: currentColors.text }]}>
              Announcement Type
            </Text>
            <View
              style={[
                styles.pickerContainer,
                { backgroundColor: currentColors.inputField },
              ]}>
              <Picker
                selectedValue={details.announcementType}
                onValueChange={(itemValue) =>
                  setDetails((prev) => ({
                    ...prev,
                    announcementType: itemValue,
                  }))
                }
                dropdownIconColor="white"
                style={{ color: currentColors.text }}>
                <Picker.Item label="General" value="general" />
                <Picker.Item label="Emergency" value="emergency" />
                <Picker.Item label="Reports" value="reports" />
                <Picker.Item label="Custom" value="custom" />
              </Picker>
            </View>
          </View>

          <View style={styles.btnMainContainer}>
            <TouchableOpacity
              style={[
                styles.backBtnContainer,
                { borderColor: currentColors.secondary },
              ]}
              onPress={() => router.back()}>
              <Text
                style={[styles.backButton, { color: currentColors.secondary }]}>
                Back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btnContainer,
                { backgroundColor: currentColors.secondary },
              ]}
              onPress={handleSubmitAnnouncement}>
              <Text style={styles.nextButton}>Next</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};
export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  imgBack: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginTop: 5,
  },
  progressContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBarOne: {
    width: 30,
    height: 5,
    backgroundColor: "black",
    borderRadius: 10,
    marginHorizontal: 3,
  },
  progressBarTwo: {
    width: 30,
    height: 5,
    backgroundColor: "black",
    borderRadius: 10,
    marginHorizontal: 3,
  },
  pickerContainer: {
    borderRadius: 20,
  },
  dataContainer: {
    flex: 1,
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    gap: 20,
  },
  subContainer: {
    marginBottom: 15,
  },
  inputTitles: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  dataInput: {
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    minHeight: 100,
  },
  btnMainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  backBtnContainer: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 50,
    alignItems: "center",
    marginRight: 10,
  },
  backButton: {
    fontSize: 16,
    fontWeight: "600",
  },
  btnContainer: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: "center",
  },
  nextButton: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default Description;

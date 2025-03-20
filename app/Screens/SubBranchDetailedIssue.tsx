import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Keyboard,
  Platform,
  Linking,
  Modal,
  Button,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useLocalSearchParams } from "expo-router";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import axios from "axios";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import Swiper from "react-native-swiper";
import LottieView from "lottie-react-native";
import lazyLoading from "../../assets/images/welcome/loading.json";
import hero from "../../assets/images/hero.jpg";
import { TextInput } from "react-native";
import { format } from "date-fns";
import { BlurView } from "expo-blur";
import lazyLoading2 from "../../assets/images/issues/lazyLoading2.json";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { getStoredData } from "@/hooks/useJwt";
import SuggestionsList from "@/components/SuggestionsList";
import socket from "@/hooks/useSocket";
import { Picker } from "@react-native-picker/picker";
import { Calendar } from "react-native-calendars";
import { openBrowserAsync } from "expo-web-browser";
import { withDecay } from "react-native-reanimated";
const SubBranchDetailedIssue = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { issue_id, suggestions } = useLocalSearchParams();
  const [issueDetails, setIssueDetails] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [geoCodedAddress, setGeoCodedAddress] = useState("");
  const [isAddressLoading, setIsAddressLoading] = useState(true);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState();
  const [selectedPriority, setSelectedPriority] = useState();
  const [isLoading, setisLoading] = useState(false);
  const [isVisible, setisVisible] = useState(false);
  const [selectedDepartment, setselectedDepartment] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [estimateCompleteTime, setEstimateCompleteTime] = useState(null);

  const handleDayPress = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = new Date(day.dateString);
    console.log("Selected Date:", selected);

    if (selected < today) {
      Alert.alert("Invalid Date", "You cannot select a past date.");
      setEstimateCompleteTime(null);
      return;
    }

    const formattedDate = `${day.dateString} 00:00:00`;
    console.log("Formatted Date:", formattedDate);

    setSelectedDate(day.dateString);
    setEstimateCompleteTime(formattedDate);
  };

  const updateEstimateTimeComplete = async () => {
    if (issueDetails.issue_status == "registered") {
      setresponseMessage(
        "Issue has to be approved before setting estimate complete time..."
      );
      setisVisible(true);
      return;
    }

    if (issueDetails.issue_status == "completed") {
      setresponseMessage(
        "Cannot set estimate complete time when issues is already completed..."
      );
      setisVisible(true);
      return;
    }
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/subBranchCoordinator/setEstimateTimeComplete`,
        {
          issueid: issueDetails.issue_id,
          date: estimateCompleteTime,
        }
      );

      if (response.data.status) {
        console.log("updated successfully estimate completion time ...");
        setresponseMessage(response.data.message);
        setisVisible(true);
        setSelectedDate(null);
        setEstimateCompleteTime(null);
      } else {
        setresponseMessage(response.data.message);
        setisVisible(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeSuggestions = () => {
    setIsSuggestionsOpen(false);
  };
  const getDateFormatted = (date: any) => {
    const formattedDate = format(new Date(date), "eeee d MMMM yyyy");
    return formattedDate;
  };

  const [deleteIssueReason, setDeleteIssueReason] = useState("");
  const [isDeleteModalActive, setIsDeleteModalActive] = useState(false);

  const [colors, setColors] = useState({
    background: "",
    color: "",
  });
  const getColorDetails = (status: any) => {
    switch (status) {
      case "registered": {
        setColors({ background: "rgb(203, 202, 202)", color: "black" });
        break;
      }
      case "approved": {
        setColors({ background: "rgb(195, 255, 193)", color: "orange" });
        break;
      }
      case "in process": {
        setColors({ background: "orange", color: "white" });
        break;
      }
      case "completed": {
        setColors({
          background: "rgb(196, 241, 255)",
          color: "rgb(0, 194, 255)",
        });
        break;
      }
      default: {
        setColors({
          background: "orange",
          color: "white",
        });
      }
    }
  };
  const [responseMessage, setresponseMessage] = useState("");
  const updateIssueStatusAndPriority = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/subBranchCoordinator/updateIssueStatusPriority`,
        {
          issueId: issue_id,
          status: selectedStatus ? selectedStatus : issueDetails?.issue_status,
          priority: selectedPriority ? selectedPriority : issueDetails.priority,
        }
      );

      if (response.data.status) {
        console.log(response.data.message);
        getIssueDetails();
        setresponseMessage(response.data.message);
        setisVisible(true);
      } else {
        console.log(response.data.message);
        setresponseMessage(response.data.message);
      }
    } catch (error) {
      alert("Something went wrong, please try again");
      console.log("this is the error", error);
    }
  };

  const getAddress = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${issueDetails.latitude}&lon=${issueDetails.longitude}&addressdetails=1`,
        {
          headers: {
            "User-Agent": "spotfix/1.0 (lekhwargokul84.com)",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      setGeoCodedAddress(data.display_name);
    } catch (error) {
      console.log("Error geocoding address: ", error);
    } finally {
      setIsAddressLoading(false);
    }
  };

  const getIssueDetails = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/issues/getDetailedIssue`,
        { issue_id }
      );
      if (response?.data) {
        setIssueDetails(response.data);
        console.log();
        console.log("********************");

        console.log(response.data);

        setIsDataLoaded(true);
        setselectedDepartment(response.data["department_id"]);
      }
    } catch (error) {
      console.error("Error fetching issue details:", error);
    }
  };

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
    setSelectedStatus(issueDetails?.issue_status);
    setSelectedPriority(issueDetails?.priority);
  }, [issueDetails]);

  useEffect(() => {
    getIssueDetails();
    getDepartmentList();
    if (suggestions) {
      setIsSuggestionsOpen(true);
    }
  }, [issue_id]);

  useEffect(() => {
    if (issueDetails && issueDetails.latitude && issueDetails.longitude) {
      getColorDetails(issueDetails.issue_status);
      getAddress();
    }
  }, [issueDetails]);

  if (!isDataLoaded || !issueDetails || isAddressLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: currentColors.background,
        }}>
        <StatusBar translucent hidden />
        <LottieView
          source={lazyLoading}
          style={{ width: 100, height: 100 }}
          autoPlay
          loop
        />
      </SafeAreaView>
    );
  }

  const mediaArray = issueDetails.media_files
    ? issueDetails.media_files.split(",")
    : [];

  const openSuggestionBox = () => {
    setIsSuggestionsOpen((prev) => !prev);
  };

  socket.on("newSuggestion", (data) => {
    console.log(data);
    getIssueDetails();
  });

  const handleMapAddressPress = () => {
    const url = `https://www.google.com/maps?q=${issueDetails.latitude},${
      issueDetails.longitude
    }&z=${20}`;
    Linking.openURL(url).catch((err) =>
      console.error("Error opening Google Maps:", err)
    );
  };

  const onClose = () => {
    setIsDeleteModalActive(false);
  };

  const handleDeleteIssuePress = async () => {
    try {
      setisLoading(true);
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/subBranchCoordinator/deleteIssue`,
        {
          issue_id: issueDetails.issue_id,
          citizen_aadhar: issueDetails.citizen_aadhar,
          reason: deleteIssueReason,
          title: issueDetails.title,
        }
      );

      if (response.data.status) {
        console.log("deleted issues successfully");
        setIsDeleteModalActive(false);
        router.back();
      } else {
        console.log("could not delete the issue");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateDepartmentId = async () => {
    try {
      setisLoading(true);
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/subBranchCoordinator/updateDepId`,
        {
          issue_id: issueDetails.issue_id,
          depId: selectedDepartment,
        }
      );

      if (response.data.status) {
        console.log(response.data.message);
        setresponseMessage(response.data.message);
        setisVisible(true);
      } else {
        console.log(response.data.message);
        setresponseMessage(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: currentColors.backgroundDarker,
      }}>
      <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)" />

      <Modal transparent visible={isVisible} animationType="slide">
        <View
          style={{
            flex: 1,

            alignItems: "center",
            justifyContent: "center",
          }}>
          <View
            style={{
              width: "90%",
              padding: 10,
              backgroundColor: currentColors.backgroundDarker,
              borderWidth: 1,
              borderColor: currentColors.textShade,
              borderRadius: 20,
              alignItems: "center",
              gap: 20,
            }}>
            <Text style={{ fontSize: 20, color: currentColors.secondary }}>
              Server Response
            </Text>
            <Text style={{ color: currentColors.text }}>{responseMessage}</Text>

            <TouchableOpacity
              onPress={() => {
                setisVisible(false);
                setresponseMessage("");
              }}>
              <Text
                style={{
                  paddingHorizontal: 30,
                  paddingVertical: 10,
                  backgroundColor: currentColors.secondary,
                  color: currentColors.text,
                  borderRadius: 500,
                  fontSize: 17,
                }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: 100,
        }}>
        <View style={[styles.header]}>
          <Ionicons
            name="chevron-back-outline"
            color={"white"}
            size={30}
            style={{
              position: "absolute",
              left: 10,
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: 5,
              borderRadius: 50,
            }}
            onPress={() => router.back()}
          />
        </View>

        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          activeDotColor="blue"
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}>
          {mediaArray.length > 0 ? (
            mediaArray.map((media, index) => (
              <Animatable.Image
                animation="fadeInDown"
                duration={700}
                key={index}
                style={styles.img}
                source={{
                  uri: `http://${API_IP_ADDRESS}:8000/uploads/issues/${media}`,
                }}
              />
            ))
          ) : (
            <View style={styles.noMediaContainer}>
              <Text style={styles.noMediaText}>No media available</Text>
            </View>
          )}
        </Swiper>

        <Animatable.Text
          animation={"fadeInUp"}
          style={{ color: currentColors.secondary, fontSize: 18 }}>
          Estimate Completion Date :{" "}
          <Text style={{ color: currentColors.text }}>
            {getDateFormatted(issueDetails.estimate_complete_time)}
          </Text>
        </Animatable.Text>

        {issueDetails.issue_status != "completed" && (
          <>
            <Animatable.View
              animation="fadeInUp"
              duration={500}
              style={{
                width: "90%",
                gap: 10,

                alignItems: "center",
                marginTop: 20,
              }}>
              <View
                style={{
                  width: "100%",

                  borderRadius: 30,
                  flexDirection: "row",
                  gap: 10,
                  justifyContent: "center",
                }}>
                <Animatable.View
                  animation={"fadeInUp"}
                  style={{
                    width: "44%",
                    backgroundColor: currentColors.background,
                    borderRadius: 500,
                  }}>
                  <Picker
                    selectedValue={selectedStatus}
                    onValueChange={(value) => {
                      setSelectedStatus(value);
                    }}
                    style={{ color: "white" }}>
                    <Picker.Item label="Registered" value="registered" />
                    <Picker.Item label="Approved" value="approved" />
                    <Picker.Item label="In Process" value="in process" />
                    <Picker.Item label="Completed" value="completed" />
                  </Picker>
                </Animatable.View>

                <Animatable.View
                  animation={"fadeInUp"}
                  style={{
                    width: "45%",
                    backgroundColor: currentColors.background,
                    borderRadius: 500,
                  }}>
                  <Picker
                    selectedValue={selectedPriority}
                    onValueChange={(value) => {
                      setSelectedPriority(value);
                    }}
                    style={{
                      color: "white",
                    }}>
                    <Picker.Item label="Low" value="low" />
                    <Picker.Item label="Moderate" value="moderate" />
                    <Picker.Item label="High" value="high" />
                  </Picker>
                </Animatable.View>
              </View>

              {(selectedPriority != issueDetails.priority ||
                selectedStatus != issueDetails.issue_status) && (
                <TouchableOpacity
                  onPress={updateIssueStatusAndPriority}
                  style={{
                    backgroundColor: currentColors.secondary,
                    padding: 10,
                    borderRadius: 30,
                    paddingHorizontal: 15,
                    width: "50%",
                  }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      justifyContent: "center",
                    }}>
                    <Ionicons name="checkmark" size={24} color={"white"} />
                    <Text style={{ color: "white", fontSize: 20 }}>Update</Text>
                  </View>
                </TouchableOpacity>
              )}
            </Animatable.View>

            <Animatable.View
              animation={"fadeInUp"}
              style={{ width: "100%", padding: 20, gap: 20, width: "90%" }}>
              <Text
                style={{
                  color: currentColors.text,
                  marginTop: 20,
                  textAlign: "center",
                  fontWeight: 900,
                  fontSize: 20,
                }}>
                Select Estimate Complete Date
              </Text>
              <Calendar
                onDayPress={handleDayPress}
                theme={{
                  calendarBackground: currentColors.background,
                  textSectionTitleColor: currentColors.secondary,
                  selectedDayBackgroundColor: currentColors.secondary,
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: currentColors.secondary,
                  dayTextColor: "#ffffff",
                  textDisabledColor: "#757575",
                  monthTextColor: "#00adb5",
                  arrowColor: "#ff5733",
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 14,
                }}
                style={{ borderRadius: 20 }}
                markedDates={{
                  [selectedDate]: {
                    selected: true,
                    customStyles: {
                      container: {
                        backgroundColor: currentColors.secondary,
                        borderRadius: 10,
                      },
                      text: {
                        color: "#ffffff",
                      },
                    },
                  },
                }}
                markingType={"custom"}
              />

              {estimateCompleteTime != null && (
                <TouchableOpacity onPress={updateEstimateTimeComplete}>
                  <Text
                    style={{
                      color: currentColors.text,
                      backgroundColor: currentColors.secondary,
                      textAlign: "center",
                      padding: 10,
                      borderRadius: 20,
                      fontSize: 20,
                    }}>
                    Set Date
                  </Text>
                </TouchableOpacity>
              )}
            </Animatable.View>

            <Animatable.View
              animation={"fadeInUp"}
              style={{ padding: 20, alignItems: "center", width: "100%" }}>
              <Text
                style={{
                  color: currentColors.text,
                  fontSize: 16,
                  fontWeight: 900,
                  textAlign: "center",
                }}>
                Incorrect department selected? Please choose the correct
                department to proceed.
              </Text>

              <View
                style={{
                  backgroundColor: currentColors.secondary,
                  marginVertical: 10,
                  borderRadius: 500,
                  overflow: "hidden",
                  width: "100%",
                }}>
                <Picker
                  selectedValue={selectedDepartment}
                  onValueChange={(value) => {
                    console.log(value);
                    setselectedDepartment(value);
                  }}
                  style={{ color: "white" }}>
                  {departmentData &&
                    departmentData.map((dep) => {
                      return (
                        <Picker.Item
                          key={dep.departmentId}
                          label={dep.department_name}
                          value={dep.department_id}
                        />
                      );
                    })}
                </Picker>
              </View>

              {selectedDepartment != issueDetails.department_id && (
                <TouchableOpacity
                  onPress={updateDepartmentId}
                  style={{
                    backgroundColor: currentColors.secondary,
                    padding: 10,
                    borderRadius: 30,
                    paddingHorizontal: 15,

                    alignItems: "center",
                  }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      justifyContent: "center",
                    }}>
                    <Ionicons name="checkmark" size={24} color={"white"} />
                    <Text style={{ color: "white", fontSize: 20 }}>Update</Text>
                  </View>
                </TouchableOpacity>
              )}
            </Animatable.View>
          </>
        )}

        <Animatable.View
          animation="fadeInUp"
          duration={500}
          style={[
            styles.issueCreatorContainer,
            { backgroundColor: currentColors.secondaryShade },
          ]}>
          {issueDetails.is_anonymous == 0 ? (
            <Image
              source={
                issueDetails.picture_name
                  ? {
                      uri: `http://${API_IP_ADDRESS}:8000/uploads/profile/${issueDetails.picture_name}`,
                    }
                  : require("../../assets/images/profile/defaultProfile.jpeg")
              }
              style={{ borderRadius: 50, width: 40, height: 40 }}
            />
          ) : (
            <Image
              source={require("../../assets/images/profile/defaultProfile.jpeg")}
              style={{ borderRadius: 50, width: 40, height: 40 }}
            />
          )}
          <View>
            <Text
              style={{
                fontSize: 20,
              }}>
              {issueDetails.is_anonymous == 0
                ? issueDetails.full_name
                : "Spotfix User"}
            </Text>
            <Text>{getDateFormatted(issueDetails.date_time_created)}</Text>
          </View>
          <Text
            style={{
              color: colors.color,
              backgroundColor: colors.background,
              position: "absolute",
              right: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
            }}>
            {issueDetails.issue_status}
          </Text>
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          duration={600}
          style={{
            width: "90%",

            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",

            flexDirection: "column",
            marginBottom: 20,
          }}>
          <Text style={[styles.desc, { color: currentColors.text }]}>
            <Text style={{ fontWeight: 900, color: currentColors.link }}>
              Description :{" "}
            </Text>
            {issueDetails.issue_description || "No description available"}
          </Text>
        </Animatable.View>
        <Animatable.View
          animation="fadeInUp"
          duration={700}
          style={{
            width: "90%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",

            flexDirection: "column",

            marginBottom: 20,
          }}>
          {/* <Text style={{ fontWeight: 900, fontSize: 17 }}>Suggestions</Text> */}
          <Text style={[styles.solution, { color: currentColors.text }]}>
            <Text style={{ fontWeight: 900, color: currentColors.link }}>
              Proposed Solution :{" "}
            </Text>
            {issueDetails.solution || "No solution available"}
          </Text>
        </Animatable.View>

        {geoCodedAddress ? (
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            style={{
              width: "90%",
              height: "auto",
              display: "flex",

              alignItems: "center",
              marginBottom: 20,
              flexDirection: "row",
              // backgroundColor: "rgba(0, 234, 255, 0.39)",
              overflow: "hidden",
              padding: 10,
              borderRadius: 20,
            }}>
            <Ionicons name="location" size={25} color={currentColors.link} />
            <Text
              onPress={handleMapAddressPress}
              style={{ color: currentColors.link, width: "90%" }}>
              {geoCodedAddress}
            </Text>
          </Animatable.View>
        ) : (
          <Text style={{ color: "#0066ff" }}>Loading address...</Text>
        )}

        <Animatable.View
          animation="fadeInUp"
          duration={400}
          style={[styles.iconsContainer]}>
          <View style={[styles.reactions, { width: "30%" }]}>
            <Ionicons
              style={styles.reactionsIcon}
              name="arrow-up-circle"
              size={24}
              color={currentColors.secondary}></Ionicons>
            <Text style={[{ fontSize: 15 }, { color: currentColors.link }]}>
              {issueDetails.upvote_count}
            </Text>
          </View>

          <View style={[styles.reactions, { width: "30%" }]}>
            <Ionicons
              style={styles.reactionsIcon}
              name="arrow-down-circle"
              size={24}
              color={currentColors.secondary}></Ionicons>
            <Text style={[{ fontSize: 15 }, { color: currentColors.link }]}>
              {issueDetails.downvote_count}
            </Text>
          </View>

          <View style={[styles.reactions, { width: "30%" }]}>
            <TouchableOpacity onPress={openSuggestionBox}>
              <Ionicons
                style={styles.reactionsIcon}
                name="chatbubbles"
                size={24}
                color={currentColors.secondary}></Ionicons>
              <Text style={[{ fontSize: 15 }, { color: currentColors.link }]}>
                {issueDetails.total_suggestions}
              </Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>

      {isSuggestionsOpen && (
        <SuggestionsList
          issue_id={issue_id}
          allowSuggestions={false}
          closeSuggestions={closeSuggestions}
        />
      )}

      <TouchableOpacity
        onPress={() => setIsDeleteModalActive(true)}
        style={{
          width: "100%",
          backgroundColor: "red",
          paddingBottom: insets.bottom + 10,
          padding: 10,
          alignItems: "center",
        }}>
        <Feather name="trash-2" size={24} color={"white"} />
        <Text style={{ color: "white" }}>Reject & Delete</Text>
      </TouchableOpacity>

      <Modal transparent visible={isDeleteModalActive} animationType="fade">
        <View style={styles.overlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: currentColors.backgroundSecondary },
            ]}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Delete Issue</Text>
            <Text style={styles.subtitle}>Enter the reason for deleting:</Text>

            <TextInput
              style={styles.input}
              placeholder="Type reason..."
              value={deleteIssueReason}
              onChangeText={(text) => setDeleteIssueReason(text)}
              multiline
            />

            {isLoading && <Text style={{ margin: 10 }}>deleting...</Text>}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.cancelButton,
                  { backgroundColor: currentColors.primary },
                ]}
                onPress={onClose}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleDeleteIssuePress}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    position: "absolute",
    top: 0,
    zIndex: 4,
    height: 100,
  },
  headerText: {
    color: "white",
    fontSize: 25,
  },
  dot: {
    backgroundColor: "gray",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "white",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  wrapper: {
    height: 350,
    marginBottom: 20,
  },
  img: {
    width: "100%",
    height: 350,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  container: {
    padding: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    flexDirection: "column",
  },
  desc: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    // backgroundColor: "#D4F6FF",
    padding: 20,
    borderRadius: 20,
    textAlign: "justify",
  },
  solution: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    // backgroundColor: "#D4F6FF",
    padding: 20,
    borderRadius: 20,
    textAlign: "justify",
  },
  noMediaContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 250,
  },
  noMediaText: {
    fontSize: 16,
    color: "#888",
  },
  issueCreatorContainer: {
    width: "90%",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(231, 238, 242, 0.6)",
    margin: 20,
    borderRadius: 20,
  },
  iconsContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    margin: 20,
  },
  reactions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    // backgroundColor: "rgba(182, 231, 255, 0.8)",
    borderRadius: 20,
    padding: 15,
    paddingVertical: 1,
  },
  overlay: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 10,
  },
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 10,
    color: "gray",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    minHeight: 60,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 15,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "gray",
  },
  deleteButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default SubBranchDetailedIssue;

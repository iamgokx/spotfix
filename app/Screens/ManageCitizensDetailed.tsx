import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const ManageCitizensDetailed = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const searchParams = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [user, setUser] = useState(null);
  const [isModalActive, setIsModalActive] = useState(false);
  const [isDeleteModalActive, setisDeleteModalActive] = useState(false);

  const [newUserDetails, setNewUserDetails] = useState({
    email: "",
    full_name: "",
    phone_number: "",
    aadhar_number: "",
    status: "",
    locality: "",
    pincode: "",
  });

  const getCitizenDetails = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/admin/editCitizen`,
        { email: searchParams.email }
      );

      if (response.data.length > 0) {
        console.log("Received user data: ", response.data);
        setUser(response.data);
        setNewUserDetails(response.data);
      } else {
        console.log("No user found");
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching citizen details:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    getCitizenDetails();
  }, [searchParams.email]);

  const handleDeleteUserPress = () => {
    console.log("deleted user");
  };

  const handleSaveButtonPress = () => {
    console.log("saved user details");
    console.log("new details ", newUserDetails);
  };

  const handleCancelButtonClick = () => {
    console.log("cancel btn press");
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 10,

        display: "flex",
        gap: 40,
        flexDirection: "column",
        backgroundColor: currentColors.backgroundDarkest,
      }}>
      {user ? (
        <ScrollView
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            paddingBottom: insets.bottom,
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}>
          <View style={{ padding : 20, display : 'flex', alignItems : 'center', justifyContent : 'center'}}>
            <Image
              source={{
                uri: `http://${API_IP_ADDRESS}:8000/uploads/profile/${user[0].picture_name}`,
              }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 500,
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text
              style={{ color: currentColors.textShade, paddingHorizontal: 15 }}>
              Name of the User:
            </Text>
            <TextInput
              style={styles.inputField}
              placeholder={user[0].full_name}
              placeholderTextColor="#aaa"
              value={newUserDetails.full_name}
              onChangeText={(text) => {
                setNewUserDetails((prev) => ({ ...prev, full_name: text }));
                console.log("new name : ", text);
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text
              style={{ color: currentColors.textShade, paddingHorizontal: 15 }}>
              Email
            </Text>
            <TextInput
              style={styles.inputField}
              placeholder={user[0].email}
              placeholderTextColor="#aaa"
              value={newUserDetails.email}
              onChangeText={(text) =>
                setNewUserDetails((prev) => ({ ...prev, email: text }))
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Text
              style={{ color: currentColors.textShade, paddingHorizontal: 15 }}>
              AadharCard Number
            </Text>
            <TextInput
              style={styles.inputField}
              placeholder={user[0].aadhar_number}
              placeholderTextColor="#aaa"
              value={newUserDetails.aadhar_number}
              onChangeText={(text) =>
                setNewUserDetails((prev) => ({ ...prev, aadhar_number: text }))
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Text
              style={{ color: currentColors.textShade, paddingHorizontal: 15 }}>
              Phone Number
            </Text>
            <TextInput
              style={styles.inputField}
              placeholder={user[0].phone_number}
              placeholderTextColor="#aaa"
              value={newUserDetails.phone_number}
              onChangeText={(text) =>
                setNewUserDetails((prev) => ({ ...prev, phone_number: text }))
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Text
              style={{ color: currentColors.textShade, paddingHorizontal: 15 }}>
              Status
            </Text>
            <TextInput
              style={styles.inputField}
              placeholder={user[0].status}
              placeholderTextColor="#aaa"
              value={newUserDetails.status}
              onChangeText={(text) =>
                setNewUserDetails((prev) => ({ ...prev, status: text }))
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Text
              style={{ color: currentColors.textShade, paddingHorizontal: 15 }}>
              Locality
            </Text>
            <TextInput
              style={styles.inputField}
              placeholder={user[0].locality}
              placeholderTextColor="#aaa"
              value={newUserDetails.locality}
              onChangeText={(text) =>
                setNewUserDetails((prev) => ({ ...prev, locality: text }))
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Text
              style={{ color: currentColors.textShade, paddingHorizontal: 15 }}>
              pincode
            </Text>
            <TextInput
              style={styles.inputField}
              placeholder={user[0].pincode}
              placeholderTextColor="#aaa"
              value={newUserDetails.pincode}
              onChangeText={(text) =>
                setNewUserDetails((prev) => ({ ...prev, pincode: text }))
              }
            />
          </View>
          <TouchableOpacity
            onPress={handleDeleteUserPress}
            style={{
              width: "100%",
              marginTop: 40,
              backgroundColor: "red",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 50,
              padding: 14,
              gap: 10,
            }}>
            <Ionicons
              name={"trash-bin-outline"}
              size={24}
              color={currentColors.secondary}
            />
            <Text
              style={{
                textAlign: "center",
                borderRadius: 30,
                color: "white",
                fontSize: 18,
              }}>
              Delete
            </Text>
          </TouchableOpacity>
          {/* <View
            style={[
              styles.btnContainer,
              {
                marginBottom: insets.bottom,
                backgroundColor: currentColors.backgroundDarkest,
              },
            ]}>
            <TouchableOpacity
              style={{ width: "30%" }}
              onPress={handleSaveButtonPress}>
              <Text
                style={{
                  backgroundColor: currentColors.primary,

                  padding: 12,
                  textAlign: "center",
                  borderRadius: 30,
                  color: "white",
                  fontSize: 18,
                }}>
                Save
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCancelButtonClick}
              style={{ width: "30%" }}>
              <Text
                style={{
                  backgroundColor: "red",
                  padding: 12,
                  textAlign: "center",
                  borderRadius: 30,
                  color: "white",
                  fontSize: 18,
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View> */}
        </ScrollView>
      ) : (
        <Text style={{ color: "white", textAlign: "center" }}>
          Cannot load user data
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    gap: 10,
    marginTop: 40,
  },
  inputField: {
    height: 50,
    borderRadius: 30,
    backgroundColor: "#333",
    paddingHorizontal: 15,
    fontSize: 16,
    color: "white",
  },

  btnContainer: {
    width: "100%",
    padding: 30,
    display: "flex",
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

export default ManageCitizensDetailed;

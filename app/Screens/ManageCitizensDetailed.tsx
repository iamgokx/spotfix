import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import pfp from "../../assets/images/profile/defaultProfile.jpeg";
const ManageCitizensDetailed = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const searchParams = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [user, setUser] = useState(null);
  const [isModalActive, setIsModalActive] = useState(false);

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

  const handleBanUser = () => {
    console.log("banning user in progress...");

    try {
      const response = axios.post(
        `http://${API_IP_ADDRESS}:8000/api/users/deleteAccount`,
        {
          email: user[0].email,
        }
      );
      if (response.data.status) {
        console.log("banning user successfull....");
        getCitizenDetails();
        setIsModalActive();
      } else {
        console.log("could not bann user");
      }
    } catch (error) {}
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
      <Modal transparent visible={isModalActive}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <View
            style={{
              width: "90%",
              backgroundColor: currentColors.background,
              padding: 20,
              borderRadius: 20,
              gap: 20,
            }}>
            <Text
              style={{
                color: currentColors.text,
                fontSize: 14,
                textAlign: "center",
              }}>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
              }}>
              <TouchableOpacity
                onPress={handleBanUser}
                style={{
                  padding: 10,
                  borderRadius: 20,
                  backgroundColor: "red",
                  paddingHorizontal: 25,
                }}>
                <Text style={{ color: "white", fontWeight: 900, fontSize: 15 }}>
                  Ban User
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsModalActive(false)}
                style={{
                  padding: 10,
                  borderRadius: 20,
                  backgroundColor: currentColors.secondary,
                  paddingHorizontal: 25,
                }}>
                <Text style={{ color: "white", fontWeight: 900, fontSize: 15 }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {user ? (
        <ScrollView
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            paddingBottom: insets.bottom + 10,
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
          }}>
          <View
            style={{
              padding: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Image
              source={
                user[0].picture_name != null
                  ? {
                      uri: `http://${API_IP_ADDRESS}:8000/uploads/profile/${user[0].picture_name}`,
                    }
                  : pfp
              }
              style={{
                width: 150,
                height: 150,
                borderRadius: 500,
              }}
            />
          </View>

          {user[0].status == "pending" && (
            <Text
              style={{
                backgroundColor: "red",
                color: "white",
                padding: 10,
                fontSize: 18,
                textAlign: "center",
                marginVertical: 20,
                width: "50%",
                borderRadius: 20,
              }}>
              User Banned
            </Text>
          )}
          <View style={styles.inputContainer}>
            <Text
              style={{ color: currentColors.textShade, paddingHorizontal: 15 }}>
              Name of the User:
            </Text>
            <TextInput
              editable={false}
              style={styles.inputField}
              placeholder={user[0].full_name}
              placeholderTextColor={currentColors.text}
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
              editable={false}
              style={styles.inputField}
              placeholder={user[0].email}
              placeholderTextColor={currentColors.text}
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
              editable={false}
              style={styles.inputField}
              placeholder={user[0].aadhar_number}
              placeholderTextColor={currentColors.text}
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
              editable={false}
              style={styles.inputField}
              placeholder={user[0].phone_number}
              placeholderTextColor={currentColors.text}
              value={newUserDetails.phone_number}
              onChangeText={(text) =>
                setNewUserDetails((prev) => ({ ...prev, phone_number: text }))
              }
            />
          </View>
          {/* <View style={styles.inputContainer}>
            <Text
              style={{ color: currentColors.textShade, paddingHorizontal: 15 }}>
              Status
            </Text>
            <TextInput
              editable={false}
              style={styles.inputField}
              placeholder={user[0].status}
              placeholderTextColor={currentColors.text}
              value={newUserDetails.status}
              onChangeText={(text) =>
                setNewUserDetails((prev) => ({ ...prev, status: text }))
              }
            />
          </View> */}
          <View style={styles.inputContainer}>
            <Text
              style={{ color: currentColors.textShade, paddingHorizontal: 15 }}>
              Locality
            </Text>
            <TextInput
              editable={false}
              style={styles.inputField}
              placeholder={user[0].locality}
              placeholderTextColor={currentColors.text}
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
              editable={false}
              style={styles.inputField}
              placeholder={user[0].pincode}
              placeholderTextColor={currentColors.text}
              value={newUserDetails.pincode}
              onChangeText={(text) =>
                setNewUserDetails((prev) => ({ ...prev, pincode: text }))
              }
            />
          </View>

          {user[0].status != "pending" && (
            <TouchableOpacity
              onPress={() => setIsModalActive(true)}
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
                Ban User
              </Text>
            </TouchableOpacity>
          )}
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

import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useEffect, useState } from "react";
import { State, TextInput } from "react-native-gesture-handler";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

const EditDepartments = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const params = useLocalSearchParams();
  const [departmentData, setDepartmentData] = useState();
  const insets = useSafeAreaInsets();
  const [isModalActive, setIsModalActive] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newDepartmentCoordinator, setNewDepartmentCoordinator] = useState("");
  const [newState, setnewState] = useState("");
  const navigation = useNavigation();
  const [isDeleteModalActive, setisDeleteModalActive] = useState(false)
  const getDepartmentData = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/admin/editDepartment`,
        {
          department: params.department,
        }
      );
      if (response) {
        console.log("response ", response.data);
        console.log(setDepartmentData(response.data));
      }
    } catch (error) {
      console.log("error getting department data : ", error);
    }
  };

  useEffect(() => {
    getDepartmentData();
  }, []);

  const handleCancelButtonClick = () => {
    setIsModalActive((prev) => !prev);
  };

  const handleSaveButtonPress = async () => {
    console.log(newDepartmentName);
    console.log(newDepartmentCoordinator);
    console.log(newState);
  };
  const handleCancelButtonPress = async () => {
    setNewDepartmentCoordinator("");
    setNewDepartmentName("");
    setnewState("");
    setIsModalActive(false);
    setTimeout(() => {
      navigation.goBack();
    }, 100);
  };


  const handleDeleteDepartmentOkBtn =()=>{
    setisDeleteModalActive(false)
  }

  return (
    <>
      <Modal
        animationType="fade"
        transparent
        visible={isModalActive}
        onRequestClose={() => setIsModalActive(false)}>
        <View
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <View
            style={{
              backgroundColor: currentColors.background,
              width: "80%",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: 5,
              padding: 20,
              borderRadius: 30,
              elevation: 10,
            }}>
            <Text
              style={{
                fontWeight: 600,
                fontSize: 22,
                textAlign: "center",
                color: currentColors.secondary,
              }}>
              Are you sure you want to cancel?
            </Text>
            <Text style={{ fontSize: 18, color: currentColors.text }}>
              All changes made will be lost
            </Text>

            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                marginTop: 20,
              }}>
              <TouchableOpacity
                onPress={() => setIsModalActive(false)}
                style={{ width: "40%" }}>
                <Text
                  style={{
                    textAlign: "center",
                    backgroundColor: currentColors.backgroundDarker,
                    borderRadius: 30,
                    padding: 10,
                    color: currentColors.secondary,
                    borderWidth: 1,
                    borderColor: currentColors.secondary,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancelButtonPress}
                style={{ width: "40%" }}>
                <Text
                  style={{
                    textAlign: "center",
                    backgroundColor: currentColors.backgroundDarker,
                    borderRadius: 30,
                    padding: 10,
                    color: currentColors.secondary,
                    borderWidth: 1,
                    borderColor: currentColors.secondary,
                  }}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent
        visible={isDeleteModalActive}
        onRequestClose={() => setisDeleteModalActive(false)}>
        <View
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <View
            style={{
              backgroundColor: currentColors.background,
              width: "80%",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: 5,
              padding: 20,
              borderRadius: 30,
              elevation: 10,
            }}>
            <Text
              style={{
                fontWeight: 600,
                fontSize: 22,
                textAlign: "center",
                color: currentColors.secondary,
              }}>
              Are you sure you want to DELETE this department?
            </Text>
            <Text style={{ fontSize: 18, color: currentColors.text }}>
              All data related to this department will be lost.
            </Text>

            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                marginTop: 20,
              }}>
              <TouchableOpacity
                onPress={() => setisDeleteModalActive(false)}
                style={{ width: "40%" }}>
                <Text
                  style={{
                    textAlign: "center",
                    backgroundColor: currentColors.backgroundDarker,
                    borderRadius: 30,
                    padding: 10,
                    color: currentColors.secondary,
                    borderWidth: 1,
                    borderColor: currentColors.secondary,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeleteDepartmentOkBtn}
                style={{ width: "40%" }}>
                <Text
                  style={{
                    textAlign: "center",
                    backgroundColor: currentColors.backgroundDarker,
                    borderRadius: 30,
                    padding: 10,
                    color: currentColors.secondary,
                    borderWidth: 1,
                    borderColor: currentColors.secondary,
                  }}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          padding: 10,
          paddingVertical: 30,
          gap: 30,
          backgroundColor: currentColors.backgroundDarkest,
        }}>
        {departmentData && (
          <>
            <View style={styles.inputContainer}>
              <Text
                style={{
                  color: currentColors.textShade,
                  paddingHorizontal: 15,
                }}>
                Name of the Department
              </Text>

              <TextInput
                style={{
                  height: 50,
                  borderRadius: 30,
                  backgroundColor: currentColors.inputField,
                  paddingHorizontal: 15,
                  fontSize: 16,
                  color: currentColors.text,
                }}
                placeholder={departmentData[0].department_name}
                placeholderTextColor="#aaa"
                value={newDepartmentName}
                onChangeText={(text) => setNewDepartmentName(text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text
                style={{
                  color: currentColors.textShade,
                  paddingHorizontal: 15,
                }}>
                Name of the Department Coordinator
              </Text>

              <TextInput
                style={{
                  height: 50,
                  borderRadius: 30,
                  backgroundColor: currentColors.inputField,
                  paddingHorizontal: 15,
                  fontSize: 16,
                  color: currentColors.text,
                }}
                placeholder={departmentData[0].full_name}
                placeholderTextColor="white"
                editable={false}
                value={newDepartmentCoordinator}
                onChangeText={(text) => setNewDepartmentCoordinator(text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text
                style={{
                  paddingHorizontal: 15,
                  color: currentColors.textShade,
                }}>
                State
              </Text>

              <TextInput
                style={{
                  height: 50,
                  borderRadius: 30,
                  backgroundColor: currentColors.inputField,
                  paddingHorizontal: 15,
                  fontSize: 16,
                  color: currentColors.text,
                }}
                placeholder={departmentData[0].state}
                placeholderTextColor="white"
                editable={false}
                value={newState}
                onChangeText={(text) => setnewState(text)}
              />
              <TouchableOpacity
                onPress={handleCancelButtonClick}
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
            </View>
          </>
        )}
      </View>
      <View
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    display: "flex",

    width: "100%",
    gap: 10,
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
export default EditDepartments;

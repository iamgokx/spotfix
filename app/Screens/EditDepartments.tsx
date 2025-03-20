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
  const [modalMessage, setmodalMessage] = useState("");
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newDepartmentCoordinator, setNewDepartmentCoordinator] = useState("");
  const [newDepartmentCoordinatorEmail, setNewDepartmentCoordinatorEmail] =
    useState("");
  const [newState, setnewState] = useState("");
  const navigation = useNavigation();
  const [isDeleteModalActive, setisDeleteModalActive] = useState(false);
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

  const handleCancelButtonPress = async () => {
    setNewDepartmentCoordinator("");
    setNewDepartmentName("");
    setnewState("");
    setIsModalActive(false);
    setTimeout(() => {
      navigation.goBack();
    }, 100);
  };

  const handleDeleteDepartmentOkBtn = () => {
    setisDeleteModalActive(false);
  };

  const [errors, setErrors] = useState({});

  const validate = (field) => {
    let errors: Record<string, string> = {};
    let valid = true;

    switch (field) {
      case "departmentName":
        {
          console.log(departmentData[0].department_name);
          if (!newDepartmentName.trim()) {
            errors.departmentName = "Department name is required.";
            valid = false;
          } else if (departmentData[0].department_name == newDepartmentName) {
            errors.departmentName =
              "New department name cannot be same as the old department name...";
            valid = false;
          } else if (/\d/.test(newDepartmentName)) {
            errors.departmentName = "Department name cannot contain numbers.";
            valid = false;
          } else if (/[^A-Za-z\s]/.test(newDepartmentName)) {
            errors.departmentName =
              "Department name cannot contain special characters.";
            valid = false;
          } else if (newDepartmentName.length < 10) {
            errors.departmentName = "Department name cannot be so short.";
            valid = false;
          }
        }
        break;

      case "depCoordinator":
        {
          if (!newDepartmentCoordinator.trim()) {
            errors.departmentCoordinator = "Coordinator name is required.";
            valid = false;
          } else if (!/^[A-Za-z ]+$/.test(newDepartmentCoordinator)) {
            errors.departmentCoordinator =
              "Only letters and spaces are allowed.";
            valid = false;
          } else if (!/^[A-Za-z ]+$/.test(newDepartmentCoordinator)) {
            errors.departmentCoordinator =
              "Only letters and spaces are allowed.";
            valid = false;
          } else if (departmentData[0].full_name == newDepartmentCoordinator) {
            errors.departmentCoordinator =
              "New coordinator name cannot be same as the old coordinator name...";
            valid = false;
          }
        }
        break;
      case "depEmail":
        {
          if (!newDepartmentCoordinatorEmail.trim()) {
            errors.departmentCoordinatorEmail =
              "Coordinator email is required.";
            valid = false;
          } else if (
            !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(
              newDepartmentCoordinatorEmail
            )
          ) {
            errors.departmentCoordinatorEmail = "Enter a valid email address.";
            valid = false;
          } else if (
            !/^[A-Za-z0-9]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(
              newDepartmentCoordinatorEmail
            )
          ) {
            errors.departmentCoordinatorEmail =
              "Special characters are not allowed before '@'.";
            valid = false;
          } else if (
            departmentData[0].dep_coordinator_id ==
            newDepartmentCoordinatorEmail
          ) {
            errors.departmentCoordinatorEmail =
              "New coordinator email cannot be same as the old coordinator email...";
            valid = false;
          }
        }
        break;
    }

    setErrors(errors);
    return valid;
  };

  const updateDepName = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/admin/updateDepName`,
        {
          id: departmentData[0].department_id,
          value: newDepartmentName,
        }
      );

      if (response.data.status) {
        console.log(response.data.message);

        setDepartmentData((prevData) => [
          { ...prevData[0], department_name: newDepartmentName },
        ]);

        setmodalMessage(response.data.message);
        setIsModalActive(true);
      } else {
        setmodalMessage(response.data.message);
        setIsModalActive(true);
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateDepCoordName = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/admin/updateDepCoordName`,
        {
          id: departmentData[0].department_id,
          value: newDepartmentCoordinator,
        }
      );

      if (response.data.status) {
        console.log(response.data.message);

        setDepartmentData((prevData) => [
          { ...prevData[0], full_name: newDepartmentCoordinator },
        ]);

        setmodalMessage(response.data.message);
        setIsModalActive(true);
      } else {
        setmodalMessage(response.data.message);
        setIsModalActive(true);
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateDepCoordEmail = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/admin/updateDepCoordEmail`,
        {
          id: departmentData[0].department_id,
          newEmail: newDepartmentCoordinatorEmail,
        }
      );

      if (response.data.status) {
        console.log(response.data.message);

        setDepartmentData((prevData) => [
          { ...prevData[0], dep_coordinator_id: newDepartmentCoordinatorEmail },
        ]);

        setmodalMessage(response.data.message);
        setIsModalActive(true);
      } else {
        setmodalMessage(response.data.message);
        setIsModalActive(true);
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkDepName = () => {
    setErrors({});
    if (validate("departmentName")) {
      console.log("all good");
      updateDepName();
    } else {
      console.log("wrong");
    }
  };

  const checkDepCoordName = () => {
    setErrors({});
    if (validate("depCoordinator")) {
      console.log("all good");
      updateDepCoordName();
    } else {
      console.log("wrong");
    }
  };
  const checkDepCoordEmail = () => {
    setErrors({});
    if (validate("depEmail")) {
      console.log("all good");
      updateDepCoordEmail();
    } else {
      console.log("wrong");
    }
  };

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
              alignItems: "center",
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
              {modalMessage}
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
                onPress={() => {
                  setIsModalActive(false);
                  setmodalMessage("");
                  setNewDepartmentName("");
                  setNewDepartmentCoordinator("");
                  setNewDepartmentCoordinatorEmail("");
                }}
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

              {errors.departmentName && (
                <Text style={styles.error}>{errors.departmentName}</Text>
              )}
              {newDepartmentName != "" && (
                <View
                  style={{
                    width: "100%",
                    padding: 10,
                    flexDirection: "row",
                    justifyContent: "flex-end",

                    gap: 10,
                  }}>
                  <TouchableOpacity
                    onPress={checkDepName}
                    style={{
                      padding: 10,

                      backgroundColor: currentColors.secondary,
                      borderRadius: 900,
                    }}>
                    <Ionicons
                      name={"checkmark"}
                      color={currentColors.text}
                      size={24}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setNewDepartmentName("");
                      setErrors({});
                    }}
                    style={{
                      padding: 10,

                      borderRadius: 500,
                      backgroundColor: currentColors.secondary,
                    }}>
                    <Ionicons
                      name={"close"}
                      color={currentColors.text}
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
              )}
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
                placeholderTextColor={currentColors.textShade}
                value={newDepartmentCoordinator}
                onChangeText={(text) => setNewDepartmentCoordinator(text)}
              />
              {errors.departmentCoordinator && (
                <Text style={styles.error}>{errors.departmentCoordinator}</Text>
              )}
              {newDepartmentCoordinator != "" && (
                <View
                  style={{
                    width: "100%",
                    padding: 10,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    gap: 10,
                  }}>
                  <TouchableOpacity
                    onPress={checkDepCoordName}
                    style={{
                      padding: 10,

                      backgroundColor: currentColors.secondary,
                      borderRadius: 500,
                    }}>
                    <Ionicons
                      name={"checkmark"}
                      color={currentColors.text}
                      size={24}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setNewDepartmentName("");
                      setErrors({});
                    }}
                    style={{
                      padding: 10,

                      borderRadius: 500,
                      backgroundColor: currentColors.secondary,
                    }}>
                    <Ionicons
                      name={"close"}
                      color={currentColors.text}
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text
                style={{
                  color: currentColors.textShade,
                  paddingHorizontal: 15,
                }}>
                Email of the Department Coordinator
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
                placeholder={departmentData[0].dep_coordinator_id}
                placeholderTextColor={currentColors.textShade}
                value={newDepartmentCoordinatorEmail}
                onChangeText={(text) => setNewDepartmentCoordinatorEmail(text)}
              />
              {errors.departmentCoordinatorEmail && (
                <Text style={styles.error}>
                  {errors.departmentCoordinatorEmail}
                </Text>
              )}
            {newDepartmentCoordinatorEmail != "" && (
              <View
                style={{
                  width: "100%",
                  padding: 10,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: 10,
                }}>
                <TouchableOpacity
                  onPress={checkDepCoordEmail}
                  style={{
                    padding: 10,

                    backgroundColor: currentColors.secondary,
                    borderRadius: 500,
                  }}>
                  <Ionicons
                    name={"checkmark"}
                    color={currentColors.text}
                    size={24}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setNewDepartmentCoordinatorEmail("");
                    setErrors({});
                  }}
                  style={{
                    padding: 10,

                    borderRadius: 500,
                    backgroundColor: currentColors.secondary,
                  }}>
                  <Ionicons
                    name={"close"}
                    color={currentColors.text}
                    size={24}
                  />
                </TouchableOpacity>
              </View>
            )}
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
                editable={false}
                style={{
                  height: 50,
                  borderRadius: 30,
                  backgroundColor: currentColors.inputField,
                  paddingHorizontal: 15,
                  fontSize: 16,

                  color: currentColors.text,
                }}
                placeholder={departmentData[0].state}
                placeholderTextColor={currentColors.text}
                value={newState}
                onChangeText={(text) => setnewState(text)}
              />

              {/* <TouchableOpacity
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
              </TouchableOpacity> */}
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
        {/* <TouchableOpacity
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
        </TouchableOpacity> */}
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
  error: {
    color: "red",
    fontSize: 14,
    paddingLeft: 15,
    marginTop: 5,
  },
});
export default EditDepartments;

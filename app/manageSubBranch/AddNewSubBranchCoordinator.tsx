import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useColorScheme,
  Button,
  Touchable,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { Picker } from "@react-native-picker/picker";
import { useSubBranch } from "@/context/newSubBranchContext";
import { getStoredData } from "@/hooks/useJwt";
import { Modal } from "react-native";
const AddNewSubBranchCoordinator = () => {
  const { coordinator, setCoordinator, clearCoordinator } = useSubBranch();
  const safeCoordinator = coordinator || {};
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [departmentData, setdepartmentData] = useState();
  const [departmentId, setdepartmentId] = useState();
  const [modalText, setmodalText] = useState();
  const [isModalActive, setisModalActive] = useState(false);
  const validateForm = () => {
    let valid = true;
    let newErrors = {};
    console.log(safeCoordinator);
    if (!safeCoordinator.name || safeCoordinator.name.trim() === "") {
      newErrors.name = "Full Name is required";
      valid = false;
    } else if (safeCoordinator.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
      valid = false;
    } else {
    }

    if (!safeCoordinator.departmentName) {
      newErrors.department = "Department is required";
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!safeCoordinator.email || safeCoordinator.email.trim() === "") {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(safeCoordinator.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!safeCoordinator.password || safeCoordinator.password.trim() === "") {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!passwordRegex.test(safeCoordinator.password)) {
      newErrors.password =
        "Password must be at least 8 characters long, include at least one uppercase letter and one number";
      valid = false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (
      !safeCoordinator.phoneNumber ||
      safeCoordinator.phoneNumber.trim() === ""
    ) {
      newErrors.phone = "Phone number is required";
      valid = false;
    } else if (!phoneRegex.test(safeCoordinator.phoneNumber)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
      valid = false;
    }

    if (!safeCoordinator.latitude || !safeCoordinator.longitude) {
      newErrors.location = "Location is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const addSubBranchCoordinator = async () => {
    console.log(coordinator);
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/branchCoordinator/addSubBnanchCoordinator`,
        {
          name: coordinator.name,
          departmentName: coordinator.departmentName,
          email: coordinator.email,
          phoneNumber: coordinator.phoneNumber,
          latitude: coordinator.latitude,
          longitude: coordinator.longitude,
          password: coordinator.password,
        }
      );

      if (response.data.status) {
        console.log("success");
        console.log(response.data.message);
        router.push("/branchCoordinators/ManageSubBranchCoordinators");
      } else {
        console.log("failed");
        console.log(response.data.message);
        setmodalText(response.data.message);
        setisModalActive(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      addSubBranchCoordinator();
    } else {
      console.log("something went wrong validating form");
    }
  };

  const handleCancel = () => {
    clearCoordinator();
    router.push("/branchCoordinators/MakeNew");
  };

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

      const user = await getStoredData();
      console.log(user);
      const idResponse = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/department/getDepartmentId`,
        {
          email: user.email,
        }
      );

      if (idResponse.data.status) {
        console.log("idResponse ", idResponse.data.results);
        setdepartmentId(idResponse.data.results);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDepartmentList();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: currentColors.backgroundDarker,
          position: "relative",
          paddingTop: insets.top + 10,
        }}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            padding: 15,
            alignItems: "center",
          }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ position: "absolute", left: 15 }}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={currentColors.secondary}
            />
          </TouchableOpacity>
          <Text style={{ color: currentColors.secondary, fontSize: 18 }}>
            Add New Sub Branch Coordinator
          </Text>
        </View>
      </View>

      <ScrollView
        style={{
          flex: 1,
          backgroundColor: currentColors.backgroundDarkest,
          padding: 15,
        }}
        contentContainerStyle={{ display: "flex", alignItems: "center" }}>
        <Modal visible={isModalActive} transparent animationType="fade">
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}>
            <View
              style={{
                width: "90%",
                backgroundColor: currentColors.background,
                padding: 10,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                height: 200,
                position: "relative",
              }}>
              <Text style={{ color: currentColors.secondary, fontSize: 19 }}>
                {modalText}
              </Text>
              <TouchableOpacity
                onPress={() => setisModalActive(false)}
                style={{
                  width: "100%",
                  position: "absolute",
                  top: 10,
                  right: 10,
                  alignItems: "flex-end",
                }}>
                <Ionicons
                  name="close-sharp"
                  size={24}
                  color={currentColors.secondary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Text
          style={{
            fontWeight: 500,
            fontSize: 18,
            color: currentColors.text,
            width: "100%",
            textAlign: "center",
            marginBottom: 30,
          }}>
          Sub Branch Coordinator
        </Text>

        <Text style={[styles.label, { color: currentColors.text }]}>
          Name of Sub Branch Coordinator
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: currentColors.text,
              backgroundColor: currentColors.background,
            },
            errors.fullName && styles.errorInput,
          ]}
          placeholder="Full Name"
          placeholderTextColor={currentColors.textShade}
          value={safeCoordinator.name || ""}
          onChangeText={(text) =>
            setCoordinator((prev) => ({ ...prev, name: text }))
          }
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <Text style={[styles.label, { color: currentColors.text }]}>
          Name of Department
        </Text>
        <View
          style={[
            styles.pickerContainer,
            { backgroundColor: currentColors.background },
          ]}>
          <Picker
            selectedValue={safeCoordinator.departmentName || ""}
            onValueChange={(itemValue) =>
              setCoordinator((prev) => ({ ...prev, departmentName: itemValue }))
            }
            style={[styles.picker, { color: currentColors.text }]}
            dropdownIconColor={currentColors.secondary}>
            <Picker.Item label="Select a Department" value="" enabled={false} />
            {departmentId?.map((dept) => (
              <Picker.Item
                key={dept.department_id}
                label={dept.department_name}
                value={dept.department_id}
              />
            ))}
          </Picker>
        </View>

        {errors.department && (
          <Text style={styles.errorText}> {errors.department} </Text>
        )}

        <Text style={[styles.label, { color: currentColors.text }]}>
          Email ID
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: currentColors.text,
              backgroundColor: currentColors.background,
            },
            errors.email && styles.errorInput,
          ]}
          placeholder="eg. test123@gmail.com"
          placeholderTextColor={currentColors.textShade}
          value={coordinator?.email}
          onChangeText={(text) =>
            setCoordinator((prev) => ({ ...prev, email: text }))
          }
          keyboardType="email-address"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <Text style={[styles.label, { color: currentColors.text }]}>
          Default Password
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: currentColors.text,
              backgroundColor: currentColors.background,
            },
            errors.password && styles.errorInput,
          ]}
          placeholderTextColor={currentColors.textShade}
          value={coordinator?.password}
          onChangeText={(text) =>
            setCoordinator((prev) => ({ ...prev, password: text }))
          }
        />

        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}

        <Text style={[styles.label, { color: currentColors.text }]}>Phone</Text>
        <TextInput
          style={[
            styles.input,
            {
              color: currentColors.text,
              backgroundColor: currentColors.background,
            },
            errors.phone && styles.errorInput,
          ]}
          placeholder="+91"
          placeholderTextColor={currentColors.textShade}
          value={coordinator?.phoneNumber}
          onChangeText={(text) =>
            setCoordinator((prev) => ({ ...prev, phoneNumber: text }))
          }
          keyboardType="numeric"
          maxLength={10}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

        <Text style={[styles.label, { color: currentColors.text }]}>
          Location
        </Text>
        <TouchableOpacity
          style={[
            styles.input,
            {
              color: currentColors.text,
              backgroundColor: currentColors.secondary,
            },
            styles.locationInput,
            errors.location && styles.errorInput,
          ]}
          onPress={() =>
            router.push("/manageSubBranch/NewSubBranchCoordinatorMap")
          }>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            {!coordinator.latitude ? (
              <>
                <Text style={{ color: "white" }}>Select Loaction</Text>
                <Ionicons name="location" size={24} color={"white"} />
              </>
            ) : (
              <>
                <Text style={{ color: "white" }}>Loaction Selected</Text>
                <Ionicons name="checkmark-outline" size={24} color={"white"} />
              </>
            )}
          </View>
        </TouchableOpacity>
        {errors.location && (
          <Text style={styles.errorText}>{errors.location}</Text>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleCancel}
            style={[
              styles.cancelButton,
              { borderColor: currentColors.secondary, borderRadius: 50 },
            ]}>
            <Text style={{ color: "white", fontWeight: 500, fontSize: 18 }}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: currentColors.secondary, borderRadius: 50 },
            ]}
            onPress={handleSubmit}>
            <Text style={{ color: "white", fontWeight: 500, fontSize: 18 }}>
              Add
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a73e8",
    marginBottom: 10,
  },
  label: {
    width: "100%",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,

    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  locationInput: {
    justifyContent: "center",
    paddingLeft: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  errorInput: {
    borderColor: "red",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1a73e8",
    marginRight: 10,
  },
  cancelText: {
    color: "#1a73e8",
    fontSize: 16,
  },
  addButton: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#1a73e8",
  },
  addText: {
    color: "#fff",
    fontSize: 16,
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 30,
    marginBottom: 20,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "transparent",
  },
});

export default AddNewSubBranchCoordinator;

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

import { getStoredData } from "@/hooks/useJwt";
import { Modal } from "react-native";

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];
const addBranchCoordinator = () => {
  const safeCoordinator = {};
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setstate] = useState();
  const [departmentName, setDepartmentName] = useState("");

  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [departmentData, setdepartmentData] = useState();
  const [departmentId, setdepartmentId] = useState();
  const [modalText, setmodalText] = useState();
  const [isModalActive, setisModalActive] = useState(false);

  const [successModal, setsuccessModal] = useState(false);
  const [successMessage, setsuccessMessage] = useState("");
  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    const nameRegex = /^[A-Za-z]{2,}\s[A-Za-z]{2,}$/;

    if (!fullName || fullName.trim() === "") {
      newErrors.name = "Full Name is required";
      valid = false;
    } else if (!nameRegex.test(fullName)) {
      newErrors.name =
        "Enter a valid full name (Two words, no numbers, at least 2 letters in each)";
      valid = false;
    }
    if (!departmentName) {
      newErrors.departmentName = "Department is required";
      valid = false;
    } else if (
      departmentData?.some(
        (dept) =>
          dept.department_name.trim().toLowerCase() ===
          departmentName.trim().toLowerCase()
      )
    ) {
      newErrors.departmentName = "This department already exists!";
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.trim() === "") {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!password || password.trim() === "") {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters long, include at least one uppercase letter and one number";
      valid = false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone || phone.trim() === "") {
      newErrors.phone = "Phone number is required";
      valid = false;
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
      valid = false;
    }

    if (!state) {
      newErrors.state = "Please select a state";
      valid = false;
    } else if (state.trim().toLowerCase() !== "goa") {
      newErrors.state = "SpotFix is currently available only in Goa";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const addBranchCoordinator = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/admin/addBranchCoordinator`,
        {
          name: fullName,
          email: email,
          password: password,
          phoneNumber: phone,
          departmentName: departmentName,
          state: state,
        }
      );
      if (response.data.status) {
        console.log("success");
        console.log(response.data.message);
        setsuccessMessage(response.data.message);
        setsuccessModal(true);
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

  const handleOnOkPress = () => {
    setsuccessModal(false);
    router.push("/admin/home");
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("can add him dude@");
      addBranchCoordinator();
    } else {
      console.log("something went wrong validating form");
    }
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
            Add New Branch Coordinator
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
        <Modal visible={successModal} transparent animationType="fade">
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
                gap: 20,
              }}>
              <Text style={{ color: currentColors.secondary, fontSize: 19 }}>
                {successMessage}
              </Text>
              <TouchableOpacity
                onPress={handleOnOkPress}
                style={{
                  alignItems: "center",
                  backgroundColor: currentColors.secondary,
                  padding: 10,
                  borderRadius: 30,
                  paddingHorizontal: 20,
                  flexDirection: "row",
                  alignContent: "center",
                  gap: 10,
                }}>
                <Ionicons name="checkmark" size={24} color={"white"} />
                <Text style={{ color: "white" }}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={[styles.label, { color: currentColors.text }]}>
          Name of Branch Coordinator
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
          value={fullName}
          onChangeText={(text) => setFullName(text)}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

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
          value={email}
          onChangeText={(text) => setEmail(text)}
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
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}

        <Text style={[styles.label, { color: currentColors.text }]}>
          Phone Number
        </Text>
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
          value={phone}
          onChangeText={(text) => setPhone(text)}
          keyboardType="numeric"
          maxLength={10}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

        <Text style={[styles.label, { color: currentColors.text }]}>
          Department Name
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: currentColors.text,
              backgroundColor: currentColors.background,
            },
            errors.departmentName && styles.errorInput,
          ]}
          placeholder="eg. Electricty Department"
          placeholderTextColor={currentColors.textShade}
          value={departmentName}
          onChangeText={(text) => setDepartmentName(text)}
          keyboardType="default"
        />
        {errors.departmentName && (
          <Text style={styles.errorText}>{errors.departmentName}</Text>
        )}

        <Text style={[styles.label, { color: currentColors.text }]}>State</Text>
        <View
          style={[
            styles.pickerContainer,
            { backgroundColor: currentColors.background },
          ]}>
          <Picker
            selectedValue={state}
            onValueChange={(itemValue) => setstate(itemValue)}
            style={[styles.picker, { color: currentColors.text }]}
            dropdownIconColor={currentColors.secondary}>
            <Picker.Item label="Select a State" value="" enabled={false} />
            {indianStates?.map((state) => (
              <Picker.Item key={state} label={state} value={state} />
            ))}
          </Picker>
        </View>

        {errors.state && <Text style={styles.errorText}> {errors.state} </Text>}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
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

export default addBranchCoordinator;

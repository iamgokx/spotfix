import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useState, useEffect } from "react";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TextInput } from "react-native-gesture-handler";
import { useSocketNotifications } from "@/hooks/useSocketNotifications";
import socket from "@/hooks/useSocket";
import { getStoredData } from "@/hooks/useJwt";

const EditSubDepCoordinator = () => {
  const { depId, depName, name, pincodes, id } = useLocalSearchParams();

  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const router = useRouter();

  const [subDepCoordName, setSubDepCoordName] = useState(name);
  const [subDepEmail, setSubDepEmail] = useState(id);
  const [subDepPincodes, setSubDepPincodes] = useState(pincodes);

  const [newSubDepCoordName, setnewSubDepCoordName] = useState("");
  const [newPincodes, setnewPincodes] = useState("");
  const [newEmail, setnewEmail] = useState("");

  const [isModalActive, setIsModalActive] = useState(false);
  const [modalMessage, setmodalMessage] = useState("");

  const [errors, setErrors] = useState({});

  useSocketNotifications("gokul@gmail.com");

  const validate = (field) => {
    let valid = true;
    const newErrors = {};

    switch (field) {
      case "name":
        const nameRegex = /^[A-Za-z]{2,}\s[A-Za-z]{2,}$/;
        if (!newSubDepCoordName || newSubDepCoordName.trim() === "") {
          newErrors.name = "Full Name is required";
          valid = false;
        } else if (!nameRegex.test(newSubDepCoordName)) {
          newErrors.name = "Enter a valid full name (first and last name only)";
          valid = false;
        } else if (
          newSubDepCoordName.toLowerCase() == subDepCoordName.toLowerCase()
        ) {
          newErrors.name = "New name cannot be same as the old name...";
          valid = false;
        }

        break;

      case "email":
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!newEmail || newEmail.trim() === "") {
          newErrors.newEmail = "Email is required";
          valid = false;
        } else if (!emailRegex.test(newEmail)) {
          newErrors.email = "Invalid email format";
          valid = false;
        } else if (newEmail.toLowerCase() == subDepEmail.toLowerCase()) {
          newErrors.email = "New email cannot be same as the old name...";
          valid = false;
        }

        break;

      case "pincodes":
        const goaPincodes = [
          "403001",
          "403002",
          "403003",
          "403004",
          "403005",
          "403006",
          "403007",
          "403101",
          "403102",
          "403103",
          "403104",
          "403105",
          "403106",
          "403107",
          "403108",
          "403109",
          "403110",
          "403201",
          "403202",
          "403203",
          "403204",
          "403205",
          "403206",
          "403207",
          "403208",
          "403209",
          "403210",
          "403211",
          "403212",
          "403213",
          "403214",
          "403301",
          "403302",
          "403303",
          "403304",
          "403305",
          "403306",
          "403307",
          "403308",
          "403309",
        ];

        if (!newPincodes) {
          newErrors.pincode = "Pincode field is required.";
          valid = false;
        } else {
          const enteredPincodes = newPincodes.split(",").map((p) => p.trim());
          for (let pin of enteredPincodes) {
            if (!/^\d{6}$/.test(pin)) {
              newErrors.pincode = `Invalid pincode format: ${pin}`;
              valid = false;
              break;
            }
            if (!goaPincodes.includes(pin)) {
              newErrors.pincode = `Invalid Goa pincode: ${pin}`;
              valid = false;
              break;
            }
          }
        }
    }

    setErrors(newErrors);
    return valid;
  };

  const updateSubBranchCoordName = async () => {
    const user = await getStoredData();
    const userEmail = user.email;
    console.log("Updating name...");
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/branchCoordinator/updateSubBranchCoordName`,
        {
          newName: newSubDepCoordName,
          email: subDepEmail,
          senderEmail: userEmail,
          oldValue : subDepCoordName
        }
      );

      if (response.data.status) {
        console.log("Updated sub-branch coordinator name");
        setSubDepCoordName(newSubDepCoordName);
        setnewSubDepCoordName("");
        setmodalMessage(response.data.message);
        setIsModalActive(true);
      } else {
        setmodalMessage(response.data.message);
        setIsModalActive(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateSubBranchId = async () => {
    console.log("Updating email...");
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/branchCoordinator/updateSubBranchCoordId`,
        {
          newEmail,
          oldEmail: subDepEmail,
        }
      );

      if (response.data.status) {
        console.log("Updated email");
        setSubDepEmail(newEmail);
        setnewEmail("");
        setmodalMessage(response.data.message);
        setIsModalActive(true);
      } else {
        setmodalMessage(response.data.message);
        setIsModalActive(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateSubBranchPincodes = async () => {
    console.log("Updating pincodes...");
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/branchCoordinator/updateSubBranchCoordPincodes`,
        {
          newPincodes,
          email: subDepEmail,
          oldValue : subDepPincodes
        }
      );

      if (response.data.status) {
        console.log("Updated pincodes");
        setSubDepPincodes(newPincodes);
        setnewPincodes("");
        setmodalMessage(response.data.message);
        setIsModalActive(true);
      } else {
        setmodalMessage(response.data.message);
        setIsModalActive(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNameUPdatePress = (caseType) => {
    switch (caseType) {
      case "name":
        if (validate("name")) {
          updateSubBranchCoordName();
        }
        break;

      case "email":
        if (validate("email")) {
          updateSubBranchId();
        }
        break;

      case "pincodes":
        if (validate("pincodes")) {
          updateSubBranchPincodes();
        }
        break;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: currentColors.backgroundDarker,
      }}>
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
                  setnewSubDepCoordName("");
                  setnewPincodes("");
                  setnewEmail("");
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

      <View
        style={{
          width: "100%",
          backgroundColor: currentColors.background,
          paddingTop: insets.top + 10,
          paddingBottom: 10,
        }}>
        <View
          style={{
            width: "100%",
            backgroundColor: currentColors.background,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ position: "absolute", left: 10, padding: 10 }}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={currentColors.secondary}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, color: currentColors.secondary }}>
            Manage Sub Branch Cooridnator
          </Text>
        </View>
      </View>

      {depId && depName && name && pincodes && id && (
        <ScrollView contentContainerStyle={{ flex: 1, padding: 20, gap: 20 }}>
          <View style={{ width: "100%", gap: 10 }}>
            <Text style={{ color: currentColors.text }}>
              Name of the Sub Branch Coordinator
            </Text>

            <View
              style={{
                width: "100%",
                backgroundColor: currentColors.background,
                padding: 5,
                borderRadius: 10,
              }}>
              <TextInput
                value={newSubDepCoordName}
                placeholder={subDepCoordName}
                placeholderTextColor={currentColors.textShade}
                onChangeText={(text) => setnewSubDepCoordName(text)}
                style={{ color: currentColors.text }}
              />
            </View>
            {errors.name && <Text style={{ color: "red" }}>{errors.name}</Text>}
            {newSubDepCoordName != "" && (
              <View
                style={{
                  width: "100%",
                  padding: 10,
                  flexDirection: "row",
                  justifyContent: "flex-end",

                  gap: 10,
                }}>
                <TouchableOpacity
                  onPress={() => handleNameUPdatePress("name")}
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
                    setnewSubDepCoordName("");
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

          <View style={{ width: "100%", gap: 10 }}>
            <Text style={{ color: currentColors.text }}>Email</Text>

            <View
              style={{
                width: "100%",
                backgroundColor: currentColors.background,
                padding: 5,
                borderRadius: 10,
              }}>
              <TextInput
                value={newEmail}
                placeholder={subDepEmail}
                placeholderTextColor={currentColors.textShade}
                onChangeText={(text) => {
                  setnewEmail(text);
                }}
                style={{ color: currentColors.text }}></TextInput>
            </View>
            {errors.email && (
              <Text style={{ color: "red" }}>{errors.email}</Text>
            )}
            {newEmail != "" && (
              <View
                style={{
                  width: "100%",
                  padding: 10,
                  flexDirection: "row",
                  justifyContent: "flex-end",

                  gap: 10,
                }}>
                <TouchableOpacity
                  onPress={() => handleNameUPdatePress("email")}
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
                    setnewEmail("");
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
          <View style={{ width: "100%", gap: 10 }}>
            <Text style={{ color: currentColors.text }}>
              Pincodes (Add separated by comma)
            </Text>

            <View
              style={{
                width: "100%",
                backgroundColor: currentColors.background,
                padding: 5,
                borderRadius: 10,
              }}>
              <TextInput
                value={newPincodes}
                placeholder={subDepPincodes}
                placeholderTextColor={currentColors.textShade}
                keyboardType="phone-pad"
                onChangeText={(text) => {
                  setnewPincodes(text);
                }}
                style={{ color: currentColors.text }}></TextInput>
            </View>
            {errors.pincode && (
              <Text style={{ color: "red" }}>{errors.pincode}</Text>
            )}
            {newPincodes != "" && (
              <View
                style={{
                  width: "100%",
                  padding: 10,
                  flexDirection: "row",
                  justifyContent: "flex-end",

                  gap: 10,
                }}>
                <TouchableOpacity
                  onPress={() => handleNameUPdatePress("pincodes")}
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
                    setnewEmail("");
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
        </ScrollView>
      )}
    </View>
  );
};
export default EditSubDepCoordinator;

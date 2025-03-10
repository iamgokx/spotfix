import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import governmentLogo from "../../assets/images/admin/governmentLogo.png";

import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useState, useEffect } from "react";
import { getStoredData } from "@/hooks/useJwt";
const UserSubscriptions = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [citizenId, setCitizenId] = useState(null);
  const [departments, setDepartments] = useState([
    { department: "Public Works Department (PWD)", status: "Subscribe" },
    { department: "Electricity Department", status: "Subscribe" },
    {
      department: "Municipal Administration (Urban Development)",
      status: "Subscribe",
    },
    { department: "Department of Water Resources", status: "Subscribe" },
    { department: "Department of Health", status: "Subscribe" },
    { department: "Department of Transport", status: "Subscribe" },
    {
      department: "Department of Environment and Forests",
      status: "Subscribe",
    },
    { department: "Department of Tourism", status: "Subscribe" },
    { department: "Department of Rural Development", status: "Subscribe" },
    { department: "Department of Agriculture", status: "Subscribe" },
    { department: "Department of Social Welfare", status: "Subscribe" },
  ]);

  const handleSubscribeButtonPress = async (status, department) => {
    try {
      const email = await getUserDetailsFromStorage();
      let citizenIdToUse = citizenId; 

      if (!citizenId) {
        console.warn("Citizen ID not found, fetching from backend...");

        const response = await axios.post(
          `http://${API_IP_ADDRESS}:8000/api/users/getCitizenId`,
          {
            email: email,
          }
        );

        if (response.data.status) {
          citizenIdToUse = response.data.id; 
          setCitizenId(response.data.id); 
          console.log("Citizen ID retrieved:", response.data.id);
        } else {
          console.error("Failed to fetch Citizen ID");
          return;
        }
      }

      if (status === "Subscribed") {
        console.log("Unsubscribing...");

        const response = await axios.post(
          `http://${API_IP_ADDRESS}:8000/api/users/unSubscribe`,
          {
            citizenId: citizenIdToUse, 
            department: department,
          }
        );

        if (response.data.status) {
          console.log("Unsubscribed successfully!");
          getSubscriptionStatus();
        } else {
          console.error("Failed to unsubscribe:", response.data.message);
        }
      } else {
        console.log("Subscribing...");

        const response = await axios.post(
          `http://${API_IP_ADDRESS}:8000/api/users/subscribe`,
          {
            citizenId: citizenIdToUse, 
            department: department,
          }
        );

        if (response.data.success) {
          console.log("Subscribed successfully!");
          getSubscriptionStatus();
        } else {
          console.error("Failed to subscribe:", response.data.message);
        }
      }
    } catch (error) {
      console.error("Error handling subscription:", error);
    }
  };

  const getUserDetailsFromStorage = async () => {
    const user = await getStoredData();
    const userEmail = user.email;
    return userEmail;
  };

  //function to update subscription status in front end

  const updateSubscriptionStatus = (subscriptions) => {
    if (!subscriptions || subscriptions.length === 0) {
      return (
        departments?.map((dept) => ({
          ...dept,
          department_id: null,
          status: "Unsubscribed",
        })) || []
      );
    }

    setCitizenId(subscriptions[0].citizen_id);

    const subscribedDepartmentMap = new Map(
      subscriptions.map((sub) => [sub.department_name, sub.department_id])
    );

    return departments.map((dept) => ({
      ...dept,
      department_id: subscribedDepartmentMap.get(dept.department) || null,
      status: subscribedDepartmentMap.has(dept.department)
        ? "Subscribed"
        : "Unsubscribed",
    }));
  };

  //function to get subscription from backend

  const getSubscriptionStatus = async () => {
    try {
      const userEmail = await getUserDetailsFromStorage();

      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/users/getUserSubscriptions`,
        { user: userEmail }
      );

      if (response.data.status && response.data.results.length > 0) {
        console.log(
          "this is your results for subscriptions",
          response.data.results
        );

        const updatedDepartments = updateSubscriptionStatus(
          response.data.results
        );
        console.log(updatedDepartments);

        setDepartments(updatedDepartments);
      } else {
        console.log("no data received, marking all as unsubscribed");

        setDepartments(
          departments?.map((dept) => ({
            ...dept,
            department_id: null,
            status: "Unsubscribed",
          })) || []
        );
      }
    } catch (error) {
      console.error("Error fetching subscription status:", error);
    }
  };

  useEffect(() => {
    getSubscriptionStatus();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: currentColors.backgroundDarker }}>
      <View
        style={{
          position: "relative",

          paddingTop: insets.top + 10,
          backgroundColor: currentColors.background,
          paddingBottom: 10,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}>
          <Ionicons
            onPress={() => router.back()}
            name="chevron-back-outline"
            size={24}
            color={currentColors.secondary}
            style={{ position: "absolute", left: 10 }}
          />
          <Text
            style={{
              color: currentColors.secondary,
              fontSize: 20,
              fontWeight: 600,
            }}>
            Subscriptions
          </Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 10, paddingTop: 40 }}>
        <Text
          style={{
            color: currentColors.textShade,
            fontSize: 20,
            width: "100%",
            textAlign: "center",
          }}>
          Your Department Subscriptions
        </Text>
        {departments
          .filter((dep) => dep.status === "Subscribed")
          .map((dep, index) => (
            <View
              style={{
                width: "100%",
                marginTop: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                position: "relative",
              }}
              key={index + "dep"}>
              <Image
                source={governmentLogo}
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: "white",
                  borderRadius: 50,
                }}
              />

              <Text style={{ color: currentColors.text, width: "50%" }}>
                {dep.department}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  handleSubscribeButtonPress(dep.status, dep.department)
                }
                style={{
                  right: 10,
                  position: "absolute",
                  width: "30%",
                }}>
                <Text
                  style={{
                    backgroundColor:
                      dep.status == "Subscribed"
                        ? currentColors.secondary
                        : currentColors.primary,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    borderRadius: 30,
                    color: "white",
                    textAlign: "center",
                  }}>
                  {dep.status}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

        <View
          style={{
            flex: 1,
            marginTop: 60,
            paddingBottom: 60,
          }}>
          <Text
            style={{
              color: currentColors.secondary,
              marginBottom: 20,
              paddingLeft: 10,
            }}>
            {departments.filter((dep) => dep.status === "Unsubscribed")
              .length === 0
              ? "No More Department Subscription Left"
              : "More"}
          </Text>

          {departments
            .filter((dep) => dep.status === "Unsubscribed")
            .map((dep, index) => (
              <View
                style={{
                  width: "100%",
                  marginTop: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  position: "relative",
                }}
                key={index + "dep"}>
                <Image
                  source={governmentLogo}
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: "white",
                    borderRadius: 50,
                  }}
                />

                <Text style={{ color: currentColors.text, width: "50%" }}>
                  {dep.department}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    handleSubscribeButtonPress(dep.status, dep.department)
                  }
                  style={{
                    right: 10,
                    position: "absolute",
                    width: "30%",
                  }}>
                  <Text
                    style={{
                      backgroundColor:
                        dep.status == "Subscribed"
                          ? currentColors.secondary
                          : currentColors.primary,
                      paddingHorizontal: 15,
                      paddingVertical: 10,
                      borderRadius: 30,
                      color: "white",
                      textAlign: "center",
                    }}>
                    {dep.status}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};
export default UserSubscriptions;

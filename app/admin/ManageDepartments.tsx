import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import governmentLogo from "../../assets/images/admin/governmentLogo.png";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useState, useEffect } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
const ManageDepartments = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;

  const getDepartmentData = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/admin/getDepartmentsData`
      );
      if (response.data) {
        setDepartmentData(response.data);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  useEffect(() => {
    getDepartmentData();
  }, []);

  return (
    <View style={[styles.container]}>
      {departmentData.length > 0 ? (
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          {departmentData.map((department, index) => (
            <View key={index} style={styles.departmentContainer}>
              <Image source={governmentLogo} style={styles.logo} />

              <View style={{ width: "80%" }}>
                <Text style={styles.departmentName}>
                  {department.department_name}
                </Text>
                <Text style={styles.departmentInfo}>
                  Coordinator Name: {department.full_name}
                </Text>
                <Text style={styles.departmentInfo}>
                  State: {department.state}
                </Text>
                <View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      backgroundColor: "red",
                      gap : 20
                    }}>
                    <TouchableOpacity style={{display : 'flex', flexDirection : 'row', justifyContent : 'center', alignItems : 'center', gap : 5}}>
                      <Feather name="edit-2" size={20} /> <Text>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{display : 'flex', flexDirection : 'row', justifyContent : 'center', alignItems : 'center', gap : 5}}>
                      <Feather name="trash-2" size={20} />
                      <Text>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text>Loading data...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",

    paddingBottom: 20,
  },
  departmentContainer: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    marginVertical: 8,
    borderRadius: 20,
    width: "90%",
    alignItems: "flex-start",
    elevation: 10,
    flexDirection: "row",
    gap: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  departmentName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  departmentInfo: {
    fontSize: 14,
    color: "#555",
  },
});

export default ManageDepartments;

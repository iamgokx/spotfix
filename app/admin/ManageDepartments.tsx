import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import governmentLogo from "../../assets/images/admin/governmentLogo.png";
import Fuse from "fuse.js";

//TODO this page onlyw swaps the department coordintor
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useState, useEffect } from "react";
import axios from "axios";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import blueGradient from "../../assets/images/gradients/bluegradient.png";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSearch } from "@/context/adminSearchContext";

const ManageDepartments = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { searchValue, setSearchValue } = useSearch();
  const insets = useSafeAreaInsets();
  const router = useRouter();

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

  useEffect(() => {
    const searchTerm = searchValue.trim();

    const options = {
      keys: Object.keys(departmentData[0] || {}),
      threshold: 0.3,
      minMatchCharLength: 2,
      findAllMatches: true,
    };

    const fuse = new Fuse(departmentData, options);

    const filteredResults =
      searchTerm.length < 2
        ? departmentData
        : fuse.search(searchTerm).map((result) => result.item);

    setFilteredDepartments(filteredResults);
  }, [searchValue, departmentData]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentColors.backgroundDarkest },
      ]}>
      <ImageBackground source={blueGradient} style={styles.addButtonContainer}>
        <TouchableOpacity
          onPress={() => Alert.alert("Add new department pressed")}>
          <Ionicons name="add" size={37} color={"white"} />
        </TouchableOpacity>
      </ImageBackground>

      <ScrollView
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer(insets.bottom)}>
        {searchValue != "" && (
          <View
            style={{
              width: "90%",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}>
            <Ionicons name="filter" size={24} color={currentColors.secondary} />
            <Text
              style={{
                color: "white",
                fontSize: 20,
                backgroundColor: currentColors.background,
                paddingHorizontal: 10,
                borderRadius: 50,
              }}>
              {searchValue}
            </Text>
            <TouchableOpacity onPress={() => setSearchValue("")}>
              <Ionicons
                color={currentColors.secondary}
                name="close"
                size={24}
              />
            </TouchableOpacity>
          </View>
        )}
        {(filteredDepartments.length > 0
          ? filteredDepartments
          : departmentData
        ).map((department, index) => (
          <View
            key={index}
            style={[
              styles.departmentContainer,
              { backgroundColor: currentColors.backgroundDarker },
            ]}>
            <Image source={governmentLogo} style={styles.logo} />
            <View style={{ width: "80%" }}>
              <Text
                style={[styles.departmentName, { color: currentColors.text }]}>
                {department.department_name}
              </Text>
              <Text
                style={[
                  styles.departmentInfo,
                  { color: currentColors.textShade },
                ]}>
                Coordinator Name: {department.full_name}
              </Text>
              <Text
                style={[
                  styles.departmentInfo,
                  { color: currentColors.textShade },
                ]}>
                State: {department.state}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/screens/EditDepartments",
                    params: { department: department.department_name },
                  })
                }
                style={styles.editButton}>
                <Feather
                  name="edit-2"
                  size={20}
                  color={currentColors.secondary}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  departmentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginVertical: 8,
    borderRadius: 20,
    width: "90%",
    flexDirection: "row",
    alignItems: "flex-start",
    elevation: 10,
    gap: 10,
  },
  logo: { width: 60, height: 60, backgroundColor: "white", borderRadius: 80 },
  departmentName: { fontSize: 18, fontWeight: "bold" },
  departmentInfo: { fontSize: 14 },
  editButton: { width: "100%", alignItems: "flex-end" },
  addButtonContainer: {
    padding: 10,
    borderRadius: 60,
    overflow: "hidden",
    position: "absolute",
    zIndex: 5,
    bottom: 15,
    right: 15,
  },
  scrollContainer: (bottomInset) => ({
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: bottomInset + 100,
    paddingTop: 8,
  }),
});

export default ManageDepartments;

import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  RefreshControl,
} from "react-native";
import governmentLogo from "../../assets/images/admin/governmentLogo.png";
import Fuse from "fuse.js";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import blueGradient from "../../assets/images/gradients/bluegradient.png";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSearch } from "@/context/adminSearchContext";
import * as Animatable from "react-native-animatable";

const ManageDepartments = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getDepartmentData();
    setRefreshing(false);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: currentColors.backgroundDarkest,
      }}>
      <ImageBackground
        source={blueGradient}
        style={{
          padding: 10,
          borderRadius: 60,
          overflow: "hidden",
          position: "absolute",
          zIndex: 5,
          bottom: 15,
          right: 15,
        }}>
        <TouchableOpacity
          onPress={() =>
            router.push("/addBranchCoordinator/adminaddBranchCoordinator")
          }>
          <Ionicons name="add" size={37} color={"white"} />
        </TouchableOpacity>
      </ImageBackground>
      {searchValue !== "" && (
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
            <Ionicons color={currentColors.secondary} name="close" size={24} />
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={
          filteredDepartments.length > 0 ? filteredDepartments : departmentData
        }
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Animatable.View
            animation={"fadeInLeft"}
            delay={50 + index * 50}
            style={{
              paddingVertical: 20,
              paddingHorizontal: 10,
              marginVertical: 8,
              borderRadius: 20,
              width: "90%",
              flexDirection: "row",
              alignItems: "flex-start",
              elevation: 10,
              gap: 10,
              backgroundColor: currentColors.backgroundDarker,
            }}>
            <Image
              source={governmentLogo}
              style={{
                width: 60,
                height: 60,
                backgroundColor: "white",
                borderRadius: 80,
              }}
            />
            <View style={{ width: "90%" }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: currentColors.text,
                }}>
                {item.department_name}
              </Text>
              <Text style={{ fontSize: 14, color: currentColors.textShade }}>
                Coordinator Name: {item.full_name}
              </Text>
              <Text style={{ fontSize: 14, color: currentColors.textShade }}>
                State: {item.state}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/screens/EditDepartments",
                    params: { department: item.department_name },
                  })
                }
                style={{ width: "100%", alignItems: "flex-end" }}>
                <Feather
                  name="edit-2"
                  size={20}
                  color={currentColors.secondary}
                />
              </TouchableOpacity>
            </View>
          </Animatable.View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: insets.bottom + 100,
          paddingTop: 8,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ManageDepartments;

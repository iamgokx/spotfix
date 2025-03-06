import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import governmentLogo from "../../assets/images/profile/defaultProfile.jpeg";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useState, useEffect } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Fuse from "fuse.js";
import { useSearch } from "@/context/adminSearchContext";
const ManageCitizens = () => {
  const [citizenData, setcitizenData] = useState([]);
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { searchValue, setSearchValue } = useSearch();
  const [filteredCitizens, setFilteredCitizens] = useState([]);

  const getCitizens = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/admin/getCitizens`
      );
      if (response.data) {
        setcitizenData(response.data);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  useEffect(() => {
    getCitizens();
  }, []);

  useEffect(() => {
    const searchTerm = searchValue.trim();

    const options = {
      keys: Object.keys(citizenData[0] || {}),
      threshold: 0.3,
      minMatchCharLength: 2,
      findAllMatches: true,
    };

    const fuse = new Fuse(citizenData, options);

    const filteredResults =
      searchTerm.length < 2
        ? citizenData
        : fuse.search(searchTerm).map((result) => result.item);

    setFilteredCitizens(filteredResults);
  }, [searchValue, citizenData]);

  const router = useRouter();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentColors.backgroundDarkest },
      ]}>
      {citizenData.length > 0 ? (
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          {(filteredCitizens.length > 0 ? filteredCitizens : citizenData).map(
            (citizen, index) => (
              <View
                key={index}
                style={[
                  styles.departmentContainer,
                  { backgroundColor: currentColors.backgroundDarker },
                ]}>
                <Image
                  source={{
                    uri: `http://${API_IP_ADDRESS}:8000/uploads/profile/${citizen.picture_name}`,
                  }}
                  style={[
                    styles.logo,
                    { backgroundColor: "white", borderRadius: 80 },
                  ]}
                />

                <View style={{ width: "80%" }}>
                  <Text
                    style={[
                      styles.citizenInfo,
                      { color: currentColors.secondary, fontSize: 20 },
                    ]}>
                    Citizen Name : {citizen.full_name}
                  </Text>
                  <Text
                    style={[
                      styles.citizenInfo,
                      { color: currentColors.textShade },
                    ]}>
                    Email : {citizen.email}
                  </Text>
                  <Text
                    style={[
                      styles.citizenInfo,
                      { color: currentColors.textShade },
                    ]}>
                    Phone Number : {citizen.phone_number}
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      router.push({
                        pathname: "/screens/ManageCitizensDetailed",
                        params : {email : citizen.email},
                      });
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}>
                    <Feather
                      style={styles.editBtn}
                      name="edit-2"
                      size={20}
                      color={currentColors.secondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )
          )}
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

    // paddingVertical: 30,
  },
  departmentContainer: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginVertical: 8,
    borderRadius: 20,
    width: "90%",
    alignItems: "flex-start",
    elevation: 10,
    flexDirection: "row",
    gap: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
    objectFit: "contain",
  },
  departmentName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  citizenInfo: {
    fontSize: 14,
    color: "#555",
  },
  editBtn: {},
});

export default ManageCitizens;

import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { Colors } from "@/constants/Colors";
import * as Animatable from "react-native-animatable";
import { useColorScheme } from "react-native";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSearch } from "@/context/adminSearchContext";
import { getStoredData } from "@/hooks/useJwt";
import Fuse from "fuse.js";
import background from "../../assets/images/gradients/bluegradient.png";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "@/components/branchCoordinators/CustomHeader";
import watermark from "../../assets/images/watermark.png";
// import SendNotification from "@/components/SendNotification";
const ManageSubBranchCoordinators = () => {
  const [subBranchCoordinatorData, setsubBranchCoordinatorData] = useState([]);
  const router = useRouter();
  const [filteredCitizens, setFilteredCitizens] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { searchValue } = useSearch();
  const insets = useSafeAreaInsets();

  const getAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            "User-Agent": "spotfix/1.0 (lekhwargokul84.com)",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.log("Error geocoding address: ", error);
    }
  };

  const getSubBranchCoordinators = async () => {
    setRefreshing(true);
    setLoading(true);

    try {
      const user = await getStoredData();
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/branchCoordinator/getSubBranchCoordinators`,
        { email: user.email }
      );

      if (response.data.status && response.data.results.length > 0) {
        console.log(
          "sub dep coordinators fetched:",
          JSON.stringify(response.data.results, null, 2)
        );
        setsubBranchCoordinatorData(response.data.results);
      } else {
        console.log("No sub dep coordinators found");
        setsubBranchCoordinatorData([]);
      }
    } catch (error) {
      console.log("Error fetching subscribers:", error);
      setsubBranchCoordinatorData([]);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubBranchCoordinators();
  }, []);

  useEffect(() => {
    if (searchValue.trim().length < 2) {
      setFilteredCitizens(subBranchCoordinatorData);
    } else {
      const fuse = new Fuse(subBranchCoordinatorData, {
        keys: ["full_name", "locality", "pincode"],
        threshold: 0.3,
      });
      setFilteredCitizens(
        fuse.search(searchValue).map((result) => result.item)
      );
    }
  }, [searchValue, subBranchCoordinatorData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options).replace(",", "");
  };

  const renderItem = ({ item, index }) => {
    let delay = 50 * index + 100;

    return (
      <Animatable.View
        animation={"fadeInUp"}
        delay={delay}
        style={[
          styles.departmentContainer,
          { backgroundColor: currentColors.backgroundDarker },
        ]}>
        <View style={{ width: "95%" }}>
          <Text
            style={[
              styles.citizenInfo,
              { color: currentColors.secondary, fontSize: 20 },
            ]}>
            Name: {item.full_name}
          </Text>
          <Text
            style={[styles.citizenInfo, { color: currentColors.textShade }]}>
            Email : {item.sub_department_coordinator_id}
          </Text>
          <Text
            style={[styles.citizenInfo, { color: currentColors.textShade }]}>
            Pincodes : {item.pincodes}
          </Text>

          <Text
            style={[styles.citizenInfo, { color: currentColors.secondary }]}>
            {item.department_name}
          </Text>

          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/screens/EditSubDepCoordinator",
                params: {
                  depId: item.department_id,
                  depName: item.department_name,
                  name: item.full_name,
                  pincodes: item.pincodes,
                  id: item.sub_department_coordinator_id,
                  phonenumber : item.phone_number
                },
              });
            }}
            style={{
              width: 50,
              alignItems: "center",
              alignSelf: "flex-end",
              padding: 10,
            }}>
            <Ionicons
              name="create-outline"
              size={24}
              color={currentColors.secondary}
            />
          </TouchableOpacity>
        </View>
      </Animatable.View>
    );
  };

  const [userEmail, setuserEmail] = useState("");
  useEffect(() => {
    const getUser = async () => {
      const user = await getStoredData();
      const email = user.email;
      setuserEmail(email);
    };
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: currentColors.backgroundDarkest,

          position: "relative",
        },
      ]}>
      <CustomHeader title="Manage Sub Branch" />

      
      <ImageBackground
        source={background}
        style={{
          borderRadius: 50,
          overflow: "hidden",
          position: "absolute",
          bottom: insets.bottom + 15,
          right: insets.bottom + 15,
          padding: 10,
          zIndex: 2,
        }}>
        <TouchableOpacity
          onPress={() =>
            router.push("/manageSubBranch/AddNewSubBranchCoordinator")
          }>
          <Ionicons name="add" size={37} color={"white"} />
        </TouchableOpacity>
      </ImageBackground>

      {loading ? (
        <Text style={styles.loadingText}>Loading data...</Text>
      ) : subBranchCoordinatorData.length === 0 ? (
        <Text style={styles.noDataText}>No subscribers found</Text>
      ) : (
        <FlatList
          data={filteredCitizens}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
          ListFooterComponent={
            <Animatable.View
              animation={"fadeInUp"}
              style={{
                marginTop: 100,
                paddingBottom: insets.bottom + 20,
                gap: 10,
              }}>
              <Image
                source={watermark}
                style={{ width: 300, height: 100, objectFit: "contain" }}
              />
            </Animatable.View>
          }
          style={{ zIndex: 1, paddingTop: 10 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={getSubBranchCoordinators}
            />
          }
          ListEmptyComponent={
            filteredCitizens.length === 0 && searchValue.length > 1 ? (
              <Text style={styles.noDataText}>No results found</Text>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  departmentContainer: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    marginBottom: 10,
    borderRadius: 20,
    width: "100%",
    elevation: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 60,
    height: 60,
    objectFit: "contain",
  },
  citizenInfo: {
    fontSize: 14,
    color: "#555",
  },
  loadingText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  noDataText: {
    fontSize: 18,
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ManageSubBranchCoordinators;

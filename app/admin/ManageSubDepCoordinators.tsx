import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Modal,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import * as Animatable from "react-native-animatable";
import { Feather } from "@expo/vector-icons";
import Fuse from "fuse.js";
import { useSearch } from "@/context/adminSearchContext";

const ManageSubDepCoordinators = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSSubCoordinator, setSelectedSSubCoordinator] = useState(null);
  const [departmentSubCoordinatorData, setDepartmentSubCoordinatorData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [addresses, setAddresses] = useState({});
  const { searchValue } = useSearch();
  const [filteredSubDepartmentCoordinator, setFilteredDepCoordinator] = useState([]);

  const handleDeletePress = (coordinator) => {
    setSelectedSSubCoordinator(coordinator);
    setModalVisible(true);
  };

  const confirmDelete = () => {
    console.log(`Deleted: ${selectedSSubCoordinator.full_name}`);
    setModalVisible(false);
  };

  const getDepartmentCoordinators = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/admin/getSubDepartmentCoordinators`
      );

      if (response.data.status) {
        setDepartmentSubCoordinatorData(response.data.results);
      } else {
        setDepartmentSubCoordinatorData([]);
      }
    } catch (error) {
      console.error("Error fetching department coordinators:", error);
    }
  };

  const getAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            "User-Agent": "spotfix/1.0 (lekhwargokul84@gmail.com)",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      return data.display_name || "Unknown Location";
    } catch (error) {
      console.error("Error fetching address:", error.message);
      return "Unknown Location";
    }
  };

  useEffect(() => {
    getDepartmentCoordinators();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getDepartmentCoordinators();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      const addressMap = {};
      for (const coordinator of departmentSubCoordinatorData) {
        addressMap[coordinator.sub_coordinator_email] = await getAddress(
          coordinator.latitude,
          coordinator.longitude
        );
      }
      setAddresses(addressMap);
    };

    if (departmentSubCoordinatorData.length > 0) {
      fetchAddresses();
    }
  }, [departmentSubCoordinatorData]);

  useEffect(() => {
    const searchTerm = searchValue.trim();

    const options = {
      keys: ["full_name", "sub_coordinator_email", "phone_number", "department_name"],
      threshold: 0.3,
      minMatchCharLength: 2,
      findAllMatches: true,
    };

    const fuse = new Fuse(departmentSubCoordinatorData, options);

    const filteredResults =
      searchTerm.length < 2
        ? departmentSubCoordinatorData
        : fuse.search(searchTerm).map((result) => result.item);

    setFilteredDepCoordinator(filteredResults);
  }, [searchValue, departmentSubCoordinatorData]);

  const renderItem = ({ item, index }) => (
    <Animatable.View
      animation="fadeInLeft"
      delay={index * 100}
      style={{
        backgroundColor: currentColors.backgroundLighter,
        padding: 15,
        marginVertical: 10,
        borderRadius: 20,
      }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
        <Text style={{ color: currentColors.secondary, fontSize: 18, fontWeight: "bold" }}>
          {item.full_name}
        </Text>
      </View>

      <Text style={{ color: currentColors.text }}>Email: {item.sub_coordinator_email}</Text>
      <Text style={{ color: currentColors.text }}>Phone: {item.phone_number}</Text>
      <Text style={{ color: currentColors.text }}>Department: {item.department_name}</Text>
      <Text style={{ color: currentColors.text }}>State: {item.state}</Text>
      <Text style={{ color: currentColors.text }}>Address: {addresses[item.sub_coordinator_email] || "Loading..."}</Text>

      <TouchableOpacity style={{ alignItems: "flex-end" }} onPress={() => handleDeletePress(item)}>
        <Feather name="trash" size={24} color={currentColors.secondary} />
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: currentColors.backgroundDarkest, padding: 20 }}>

      
      {departmentSubCoordinatorData.length > 0 ? (
        <FlatList
          data={filteredSubDepartmentCoordinator}
          keyExtractor={(item) => item.sub_coordinator_email}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
          No department coordinators available.
        </Text>
      )}

      <Modal transparent animationType="fade" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: currentColors.background, padding: 20, borderRadius: 20, width: "80%" }}>
            <Text style={{ color: currentColors.secondary, fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
              Are you sure you want to delete this sub department coordinator?
            </Text>

            {selectedSSubCoordinator && (
              <>
                <Text style={{ color: currentColors.text }}>Name: {selectedSSubCoordinator.full_name}</Text>
                <Text style={{ color: currentColors.text }}>Department: {selectedSSubCoordinator.department_name}</Text>
              </>
            )}

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
              <TouchableOpacity style={{ backgroundColor: currentColors.secondary, padding: 10, borderRadius: 10, flex: 1, marginRight: 10, alignItems: "center" }} onPress={confirmDelete}>
                <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ backgroundColor: currentColors.text, padding: 10, borderRadius: 10, flex: 1, alignItems: "center" }} onPress={() => setModalVisible(false)}>
                <Text style={{ color: currentColors.textSecondary, fontWeight: "bold" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ManageSubDepCoordinators;

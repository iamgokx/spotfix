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
import { ScrollView } from "react-native-gesture-handler";
import { useState, useEffect, useCallback } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import Fuse from "fuse.js";
import { useSearch } from "@/context/adminSearchContext";
import { Feather, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as Animatable from 'react-native-animatable'
const ManageDepartmentCoordinators = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCoordinator, setSelectedCoordinator] = useState(null);
  const [departmentCoordinatorData, setDepartmentCoordinatorData] = useState(
    []
  );
  const [refreshing, setRefreshing] = useState(false);
  const { searchValue, setSearchValue } = useSearch();
  const [filteredDepartmentCoordinator, setFilteredDepCoordinator] = useState(
    []
  );

  const handleDeletePress = (coordinator) => {
    setSelectedCoordinator(coordinator);
    setModalVisible(true);
  };

  const confirmDelete = () => {
    console.log(`Deleted: ${selectedCoordinator.full_name}`);
    setModalVisible(false);
  };

  const getDepartmentCoordinators = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/admin/getDepartmentCoordinators`
      );

      if (response.data.status) {
        console.log('get department coordinators data  : ', response.data.results);
        setDepartmentCoordinatorData(response.data.results);
      } else {
        console.log("No data for department coordinators from backend.");
        setDepartmentCoordinatorData([]);
      }
    } catch (error) {
      console.log("Error fetching department coordinators:", error);
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
    const searchTerm = searchValue.trim();

    const options = {
      keys: Object.keys(departmentCoordinatorData[0] || {}),
      threshold: 0.3,
      minMatchCharLength: 2,
      findAllMatches: true,
    };

    const fuse = new Fuse(departmentCoordinatorData, options);

    const filteredResults =
      searchTerm.length < 2
        ? departmentCoordinatorData
        : fuse.search(searchTerm).map((result) => result.item);

    setFilteredDepCoordinator(filteredResults);
  }, [searchValue, departmentCoordinatorData]);

  const renderItem = ({ item }) => {
    const delay =  100
    return (
      <Animatable.View
      animation={'fadeInLeft'}
      delay={delay + 50}
      style={{
        backgroundColor: currentColors.backgroundLighter,
        padding: 15,
        marginVertical: 10,
        borderRadius: 20,
      }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
        <Text
          style={{
            color: currentColors.secondary,
            fontSize: 18,
            fontWeight: "bold",
            marginLeft: 8,
          }}>
          {item.full_name}
        </Text>
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}>
        <Text style={{ color: currentColors.text, marginLeft: 8 }}>
          Email: {item.email}
        </Text>
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}>
        <Text style={{ color: currentColors.text, marginLeft: 8 }}>
          Phone: {item.phone_number}
        </Text>
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}>
        <Text style={{ color: currentColors.text, marginLeft: 8 }}>
          Department: {item.department_name}
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ color: currentColors.text, marginLeft: 8 }}>
          State: {item.state}
        </Text>
      </View>

      {/* <TouchableOpacity
        style={{ alignItems: "flex-end" }}
        onPress={() => handleDeletePress(item)}>
        <Feather
          name="edit"
          size={24}
          color={currentColors.secondary}></Feather>
      </TouchableOpacity> */}
    </Animatable.View>
    )
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: currentColors.backgroundDarkest,
        padding: 20,
      }}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        hidden={false}
        backgroundColor={currentColors.backgroundDarker}
      />
      {departmentCoordinatorData.length > 0 ? (
        <FlatList
        showsVerticalScrollIndicator={false}
          data={filteredDepartmentCoordinator}
          keyExtractor={(item) => item.email}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
          No department coordinators available.
        </Text>
      )}

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <View
            style={{
              backgroundColor: currentColors.background,
              padding: 20,
              borderRadius: 20,
              width: "80%",
            }}>
            <Text
              style={{
                color: currentColors.secondary,
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
              }}>
              Are you sure you want to delete this department coordinator?
            </Text>

            {selectedCoordinator && (
              <>
                <Text style={{ color: currentColors.text }}>
                  Name: {selectedCoordinator.full_name}
                </Text>
                <Text style={{ color: currentColors.text }}>
                  Department: {selectedCoordinator.department_name}
                </Text>
              </>
            )}

     
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: currentColors.secondary,
                  padding: 10,
                  borderRadius: 10,
                  flex: 1,
                  marginRight: 10,
                  alignItems: "center",
                }}
                onPress={confirmDelete}>
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Delete
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: currentColors.text,
                  padding: 10,
                  borderRadius: 10,
                  flex: 1,
                  alignItems: "center",
                }}
                onPress={() => setModalVisible(false)}>
                <Text style={{ color: currentColors.textSecondary, fontWeight: "bold" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ManageDepartmentCoordinators;

import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSearch } from "@/context/adminSearchContext";
import { getStoredData } from "@/hooks/useJwt";
import Fuse from "fuse.js";
import {} from "@expo/vector-icons";
const Subscribers = () => {
  const [subscribersData, setSubscribersData] = useState([]);
  const [filteredCitizens, setFilteredCitizens] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { searchValue } = useSearch();

  const getSubscribers = async () => {
    setRefreshing(true);
    setLoading(true);

    try {
      const user = await getStoredData();
      console.log("this is user email - ", user.email);
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/branchCoordinator/getSubscribers`,
        { email: user.email }
      );

      if (response.data.status && response.data.results.length > 0) {
        console.log("Subscribers fetched:", response.data.results);
        setSubscribersData(response.data.results);
      } else {
        console.log("No subscribers found");
        setSubscribersData([]);
      }
    } catch (error) {
      console.log("Error fetching subscribers:", error);
      setSubscribersData([]);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubscribers();
  }, []);

  useEffect(() => {
    if (searchValue.trim().length < 2) {
      setFilteredCitizens(subscribersData);
    } else {
      const fuse = new Fuse(subscribersData, {
        keys: ["full_name", "locality", "pincode"],
        threshold: 0.3,
      });
      setFilteredCitizens(
        fuse.search(searchValue).map((result) => result.item)
      );
    }
  }, [searchValue, subscribersData]);

  const handleRefresh = useCallback(() => {
    getSubscribers();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options).replace(",", "");
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.subscriberContainer,
        { backgroundColor: currentColors.backgroundDarker },
      ]}>
      <Image
        source={{
          uri: `http://${API_IP_ADDRESS}:8000/uploads/profile/${item.picture_name}`,
        }}
        style={styles.logo}
      />

      <View style={styles.subscriberDetails}>
        <Text
          style={[
            styles.citizenInfo,
            { color: currentColors.secondary, fontSize: 18 },
          ]}>
          {item.full_name}
        </Text>
        <Text style={[styles.citizenInfo, { color: currentColors.textShade }]}>
          📧 {item.email}
        </Text>
        <Text style={[styles.citizenInfo, { color: currentColors.textShade }]}>
          📍 {item.locality}, {item.pincode}
        </Text>
        <Text style={[styles.citizenInfo, { color: currentColors.textShade }]}>
          🗓 Joined: {formatDate(item.registration_date_time)}
        </Text>
        <Text style={[styles.citizenInfo, { color: currentColors.secondary }]}>
          📞 +91 {item.phone_number}
        </Text>
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentColors.backgroundDarkest },
      ]}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={currentColors.secondary}
          style={{ marginTop: 20 }}
        />
      ) : subscribersData.length === 0 ? (
        <Text style={styles.noDataText}>No subscribers found</Text>
      ) : (
        <FlatList
          data={filteredCitizens}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
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
    alignItems: "center",
    paddingTop: 10,
  },
  subscriberContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 12,
    marginBottom: 10,
    borderRadius: 15,
    width: "95%",
    alignSelf: "center",
    elevation: 5,
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  subscriberDetails: {
    marginLeft: 12,
    width: "80%",
  },
  citizenInfo: {
    fontSize: 14,
    marginBottom: 2,
  },
  noDataText: {
    fontSize: 18,
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Subscribers;

import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useState, useEffect } from "react";
import * as Animatable from "react-native-animatable";
import watermark from "../../assets/images/watermark.png";
import { router } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import socket from "@/hooks/useSocket";
import { Picker } from "@react-native-picker/picker";
import { getStoredData } from "@/hooks/useJwt";

const UserSubscriptionAnnouncements = () => {
  const colorTheme = useColorScheme();
  const currentColors = colorTheme == "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [announcementsData, setAnnouncementsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mediaFiles, setMediaFiles] = useState({});
  const [emergencyAnnouncements, setEmergencyAnnouncements] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTaluka, setSelectedTaluka] = useState("");
  const [selectedType, setselectedType] = useState("");
  const [filterOpen, setfilterOpen] = useState(false);

  const [userSubscriptions, setuserSubscriptions] = useState();

  const goaData = {
    "North Goa": [
      "Bardez",
      "Bicholim",
      "Pernem",
      "Ponda",
      "Sattari",
      "Tiswadi",
    ],
    "South Goa": [
      "Canacona",
      "Mormugao",
      "Quepem",
      "Salcete",
      "Sanguem",
      "Dharbandora",
    ],
  };

  const districtOptions = ["All", ...Object.keys(goaData)];

  function splitTargetLocation(target_locations) {
    if (target_locations.toLowerCase() === "all - all") {
      return { district: "All", taluka: "All" };
    }

    const [district, taluka] = target_locations
      .split(" - ")
      .map((s) => s.trim());

    return { district, taluka };
  }

  const getAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/announcements/getAnnouncements`
      );

      // console.log("API Response:", response.data);

      if (response.data.status && Array.isArray(response.data.results)) {
        const sortedData = [...response.data.results].sort((a, b) =>
          b.date_time_created.localeCompare(a.date_time_created)
        );

        setAnnouncementsData(sortedData);

        const emergencyData = sortedData.filter(
          (item) => item.announcement_type === "emergency"
        );
        setEmergencyAnnouncements(emergencyData);
      } else {
        setAnnouncementsData([]);
        console.log("No announcements received.");
      }
    } catch (error) {
      console.log("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnnouncements();
    getUserSubscriptions();
    getDepartmentList();
  }, []);

  useEffect(() => {
    if (announcementsData?.length > 0) {
      const imageExtensions = ["jpg", "jpeg", "png"];
      const extractedMediaFiles = {};

      announcementsData.forEach((item) => {
        if (item.media_links && typeof item.media_links === "string") {
          const mediaArray = item.media_links.split(",");
          const firstImage = mediaArray.find((link) => {
            const fileExtension = link.split(".").pop().toLowerCase();
            return imageExtensions.includes(fileExtension);
          });

          if (firstImage) {
            extractedMediaFiles[item.announcement_id] = firstImage;
          }
        }
      });

      setMediaFiles(extractedMediaFiles);
      console.log("Updated Media Files:", extractedMediaFiles);
    }
  }, [announcementsData]);

  const timeAgo = (timestamp) => {
    const currentTime = new Date();
    const pastTime = new Date(timestamp);
    const timeDifference = Math.floor((currentTime - pastTime) / 1000);

    if (timeDifference < 60) return `${timeDifference} seconds ago`;
    if (timeDifference < 3600)
      return `${Math.floor(timeDifference / 60)} minutes ago`;
    if (timeDifference < 86400)
      return `${Math.floor(timeDifference / 3600)} hours ago`;
    if (timeDifference < 2592000)
      return `${Math.floor(timeDifference / 86400)} days ago`;
    if (timeDifference < 31536000)
      return `${Math.floor(timeDifference / 2592000)} months ago`;

    return `${Math.floor(timeDifference / 31536000)} years ago`;
  };

  const [searchQuery, setSearchQuery] = useState("");

  const subscribedDepartmentIds = userSubscriptions?.map(
    (sub) => sub.department_id
  );

  const filteredData = announcementsData?.filter((item) => {
    const location = splitTargetLocation(item.target_locations);

    const matchesDepartment = subscribedDepartmentIds?.includes(
      item.department_id
    );
    const matchesDistrict = selectedDistrict
      ? location.district === selectedDistrict
      : true;
    const matchesTaluka = selectedTaluka
      ? location.taluka === selectedTaluka
      : true;
    const matchesSearchQuery = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return (
      matchesDepartment &&
      matchesDistrict &&
      matchesTaluka &&
      matchesSearchQuery
    );
  });

  const renderItem = ({ item }) => {
    const image = mediaFiles[item.announcement_id];

    const time = timeAgo(item.date_time_created);
    const description = item.announcement_description;
    const shortDesc =
      description.length > 40 ? description.slice(0, 80) + "..." : description;

    let delay = 50;

    const location = splitTargetLocation(item.target_locations);

    return (
      <Animatable.View
        animation="fadeInUp"
        delay={delay + 50}
        style={{
          marginBottom: 10,
          padding: 10,
          borderRadius: 20,
          overflow: "hidden",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 10,
        }}>
        {image && (
          <Image
            source={{
              uri: `http://${API_IP_ADDRESS}:8000/uploads/govAnnouncementMedia/${image}`,
            }}
            style={{ width: "30%", aspectRatio: 1, borderRadius: 20 }}
          />
        )}
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/branchAnnouncement/DetailedAnnouncement",
              params: { announcement_id: item.announcement_id },
            });
          }}
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            width: "69%",
            height: "100%",
            position: "relative",
          }}>
          <Text style={{ color: currentColors.secondary, fontSize: 20 }}>
            {item.title.length > 30
              ? item.title.slice(0, 60) + "..."
              : item.title}
          </Text>
          <Text style={{ color: currentColors.textShade, fontWeight: 800 }}>
            {item.department_name}
          </Text>
          <Text style={{ color: currentColors.textShade, fontWeight: 800 }}>
            {location.district == "All" ? "Goa" : location.district}{" "}
            {location.district != "All" && (
              <Text style={{ color: currentColors.textShade, fontWeight: 800 }}>
                {location.taluka == "All" ? "" : `- ${location.taluka}`}
              </Text>
            )}
          </Text>
          {/* <Text style={{ color: currentColors.text, marginBottom: 5 }}>
            {shortDesc}
          </Text> */}
          <Text
            style={{
              color: currentColors.textShade,
              position: "absolute",
              bottom: 0,
              right: 5,
            }}>
            {time}
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  const [departmentData, setdepartmentData] = useState();

  const getDepartmentList = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/department/getDepartments`
      );

      if (response.data.status) {
        console.log(response.data.results);
        setdepartmentData(response.data.results);
      } else {
        console.log("no departments");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserSubscriptions = async () => {
    const user = await getStoredData();
    const email = user.email;
    console.log('email: ', email);
    console.log('on refresh this ran');
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/announcements/getsubscriptions`,
        {
          email: email,
        }
      );

      if (response.data.status) {
        console.log(response.data.results);
        setuserSubscriptions(response.data.results);
      }
    } catch (error) {
     
      console.log(error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);

    // Reset filter states before fetching data
    setSearchQuery("");
    setSelectedDistrict("");
    setSelectedTaluka("");

    await getAnnouncements(); // Fetch latest announcements
    await getDepartmentList(); // Fetch latest department list
    await getUserSubscriptions(); // Fetch latest subscriptions

    setRefreshing(false);
  };

  return (
    <View style={{ backgroundColor: currentColors.backgroundDarkest, flex: 1 }}>
      <Modal visible={filterOpen} transparent>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <View
            style={{
              backgroundColor: currentColors.background,
              width: "90%",
              borderRadius: 20,
              padding: 10,
              gap: 10,
              borderWidth: 1,
              borderColor: currentColors.textShade,
            }}>
            <TouchableOpacity
              onPress={() => setfilterOpen(false)}
              style={{ alignSelf: "flex-end" }}>
              <Ionicons
                name="close-circle"
                size={24}
                color={currentColors.secondary}
              />
            </TouchableOpacity>

            <View
              style={{
                borderRadius: 20,
                borderWidth: 1,
                borderColor: currentColors.textShade,
              }}>
              <Picker
                selectedValue={selectedDistrict}
                onValueChange={(itemValue) => {
                  setSelectedDistrict(itemValue);
                  setSelectedTaluka("All");
                }}
                dropdownIconColor={currentColors.text}
                style={{ color: currentColors.text }}>
                {districtOptions.map((district) => (
                  <Picker.Item
                    key={district}
                    label={district}
                    value={district}
                  />
                ))}
              </Picker>
            </View>

            {selectedDistrict !== "All" && goaData[selectedDistrict] && (
              <View
                style={{
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: currentColors.textShade,
                }}>
                <Picker
                  selectedValue={selectedTaluka}
                  onValueChange={(itemValue) => setSelectedTaluka(itemValue)}
                  dropdownIconColor={currentColors.text}
                  style={{ color: currentColors.text }}>
                  {["All", ...goaData[selectedDistrict]].map((taluka) => (
                    <Picker.Item key={taluka} label={taluka} value={taluka} />
                  ))}
                </Picker>
              </View>
            )}

            <TouchableOpacity
              onPress={() => {
                setSelectedDepartment("");
                setSelectedDistrict("");
                setSelectedTaluka("");
                setfilterOpen(false);
              }}
              style={{
                backgroundColor: currentColors.secondary,
                borderRadius: 20,
                padding: 10,
                alignItems: "center",
                marginTop: 10,
              }}>
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Reset Filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{}}>
        <Animatable.View
          animation={"fadeInDown"}
          style={{
            width: "100%",
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,

            alignItems: "center",
            justifyContent: "space-around",
            padding: 10,
            flexDirection: "row",

            gap: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              setfilterOpen(true);
            }}>
            <Ionicons name="filter" size={24} color={currentColors.secondary} />
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: currentColors.backgroundLighter,
              width: "90%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 30,
              paddingHorizontal: 10,
              overflow: "hidden",
            }}>
            <TextInput
              style={{ width: "90%", color: currentColors.text }}
              placeholder="Search for an announcement"
              placeholderTextColor={currentColors.textShade}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Ionicons name="search" color={currentColors.secondary} size={24} />
          </View>
        </Animatable.View>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: currentColors.backgroundDarkest,
          padding: 10,
        }}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={currentColors.secondary}
            style={{ marginTop: 20 }}
          />
        ) : announcementsData?.length === 0 ? (
          <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
            No announcements found
          </Text>
        ) : (
          <>
            <View style={{ flexGrow: 1 }}>
              <FlatList
                data={filteredData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                scrollEnabled={true}
                ListHeaderComponent={() => (
                  <View>
                    <Animatable.View
                      animation={"fadeInLeft"}
                      style={{
                        width: "100%",
                        height: 1,
                        backgroundColor: currentColors.textShade,
                        marginBottom: 20,
                      }}
                    />
                    <Animatable.Text
                      animation={"fadeInLeft"}
                      style={{
                        color: currentColors.text,
                        fontSize: 20,
                        fontWeight: "600",
                        padding: 10,
                      }}>
                      News
                    </Animatable.Text>
                  </View>
                )}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={async () => {
                      setRefreshing(true);

                      // Reset filter states before fetching data
                      setSearchQuery("");
                      setSelectedDistrict("");
                      setSelectedTaluka("");

                      await getAnnouncements(); // Fetch latest announcements
                      console.log("first");
                      await getDepartmentList(); // Fetch latest department list
                      console.log("second");
                      setRefreshing(false);
                      await getUserSubscriptions(); // Fetch latest subscriptions
                      console.log("third");
                    }}
                    colors={[currentColors.secondary]}
                  />
                }
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default UserSubscriptionAnnouncements;

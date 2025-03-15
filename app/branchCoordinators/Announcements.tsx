import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useState, useEffect } from "react";
import * as Animatable from "react-native-animatable";
import { router } from "expo-router";
import watermark from "../../assets/images/watermark.png";
const Announcements = () => {
  const colorTheme = useColorScheme();
  const currentColors = colorTheme == "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [announcementsData, setAnnouncementsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mediaFiles, setMediaFiles] = useState({});

  const convertMediaLinksToArray = (data) => {
    return data.map((item) => ({
      ...item,
      media_links: item.media_links ? item.media_links.split(",") : [],
    }));
  };

  const getAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/announcements/getAnnouncements`
      );

      console.log("API Response:", response.data);

      if (response.data.status && Array.isArray(response.data.results)) {
        setAnnouncementsData(response.data.results);
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
  }, []);

  useEffect(() => {
    if (announcementsData.length > 0) {
      const extractedMediaFiles = {};

      announcementsData.forEach((item) => {
        const firstImage =
          item.media_links && typeof item.media_links === "string"
            ? item.media_links.split(",")[0]
            : null;

        extractedMediaFiles[item.announcement_id] = firstImage;
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

  const filteredData = announcementsData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => {
    const image = mediaFiles[item.announcement_id];
    console.log(`http://${API_IP_ADDRESS}:8000/uploads/profile/${image}`);
    const time = timeAgo(item.date_time_created);
    const description = item.announcement_description;
    const shortDesc =
      description.length > 40 ? description.slice(0, 80) + "..." : description;

    console.log("time: ", time);
    let delay = 50;
    return (
      <Animatable.View
        animation="fadeInUp"
        delay={delay + 50}
        style={{
          margin: 10,
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
          <Text style={{ color: currentColors.text, marginBottom: 5 }}>
            {shortDesc}
          </Text>
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

  return (
    <View style={{ backgroundColor: currentColors.backgroundDarker, flex: 1 }}>
      <View
        style={{
          width: "100%",
          backgroundColor: currentColors.backgroundDarkest,
        }}>
        <Animatable.View
          animation={"fadeInDown"}
          style={{
            backgroundColor: currentColors.backgroundDarker,
            width: "100%",
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            paddingTop: insets.top + 10,
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
          }}>
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
              placeholder="Search for an announcement..."
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
        ) : announcementsData.length === 0 ? (
          <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
            No announcements found
          </Text>
        ) : (
          <>
            <Animatable.Text
              animation={"fadeInLeft"}
              style={{
                color: currentColors.text,
                fontSize: 20,
                fontWeight: 600,
                padding: 10,
              }}>
              Latest News
            </Animatable.Text>
            <FlatList
              data={filteredData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              ListFooterComponent={
                <View
                  style={{
                    marginTop: 100,
                    paddingBottom: insets.bottom + 100,
                    gap: 10,
                  }}>
                  <Image
                    source={watermark}
                    style={{ width: "100%", height: 100, objectFit: "contain" }}
                  />
                </View>
              }
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={getAnnouncements}
                  colors={[currentColors.secondary]}
                />
              }
            />
          </>
        )}
      </View>
    </View>
  );
};

export default Announcements;

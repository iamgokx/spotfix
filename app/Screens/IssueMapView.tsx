import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import issueMarker from "../../assets/images/issues/issueMarker.png";
import { Image } from "react-native-animatable";
import LottieView from "lottie-react-native";
import lazyLoading from "../../assets/images/welcome/loading.json";
import { useRouter } from "expo-router";
import { Modal } from "react-native";
import { TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import * as Animatable from "react-native-animatable";
const IssueMapView = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const [markers, setMarkers] = useState();
  const [isloading, setisloading] = useState(true);
  const [isModalActive, setisModalActive] = useState(false);
  const [modalContent, setmodalContent] = useState("");
  const [issueId, setissueId] = useState("");
  const [issueDescription, setissueDescription] = useState("");
  const router = useRouter();

  // TODO need to fix the marker position on map,

  const getIssue = async () => {
    const response = await axios.post(
      `http://${API_IP_ADDRESS}:8000/api/issues/getIssuesMapView`
    );
    if (response) {
      console.log(response.data);
      setMarkers(response.data);
      setisloading(false);
    }
  };

  useEffect(() => {
    getIssue();
  }, []);

  if (isloading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}>
        <LottieView source={lazyLoading} autoPlay loop />
      </View>
    );
  }

  const handleMarkerPress = (id: any, title: string, description: string) => {
    const splitDescription =
      description.split(" ").slice(0, 15).join(" ") + "...";
    setmodalContent(title);
    setissueId(id);
    setissueDescription(splitDescription);
    setisModalActive(true);
  };

  const handleViewIssuePress = () => {
    setmodalContent("");
    setissueDescription("");
    setisModalActive(false);
    router.push(`/screens/DetailedIssue?issue_id=${issueId}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          width: "100%",
          position: "absolute",
          top: 0,
          zIndex: 6,
          flexDirection: "row",
          alignItems: "center",
        }}>
        <Ionicons
          onPress={() => router.back()}
          name="chevron-back-circle"
          size={40}
          style={{ color: "black", left: 20, top: 20, width: "10%" }}
        />
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 15.4909,
          longitude: 73.8278,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: parseFloat(marker.latitude),
              longitude: parseFloat(marker.longitude),
            }}
            onPress={() =>
              handleMarkerPress(
                marker.issue_id,
                marker.title,
                marker.issue_description
              )
            }
            title={`Marker ID ${marker.issue_id}`}
            description={`${marker.title}`}
            pinColor="black"></Marker>
        ))}
      </MapView>

      <Modal
        visible={isModalActive}
        transparent={true}
        style={{ backgroundColor: "rgba(0,0,0,0)" }}>
        <Animatable.View
          animation="fadeInUp"
          style={{
            flex: 1,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0)",
          }}>
          <View
            style={{
              width: "90%",
              backgroundColor: currentColors.backgroundDarker,
              borderRadius: 20,
              elevation: 10,
            }}>
            <View
              style={{
                width: "100%",
                alignItems: "flex-end",
                justifyContent: "center",
                padding: 10,
              }}>
              <Ionicons
                style={{ width: "10%" }}
                name="close-circle"
                size={30}
                onPress={() => setisModalActive(false)}
                color={currentColors.secondary}
              />
            </View>

            <Text
              style={{
                padding: 10,
                fontWeight: 600,
                fontSize: 18,
                color: currentColors.text,
              }}>
              <Text style={{ color: currentColors.secondary }}>
                Issue Title :
              </Text>{" "}
              {modalContent}
            </Text>
            <Text
              style={{
                padding: 10,
                fontWeight: 600,
                fontSize: 18,
                color: currentColors.text,
              }}>
              <Text style={{ color: currentColors.secondary }}>
                Issue Description :
              </Text>{" "}
              {issueDescription}
            </Text>

            <TouchableOpacity
              onPress={handleViewIssuePress}
              style={{ width: "100%", padding: 10 }}>
              <Text
                style={{
                  width: "100%",
                  backgroundColor: currentColors.secondary,
                  textAlign: "center",
                  padding: 10,
                  color: "white",
                  borderRadius: 20,
                  fontSize: 18,
                }}>
                View Issue
              </Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default IssueMapView;

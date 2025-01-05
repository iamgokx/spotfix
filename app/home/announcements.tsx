import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

const announcements = () => {
  // State to hold markers
  const [markers, setMarkers] = useState([]);

  // Handle map press event
  const handleMapPress = (e: any) => {
    console.log("press");
    const newMarker = e.nativeEvent.coordinate;
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  };
  // TODO need to fix the marker position on map,
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
          name="chevron-back-circle"
          size={30}
          style={{ color: "black", left: 20, top: 20, width: "10%" }}
        />
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 15.2993,
          longitude: 74.124,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        onPress={handleMapPress}>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
            title={`Marker ${index + 1}`}
            description={`This is marker number ${index + 1}`}
            pinColor="blue"
          />
        ))}
      </MapView>
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

export default announcements;

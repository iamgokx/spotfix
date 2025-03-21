import { View, Text, Pressable, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { StyleSheet } from "react-native";
import { useState } from "react";
import "../../global.css";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ActivityIndicator } from "react-native";
import { useProposalContext } from "@/context/ProposalContext";
import LottieView from "lottie-react-native";
import loading from "../../assets/images/welcome/loading.json";
const ProposalMap = () => {
  const [marker, setmarker] = useState("");
  const [userAddress, setAddress] = useState("");
  const [addressLoaded, setaddressLoaded] = useState(false);
  const { details, setDetails } = useProposalContext();
  const [isloading, setisloading] = useState(false);
  const onMapPress = async (event: any) => {
    setisloading(true);
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setmarker({ latitude, longitude });

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
      if (data && data.display_name) {
        const {
          country,
          state,
          city,
          postcode,
          county,
          district,
          road,
          suburb,
          locality,
          state_district,
        } = data.address;

        const calLocality =
          locality || suburb || district || "Unknown Locality";
        console.log("calLocality: ", calLocality);
        //locality is not getting available

        setAddress(data.display_name);

        setaddressLoaded(true);
        setDetails((prev) => ({ ...prev, latitude: latitude }));
        setDetails((prev) => ({ ...prev, longitude: longitude }));
        setDetails((prev) => ({
          ...prev,
          generatedAddress: data.display_name,
        }));

        setDetails((prev) => ({ ...prev, generatedCountry: country }));
        setDetails((prev) => ({ ...prev, generatedLocality: calLocality }));
        setDetails((prev) => ({ ...prev, generatedState: state }));
        setDetails((prev) => ({ ...prev, generatedCity: city }));
        setDetails((prev) => ({ ...prev, generatedDistrict: state_district }));
        setDetails((prev) => ({ ...prev, generatedTaluka: county }));
        setDetails((prev) => ({ ...prev, generatedPincode: postcode }));

        setisloading(false);
      } else {
        setAddress("Please replace your marker nearby, error getting address");
      }
    } catch (error) {
      console.error("Error fetching address:", error.message || error);
    }
  };

  const handleConfirmAddressClick = () => {
    router.push("/proposals/ProposalLocation");

    console.log("context details", details);
  };
  return (
    <View style={styles.container}>
      {isloading && (
        <View style={styles.loadingContainer}>
          <LottieView
            source={loading}
            autoPlay
            loop
            style={{
              marginTop: "10%",
              width: 200,
              height: 200,
              marginBottom: "-10%",
            }}
          />
        </View>
      )}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 15.4909,
          longitude: 73.8278,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={onMapPress}>
        {marker && <Marker coordinate={marker} />}
      </MapView>
      {addressLoaded && (
  <View style={styles.infoContainer}>
    <View style={styles.mapAddressContainer}>
      <Ionicons name="location" color="blue" size={40} style={{ width: 40 }} />
      <View style={{ paddingHorizontal: 10 }}>
        <Text style={styles.addressText}>Location Detected</Text>
        <Text>{userAddress}</Text>
      </View>
    </View>

    {details.generatedState === "Goa" ? (
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => router.back()}
      >
        <Text style={styles.confirmButtonText}>Confirm Address</Text>
      </TouchableOpacity>
    ) : (
      <Text style={styles.errorText}>
        Please select an address within Goa
      </Text>
    )}
  </View>
)}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    position: "absolute",
    bottom: 20,
    width: "90%",
    height: "25%",
    left: 20,
    right: 20,
    backgroundColor: "white",
    paddingHorizontal: 40,
    paddingTop: 10,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 70,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  addressText: {
    fontSize: 20,
    fontWeight: 900,
    color: "blue",
  },
  confirmButton: {
    width: "auto",
    backgroundColor: "#0066ff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 40,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",

    fontSize: 16,
    fontWeight: "bold",
  },
  mapAddressContainer: {
    display: "flex",
    height: "40%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  loadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    zIndex: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default ProposalMap;

import { View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet } from "react-native";
import { useState } from "react";
import "../../global.css";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import loading from "../../assets/images/welcome/loading.json";
import { useSubBranch } from "@/context/newSubBranchContext";

const NewSubBranchCoordinatorMap = ({ goToAddressScreen }: any) => {
  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [userAddress, setUserAddress] = useState("");
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { coordinator, setCoordinator } = useSubBranch();

  const onMapPress = async (event: any) => {
    setIsLoading(true);
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarker({ latitude, longitude });

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
        const { state } = data.address;

        if (state !== "Goa") {
          setUserAddress(data.display_name);
          setIsAddressValid(false);
          setIsLoading(false);
          return;
        }

        setUserAddress(data.display_name);
        setIsAddressValid(true);

        setCoordinator((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
      } else {
        setUserAddress("Error fetching address, please try again.");
        setIsAddressValid(false);
      }
    } catch (error) {
      console.error("Error fetching address:", error.message || error);
      setUserAddress("Error fetching address, please try again.");
      setIsAddressValid(false);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <LottieView
            source={loading}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
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

      {marker && (
        <View style={styles.infoContainer}>
          <View style={styles.mapAddressContainer}>
            <Ionicons
              name="location"
              color="blue"
              size={40}
              style={{ width: 40 }}
            />
            <View style={{ paddingHorizontal: 10 }}>
              <Text style={styles.addressText}>Location Detected</Text>
              <Text>{userAddress}</Text>
            </View>
          </View>
          {isAddressValid ? (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                console.log(coordinator);
                router.back();
              }}>
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
    width: "100%",
    height: "100%",
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    position: "absolute",
    bottom: "2%",
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
    fontWeight: "900",
    color: "blue",
  },
  confirmButton: {
    width: "50%",
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

export default NewSubBranchCoordinatorMap;

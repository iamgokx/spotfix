import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_IP_ADDRESS } from "../ipConfig.json";

export const generateJwt = async (details: any) => {
  try {
    const response = await axios.post(
      `http://${API_IP_ADDRESS}:8000/api/users/generateJwt`,
      details
    );

    if (response.data.token) {
      console.log(response.data.userType);
      const rawToken = response.data.token;
      storeData(rawToken);
      console.log("JWT token stored successfully: ", rawToken);
      return response.data.userType;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error while creating JWT front end: ", error);
    return false;
  }
};

export const storeData = async (token: string) => {
  try {
    await AsyncStorage.setItem("jwtToken", token);
    console.log("Token stored successfully: ", token);
  } catch (e) {
    console.error("Error storing data: ", e);
  }
};

export const getStoredData = async () => {
  try {
    const storedToken = await AsyncStorage.getItem("jwtToken");
    if (storedToken !== null) {
      const decodedToken = jwtDecode(storedToken);
      console.log("Decoded token from AsyncStorage: ", decodedToken);
      return decodedToken;
    } else {
      console.log("No token found in AsyncStorage.");
      return null;
    }
  } catch (e) {
    console.error("Error retrieving data: ", e);
    return null;
  }
};

export const getStoredRawToken = async () => {
  try {
    const storedToken = await AsyncStorage.getItem("jwtToken");
    if (storedToken !== null) {
      return storedToken;
    } else {
      console.log("No token found in AsyncStorage.");
      return null;
    }
  } catch (e) {
    console.error("Error retrieving data: ", e);
    return null;
  }
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log(AsyncStorage.getAllKeys);
  } catch (error) {
    console.log("error clearing storage  : ", error);
    return null;
  }
};

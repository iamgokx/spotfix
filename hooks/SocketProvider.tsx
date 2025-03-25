import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { io } from "socket.io-client";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import socket from "../hooks/useSocket";
import { useNotifications } from "../context/NotificationsContext";
import { getStoredData } from "./useJwt";

interface SocketContextType {
  expoPushToken: string | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { addNotification } = useNotifications();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    const registerForPushNotifications = async () => {
      if (!Device.isDevice) {
        Alert.alert(
          "Error",
          "Must use a physical device for push notifications."
        );
        return;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert("Permission Denied", "You need to enable notifications.");
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token);
      console.log("Expo Push Token:", token);
    };

    registerForPushNotifications();
  }, []);

  const getuser = async () => {
    const user = await getStoredData();
    return user.email;
  };
  useEffect(() => {
    const userId = getuser(); 

    if (!userId) return;

    socket.emit("register", userId);
    console.log("Registered with socket:", userId);

    socket.on("notification", (message) => {
      console.log("Received notification:", message);
      addNotification(message);

      Notifications.scheduleNotificationAsync({
        content: {
          title: "New Message",
          body: message,
          sound: "default",
        },
        trigger: null,
      });
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    <SocketContext.Provider value={{ expoPushToken }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

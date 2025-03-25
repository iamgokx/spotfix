import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { io } from "socket.io-client";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import socket from "./useSocket";
import { useNotifications } from "../context/NotificationsContext";

export const useSocketNotifications = (userId: string) => {
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

  useEffect(() => {
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
  }, [userId]);

  return { expoPushToken };
};

// import { useEffect, useState } from "react";
// import { Alert } from "react-native";
// import { io } from "socket.io-client";
// import * as Notifications from "expo-notifications";
// import * as Device from "expo-device";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import socket from "./useSocket";

// export const useSocketNotifications = (userId: string) => {
//   const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
//   const [notifications, setNotifications] = useState<string[]>([]);

//   useEffect(() => {
//     const registerForPushNotifications = async () => {
//       if (!Device.isDevice) {
//         Alert.alert(
//           "Error",
//           "Must use a physical device for push notifications."
//         );
//         return;
//       }

//       const { status: existingStatus } =
//         await Notifications.getPermissionsAsync();
//       let finalStatus = existingStatus;

//       if (existingStatus !== "granted") {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//       }

//       if (finalStatus !== "granted") {
//         Alert.alert("Permission Denied", "You need to enable notifications.");
//         return;
//       }

//       const token = (await Notifications.getExpoPushTokenAsync()).data;
//       setExpoPushToken(token);
//       console.log("Expo Push Token:", token);
//     };

//     registerForPushNotifications();
//     loadNotifications();
//   }, []);

//   useEffect(() => {
//     if (!userId) return;

//     socket.emit("register", userId);
//     console.log("Registered with socket:", userId);

//     socket.on("notification", async (message: string) => {
//       console.log("Received notification:", message);
//       await saveNotification(message);

//       Notifications.scheduleNotificationAsync({
//         content: {
//           title: "New Message",
//           body: message,
//           sound: "default",
//         },
//         trigger: null,
//       });
//     });

//     return () => {
//       socket.off("notification");
//     };
//   }, [userId]);

//   const saveNotification = async (message: string) => {
//     try {
//       const storedNotifications = await AsyncStorage.getItem("notifications");
//       const notificationsArray = storedNotifications
//         ? JSON.parse(storedNotifications)
//         : [];

//       const updatedNotifications = [...notificationsArray, message];
//       setNotifications(updatedNotifications);

//       await AsyncStorage.setItem(
//         "notifications",
//         JSON.stringify(updatedNotifications)
//       );
//     } catch (error) {
//       console.error("Error saving notification:", error);
//     }
//   };

//   const loadNotifications = async () => {
//     try {
//       const storedNotifications = await AsyncStorage.getItem("notifications");
//       if (storedNotifications) {
//         setNotifications(JSON.parse(storedNotifications));
//       }
//     } catch (error) {
//       console.error("Error loading notifications:", error);
//     }
//   };

//   const clearNotifications = async () => {
//     try {
//       await AsyncStorage.removeItem("notifications");
//       setNotifications([]);
//     } catch (error) {
//       console.error("Error clearing notifications:", error);
//     }
//   };

//   return { expoPushToken, notifications, clearNotifications };
// };

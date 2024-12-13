// import * as Notification from "expo-notifications";
// Notification.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

// export async function sendNotification(title: string, body: string) {
//   try {
//     await Notification.scheduleNotificationAsync({
//       content: {
//         title,
//         body,
//       },
//       trigger: null,
//     });
//   } catch (error) {
//     console.error("Error sending notification:", error);
//   }
// }

// export async function registerApp() {
//   const { status } = await Notification.requestPermissionsAsync();
//   if (status !== "granted") {
//     console.log("Failed to get permission");
//     return;
//   }

//   console.log("Notification permissions granted");

//   try {
//     const token = (
//       await Notification.getExpoPushTokenAsync({
//         projectId: "a206feb5-a391-4bc5-a91e-2056c923fe31",
//       })
//     ).data;
//     console.log("Expo Push Token:", token);
//   } catch (error) {
//     console.error("Error getting Expo push token:", error);
//   }
// }

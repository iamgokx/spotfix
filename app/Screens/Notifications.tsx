import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNotifications } from "@/context/NotificationsContext";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import logo from "../../assets/images/logo.png";

const Notifications = () => {
  const { notifications, markAsRead, removeNotification } = useNotifications();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const router = useRouter();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentColors.backgroundDarkest , },
      ]}>
      <View
        style={{
          width: "100%",
          backgroundColor: currentColors.background,
          paddingTop: insets.top + 10,
          paddingBottom: 10,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          overflow: "hidden",
        }}>
        <View
          style={{
            width: "100%",
            backgroundColor: currentColors.background,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ position: "absolute", left: 10, padding: 10 }}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={currentColors.secondary}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, color: currentColors.secondary }}>
          Notifications
          </Text>
        </View>
      </View>

      {notifications.length === 0 ? (
        <Text style={[styles.emptyText, { padding: 10 }]}>
          No notifications yet.
        </Text>
      ) : (
        <View style={{flex : 1,}}>
          <FlatList
            data={notifications}
            style={{ padding: 10  }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.notification,
                  item.read ? styles.read : styles.unread,

                  ,
                  {
                    backgroundColor: !item.read
                      ? colorScheme == "dark"
                        ? "rgba(225, 165, 0,0.5)"
                        : "rgba(0, 102, 235,0.5)"
                      : currentColors.background,
                  },
                ]}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}>
                  <Image source={logo} style={{ width: 40, height: 40 }} />

                  <View style={styles.actions}>
                    <TouchableOpacity
                      onPress={() => removeNotification(item.id)}>
                      <Ionicons
                        name="close-outline"
                        size={24}
                        color={currentColors.secondary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={[styles.message, { color: currentColors.text }]}>
                  {item.message}
                </Text>

                <View style={{ width: "100%", alignItems: "flex-end" }}>
                  {!item.read && (
                    <TouchableOpacity onPress={() => markAsRead(item.id)}>
                      <Text
                        style={[
                          styles.markRead,
                          { color: currentColors.text },
                        ]}>
                        Mark as Read
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptyText: {
    textAlign: "center",
    color: "gray",
  },
  notification: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  unread: {
    backgroundColor: "#f8d7da",
  },
  read: {
    backgroundColor: "orange",
  },
  message: {
    flex: 1,
    paddingVertical: 10,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  markRead: {
    fontWeight: "bold",
  },
  remove: {
    color: "red",
    fontWeight: "bold",
  },
});

export default Notifications;

// import { useNotifications } from "@/context/NotificationsContext";
// import { useSocketNotifications } from "@/hooks/useSocketNotifications";
// import { View, Button, Text } from "react-native";

// const Notifications = () => {
//   const { notifications, clearNotifications } = useSocketNotifications(
//     "lekhwargokul84@gmail.com"
//   );

//   return (
//     <View
//       style={{
//         alignItems: "center",
//         justifyContent: "center",
//         flex: 1,
//       }}>
//       {notifications.map((notif, index) => (
//         <Text key={index}>{notif}</Text>
//       ))}

//       <Button title="Clear Notifications" onPress={clearNotifications} />
//     </View>
//   );
// };

// export default Notifications;

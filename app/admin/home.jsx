import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  createDrawerNavigator,
  DrawerItemList,
} from "@react-navigation/drawer";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Dashboard = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Admin Dashboard</Text>
  </View>
);

const UserManagement = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>User Management</Text>
  </View>
);

const CustomDrawerContent = (props) => {
  const adminName = "John Doe";

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topSection}>
        <Text style={styles.greeting}>Hello</Text>
        <Text style={styles.adminName}>{adminName}</Text>
      </View>

      <View style={styles.drawerItems}>
        <DrawerItemList {...props} />
      </View>
    </View>
  );
};

const Drawer = createDrawerNavigator();

const AdminDrawer = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationIndependentTree>
        <Drawer.Navigator
          screenOptions={{ drawerLabelStyle: {padding : 20} }}
          initialRouteName="Admin Dashboard"
          drawerContent={(props) => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name="Admin Dashboard" component={Dashboard} />
          <Drawer.Screen name="User Management" component={UserManagement} />
        </Drawer.Navigator>
      </NavigationIndependentTree>
    </GestureHandlerRootView>
  );
};

const App = () => {
  return <AdminDrawer />;
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  topSection: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  adminName: {
    fontSize: 20,
    marginTop: 10,
    color: "#555",
  },
  drawerItems: {
    flex: 1,
    marginTop: 20,
  },
});

export default App;

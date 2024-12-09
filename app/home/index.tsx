import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { NavigationIndependentTree } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomHeader from "@/components/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileScreen from "../Screens/Profile";
import HomeScreen from "../Screens/Home";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawer from "@/components/Drawer";
import Feedback from "../Screens/Feedback";

import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import Help from "../Screens/Help";

const Drawer = createDrawerNavigator();

const MyDrawer = () => {
  return (
    <NavigationIndependentTree>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          drawerType: "front",
          // drawerHideStatusBarOnOpen: true,
          drawerStyle: {
            backgroundColor: "#f5f5f5",
            width: 300,
          },
          headerStyle: {
            backgroundColor: "#0066ff",
          },
          headerTintColor: "#fff",
          drawerActiveTintColor: "#0066ff",
          drawerInactiveTintColor: "gray",
          headerShown: false,
          header: ({ navigation }) => <CustomHeader navigation={navigation} />,
        }}>
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            drawerIcon: ({ size, color }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="User Profile"
          component={ProfileScreen}
          options={{
            drawerIcon: ({ size, color }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Feedback"
          component={Feedback}
          options={{
            drawerIcon: ({ size, color }) => (
              <Ionicons name="reader-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="Help & Support"
          component={Help}
          options={{
            drawerIcon: ({ size, color }) => (
              <Ionicons name="code-slash-outline" size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationIndependentTree>
  );
};

export default MyDrawer;

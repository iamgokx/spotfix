import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  CurrentRenderContext,
  NavigationContainer,
} from "@react-navigation/native";
import Home from "./Home";
import Reports from "./Reports";
import Announcements from "./Announcements";
import Proposals from "./Proposals";

import { Feather, Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "@/components/branchCoordinators/CustomDrawerContent";
import { NavigationIndependentTree } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useColorScheme, View } from "react-native";
import MakeNew from "./MakeNew";
import ManageSubBranchCoordinators from "./ManageSubBranchCoordinators";
import { StyleSheet } from "react-native";
import Subscribers from "./Subscribers";
import ChangePassword from "./ChangePassword";
import IssueMapViewDep from "./IssueMapViewDep";
import Notifications from "./Notifications";
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: "home",
            Reports: "file-text",
            Announcement: "bell",
            Proposal: "book",
            MakeNew: "plus-circle",
            password: "lock",
          };

          if (route.name === "MakeNew") {
            return (
              <View
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: currentColors.secondary,
                  borderRadius: 60,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  transform: [{ translateY: "-50%" }],
                  elevation: 5,
                  shadowColor: "#000",
                  shadowOpacity: 0.2,
                  shadowOffset: { width: 0, height: 5 },
                }}>
                <Feather name="plus" size={40} color="white" />
              </View>
            );
          }

          return <Feather name={icons[route.name]} size={24} color={color} />;
        },

        tabBarShowLabel: false,
        tabBarActiveTintColor: currentColors.secondary,
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: insets.bottom + 15,
          paddingTop: insets.bottom + 20,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: "absolute",
          bottom: insets.bottom,
          backgroundColor: currentColors.backgroundDarker,
          elevation: 0,
          borderTopWidth: 0,
        },
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Reports" component={Reports} />
      <Tab.Screen name="MakeNew" component={MakeNew} />
      <Tab.Screen name="Announcement" component={Announcements} />
      <Tab.Screen name="Proposal" component={Proposals} />
    </Tab.Navigator>
  );
};

const Layout = () => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Drawer.Navigator
          // initialRouteName="DashBoard"
          initialRouteName="Manage Sub Branch"
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={({ route }) => ({
            headerShown: false,
            headerStyle: {
              backgroundColor: currentColors.backgroundDarker,
            },
            headerTintColor: currentColors.text,
            headerTitleAlign: "center",
            drawerStyle: {
              width: "70%",
            },

            drawerContentStyle: {
              // paddingVertical: 20,
            },
            drawerItemStyle: {
              marginVertical: 10,
            },
            drawerLabelStyle: styles.drawerLabel,
            drawerActiveTintColor: "white",
            drawerActiveBackgroundColor: currentColors.secondary,
            drawerInactiveTintColor: currentColors.textShade,
            drawerType: "front",
            drawerIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "DashBoard") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "Manage Sub Branch") {
                iconName = focused ? "people" : "people-outline";
              } else if (route.name === "Subscribers") {
                iconName = focused ? "people-circle-outline" : "people-circle";
              } else if (route.name == "Password") {
                iconName = focused ? "lock-closed" : "lock-closed-outline";
              } else if (route.name == "Issue Map View") {
                iconName = focused ? "location" : "location-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}>
          <Drawer.Screen name="DashBoard" component={TabNavigator} />
          <Drawer.Screen
            name="Manage Sub Branch"
            component={ManageSubBranchCoordinators}
          />
          <Drawer.Screen name="Subscribers" component={Subscribers} />
          <Drawer.Screen name="Password" component={ChangePassword} />
          <Drawer.Screen
            name="Issue Map View"
            component={IssueMapViewDep}
            options={{ headerShown: true }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};

const styles = StyleSheet.create({
  drawerLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Layout;

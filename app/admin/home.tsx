import { View, Text, StyleSheet } from "react-native";
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Dashboard from "./dashboard";
import ManageCitizens from "./ManageCitizens";
import ManageDepartments from "./ManageDepartments";
import ManageDepartmentCoordinators from "./ManageDepartmentCoordinators";
import ManageSubDepCoordinators from "./ManageSubDepCoordinators";
import { useRouter } from "expo-router";
import { clearStorage } from "@/hooks/useJwt";
import { Ionicons } from "@expo/vector-icons";
import { ImageBackground } from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import gradient from "../../assets/images/gradients/profileGradient.png";
import { StatusBar } from "expo-status-bar";
import AdminSearchBarHeader from "@/components/admin/AdminSearchBarHeader";
import ManageProposals from "./ManageProposals";
import AdminDepLogs from "./AdminDepLogs";
import SubDepLogs from "./SubDepLogs";
const CustomDrawerContent = (props: any) => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const adminName = "Gokul Lekhwar";
  const insets = useSafeAreaInsets();

  const router = useRouter();
  const handleLogOutButtonPress = () => {
    clearStorage();
    router.replace("/welcome");
  };

  return (
    <View style={{ flex: 1, backgroundColor: currentColors.background }}>
      <StatusBar hidden />
      <ImageBackground
        resizeMode="cover"
        source={gradient}
        style={{
          width: "100%",

          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          paddingTop: insets.top,

          backgroundColor: "#f5f5f5",
          height: 150,
        }}>
        <Text style={styles.adminName}>{adminName}</Text>
        <Text style={[styles.designation]}>Super Admin</Text>
      </ImageBackground>

      <View style={styles.drawerItems}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Log Out"
          labelStyle={{ color: "orange" }}
          onPress={handleLogOutButtonPress}
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={"orange"} />
          )}
        />
      </View>
    </View>
  );
};

const Drawer = createDrawerNavigator();

const AdminDrawer = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationIndependentTree>
        <Drawer.Navigator
          screenOptions={{
            drawerActiveTintColor: currentColors.secondary,
            drawerInactiveTintColor: currentColors.text,
            drawerLabelStyle: {
              fontSize: 16,
            },
            sceneStyle: { backgroundColor: currentColors.backgroundDarkest },
            drawerActiveBackgroundColor: currentColors.backgroundDarker,

            headerStyle: {
              backgroundColor: currentColors.backgroundDarker,
            },
            headerTintColor: currentColors.text,
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: "bold",
            },
          }}
          initialRouteName="Admin Dashboard"
          drawerContent={(props) => <CustomDrawerContent {...props} />}>
          <Drawer.Screen
            name="Admin Dashboard"
            component={Dashboard}
            options={{
              drawerIcon: ({ focused, size }) => (
                <Ionicons
                  name="code-slash-outline"
                  size={size}
                  color={focused ? currentColors.secondary : currentColors.text}
                />
              ),
              header: () => <AdminSearchBarHeader title={"Admin Dashboard"} />,
            }}
          />
          <Drawer.Screen
            name="Manage Citizens"
            component={ManageCitizens}
            options={{
              drawerIcon: ({ focused, size }) => (
                <Ionicons
                  name="people-outline"
                  size={size}
                  color={focused ? currentColors.secondary : currentColors.text}
                />
              ),
              header: () => (
                <AdminSearchBarHeader
                  title={"Manage Citizens"}
                  visible={true}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Manage Departments"
            component={ManageDepartments}
            options={{
              drawerIcon: ({ focused, size }) => (
                <Ionicons
                  name="business-outline"
                  size={size}
                  color={focused ? currentColors.secondary : currentColors.text}
                />
              ),
              header: () => (
                <AdminSearchBarHeader
                  title={"Manage Departments"}
                  visible={true}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Department Coordinators"
            component={ManageDepartmentCoordinators}
            options={{
              drawerIcon: ({ focused, size }) => (
                <Ionicons
                  name="person-circle-outline"
                  size={size}
                  color={focused ? currentColors.secondary : currentColors.text}
                />
              ),
              header: () => (
                <AdminSearchBarHeader
                  title={"Manage Department Coordinators"}
                  visible={true}
                />
              ),
            }}
          />

          <Drawer.Screen
            name="Sub Department Coordinators"
            component={ManageSubDepCoordinators}
            options={{
              drawerIcon: ({ focused, size }) => (
                <Ionicons
                  name="people-circle-outline"
                  size={size}
                  color={focused ? currentColors.secondary : currentColors.text}
                />
              ),
              header: () => (
                <AdminSearchBarHeader
                  title={"Manage Sub Department Coordinators"}
                  visible={true}
                />
              ),
            }}
          />

          <Drawer.Screen
            name="Manage Proposals"
            component={ManageProposals}
            options={{
              drawerIcon: ({ focused, size }) => (
                <Ionicons
                  name="reader-outline"
                  size={size}
                  color={focused ? currentColors.secondary : currentColors.text}
                />
              ),
              header: () => (
                <AdminSearchBarHeader
                  title={"Manage Citizen Proposals"}
                  visible={false}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Department Edit Logs"
            component={AdminDepLogs}
            options={{
              drawerIcon: ({ focused, size }) => (
                <Ionicons
                  name="calendar-number-outline"
                  size={size}
                  color={focused ? currentColors.secondary : currentColors.text}
                />
              ),
              header: () => (
                <AdminSearchBarHeader
                  title={"Department Edit Logs"}
                  visible={false}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Sub Department Edit Logs"
            component={SubDepLogs}
            options={{
              drawerIcon: ({ focused, size }) => (
                <Ionicons
                  name="calendar-number-outline"
                  size={size}
                  color={focused ? currentColors.secondary : currentColors.text}
                />
              ),
              header: () => (
                <AdminSearchBarHeader
                  title={"Sub Department Edit Logs"}
                  visible={false}
                />
              ),
            }}
          />
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
    justifyContent: "flex-end",
    alignItems: "flex-start",
    backgroundColor: "#f5f5f5",
    height: 150,
  },
  designation: {
    fontSize: 20,
    marginLeft: 10,
    marginBottom: 10,
    color: "white",
    paddingLeft: 10,
  },
  adminName: {
    fontSize: 36,
    fontWeight: "600",
    color: "white",
    marginLeft: 10,

    paddingLeft: 10,
  },
  drawerItems: {
    flex: 1,
    marginTop: 20,
    padding: 10,

    display: "flex",
    gap: 5,
  },
  logOutButtonContianer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
});

export default App;

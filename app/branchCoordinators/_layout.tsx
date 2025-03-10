import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./Home";
import Reports from "./Reports";
import Announcements from "./Announcements";
import Proposals from "./Proposals";
import { Feather } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "@/components/branchCoordinators/CustomDrawerContent";
import { NavigationIndependentTree } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useColorScheme, View } from "react-native";
import MakeNew from "./MakeNew";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Tab.Navigator
      initialRouteName="MakeNew"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: "home",
            Reports: "file-text",
            Announcement: "message-circle",
            Proposal: "book-open",
            MakeNew: "plus-circle",
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
        tabBarActiveTintColor: "tomato",
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
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{ headerShown: false }}>
          <Drawer.Screen name="DashBoard" component={TabNavigator} />
          
        </Drawer.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};

export default Layout;

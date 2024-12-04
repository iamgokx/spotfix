import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { NavigationIndependentTree } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomHeader from "@/components/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import Issue from "@/components/Issue";
const Drawer = createDrawerNavigator();
import { FlatList, ScrollView } from "react-native";
const HomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent />
      <ScrollView
        // style={styles.scrollContainer}
        contentContainerStyle={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
        showsHorizontalScrollIndicator={false}>
        <Issue />
        <Issue />
        <Issue />
        <Issue />
        <Issue />
        <Issue />
        <Issue />
        <Issue />
        <Issue />
        <Issue />
        <Issue />
        <Issue />
        <Issue />
        <Issue />
        <Issue />
        <Issue />
      </ScrollView>
    </View>
  );
};

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is the Profile Screen!</Text>
    </View>
  );
};

const Index = () => {
  return (
    <NavigationIndependentTree>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: "#f5f5f5",
            width: 240,
          },
          headerStyle: {
            backgroundColor: "#0066ff",
          },
          headerTintColor: "#fff",
          drawerActiveTintColor: "#0066ff",
          drawerInactiveTintColor: "gray",
          header: ({ navigation }) => <CustomHeader navigation={navigation} />,
        }}>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
      </Drawer.Navigator>
    </NavigationIndependentTree>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#EEF7FF",
    paddingTop: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "#0066ff",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  scrollContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Index;

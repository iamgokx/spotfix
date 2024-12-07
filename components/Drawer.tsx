import { View, Text } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import hero from "../assets/images/hero.jpg";
import gradient from "../assets/images/gradients/profileGradient.png";
import { ImageBackground, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const CustomDrawer = (props: any) => {
  return (
    <View style={styles.drawerContainer}>
      <View style={[styles.headerContainer]}>
        <ImageBackground
          resizeMode="cover"
          source={gradient}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}>
          <View style={{ width: "90%", marginBottom: 10 }}>
            <Image source={hero} style={styles.profileImage} />
            <Text className="text-white text-2xl font-extrabold">
              Gokul Lekhwar
            </Text>
            <Text className="text-white text-l font-extralight">
              lekhwargokul84@gmail.com
            </Text>
          </View>
        </ImageBackground>
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContainer}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Logout"
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          )}
          onPress={() => console.log("Logged out")}
        />
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  scrollContainer: {
    flex: 1,
    margin: 0,
    padding: 0,
    width: "100%",
    overflow: "hidden",

    gap: 10,
  },
  headerContainer: {
    width: "100%",
    height: "25%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: "cover",
  },
  footer: {
    padding: 10,
    alignItems: "center",
  },
});
export default CustomDrawer;

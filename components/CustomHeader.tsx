import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
interface Props {
  navigation: DrawerNavigationProp<any>;
}

const CustomHeader: React.FC<Props> = ({ navigation }: any) => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  return (
    <SafeAreaView style={[styles.headerContainer,{backgroundColor : currentColors.backgroundDarker}]}>
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={[styles.iconButton]}>
        <Ionicons name="menu" size={28} color={currentColors.secondary}/>
      </TouchableOpacity>

      <TextInput
        style={[styles.searchInput,{backgroundColor : currentColors.background}, {color :  currentColors.text}]}
        placeholder="Search"
        placeholderTextColor={currentColors.textShade}
      />

      <TouchableOpacity
        onPress={() => alert("Notification Clicked")}
        style={styles.iconButton}>
        <Ionicons name="notifications-circle" size={35} color={currentColors.secondary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    elevation: 10,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    zIndex : 1
  },
  iconButton: {
    padding: 5,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    color: "#000",
    fontSize: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
});

export default CustomHeader;

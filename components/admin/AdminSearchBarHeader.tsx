import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import * as Animatable from "react-native-animatable";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useSearch } from "@/context/adminSearchContext";
const AdminSearchBarHeader = ({ title }: any) => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [searchVisible, setSearchVisible] = useState(false);

  const { searchValue, setSearchValue } = useSearch();
  const [searchText, setSearchText] = useState("");
  const handleOutsidePress = () => {
    if (searchVisible) {
      setSearchVisible(false);
      Keyboard.dismiss();
    }
  };



  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: currentColors.backgroundDarker,
            paddingTop: insets.top + 10,
            paddingBottom: 10,
            position: "relative",
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          },
        ]}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ position: "absolute", left: 14, bottom: "50%" }}>
          <Ionicons
            name="menu-outline"
            size={24}
            color={currentColors.secondary}
          />
        </TouchableOpacity>
        {searchVisible ? (
          <TextInput
            style={[
              styles.searchInput,
              {
                color: currentColors.text,
                backgroundColor: currentColors.background,
                width: "100%",
                borderRadius: 30,
                paddingLeft: 10,
              },
            ]}
            placeholder="Search..."
            placeholderTextColor={currentColors.text}
            value={searchValue}
            onChangeText={(text) => setSearchValue(text)}
            autoFocus
          />
        ) : (
          <Text style={[styles.title, { color: currentColors.secondary }]}>
            {title}
          </Text>
        )}

        <TouchableOpacity
          onPress={() => setSearchVisible(!searchVisible)}
          style={{
            position: "absolute",
            right: searchVisible == true ? 21 : 10,
            bottom: "50%",
          }}>
          <Ionicons name="search" size={24} color={currentColors.secondary} />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
    textAlign: "center",
  },
});

export default AdminSearchBarHeader;

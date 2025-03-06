import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const CustomHeaderEditDepartment = ({title}) => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: currentColors.backgroundDarker,
          paddingTop: insets.top + 10,
          paddingBottom: 10,
          position: "relative",
          borderBottomLeftRadius : 30,
          borderBottomRightRadius : 30,
        },
      ]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{position : 'absolute', left : 14, bottom : '50%'}}>
        <Ionicons name="arrow-back" size={24} color={currentColors.secondary} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: currentColors.secondary }]}>
        {title}
      </Text>
    </View>
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
  },
});

export default CustomHeaderEditDepartment;

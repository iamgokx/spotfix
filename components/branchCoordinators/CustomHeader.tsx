import { View, Text, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Button } from "react-native";
import * as Animatable from "react-native-animatable";
const CustomHeader = ({title}) => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <Animatable.View
      animation={"fadeInDown"}
      style={{
        backgroundColor: currentColors.background,
        width: "100%",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingTop: insets.top + 10,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
      }}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 30,
          paddingHorizontal: 10,
          overflow: "hidden",
          position: "relative",
        }}>
        <TouchableOpacity
          style={{ position: "absolute", left: 10 }}
          onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" color={currentColors.secondary} size={24} />
        </TouchableOpacity>
        <Text
          style={{
            color: currentColors.secondary,
            fontSize: 19,
            fontWeight: 200,
          }}>
          {title}
        </Text>
      </View>
    </Animatable.View>
  );
};
export default CustomHeader;

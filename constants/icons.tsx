import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme, View } from "react-native";
import useThemeColors from "@/hooks/useThemeColors";

const findTheme = () => {
  const colors = useColorScheme();
};

export const icons = {
  index: (props: any) => <Feather name="home" size={24} {...props} />,
  analytics: (props: any) => <Ionicons name="analytics" size={24} {...props} />,
  reportIssue: (props: any) => (
    <View
      style={{
        backgroundColor: "orange",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 60,
        height: 60,
        position: "absolute",
        bottom: "10%",
        borderRadius: 50,
      }}>
      <Ionicons
        name="add"
        size={30}
        {...props}
        style={{
          color: "white",
          textAlign: "center",
        }}
      />
    </View>
  ),
  announcements: (props: any) => (
    <Ionicons name="megaphone-outline" size={24} {...props} />
  ),
  proposals: (props: any) => <Ionicons name="newspaper" size={24} {...props} />,
};

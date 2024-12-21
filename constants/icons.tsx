import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme, View } from "react-native";
import GearOne from "../assets/lottie/gearOne.svg";
import GearTwo from "../assets/lottie/gearTwo.svg";
export const icons = {
  index: (props: any) => (
    <Ionicons
      name={!props.isActive ? "home-outline" : "home"}
      size={24}
      {...props}
    />
  ),
  analytics: (props: any) => (
    <Ionicons
      name={!props.isActive ? "analytics-outline" : "analytics"}
      size={24}
      {...props}
    />
  ),
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
        name={!props.isActive ? "add" : "add"}
        size={40}
        {...props}
        style={{
          color:props.isActive ?  "yellow" : 'white',
          textAlign: "center",
        }}
      />
      {/* {!props.isActive ? <GearOne /> : <GearTwo />} */}
    </View>
  ),
  announcements: (props: any) => (
    <Ionicons
      name={!props.isActive ? "megaphone-outline" : "megaphone"}
      size={24}
      {...props}
    />
  ),
  proposals: (props: any) => (
    <Ionicons
      name={!props.isActive ? "newspaper-outline" : "newspaper"}
      size={24}
      {...props}
    />
  ),
};

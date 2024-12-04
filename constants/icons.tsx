import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

export const icons = {
  index: (props: any) => <Feather name="home" size={24} {...props} />,
  analytics: (props: any) => <Ionicons name="analytics" size={24} {...props} />,
  reportIssue: (props: any) => (
    <Ionicons
      name="add-circle"
      size={76}
      {...props}
      style={{
        color: "orange",
        backgroundColor: "white",
        borderRadius: 35,
        paddingTop : 3,
        textAlign: "center",
        width: 70,
        position: "absolute",
        top: -40,
      }}
    />
  ),
  announcements: (props: any) => (
    <Ionicons name="megaphone-outline" size={24} {...props} />
  ),
  proposals: (props: any) => <Ionicons name="newspaper" size={24} {...props} />,
};

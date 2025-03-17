import { View, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import UserIssueSuggestions from "./UserIssueSuggestions";
import UserCitizenProposalSuggestions from "./UserCitizenProposalSuggestions";
import UserGovProposalsSuggestions from "./UserGovProposalsSuggestions";


const Tab = createMaterialTopTabNavigator();

const UserSuggestions = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: currentColors.backgroundDarker }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingBottom: 10,
          backgroundColor: currentColors.background,

          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}>
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Ionicons
            onPress={() => router.back()}
            name="chevron-back-outline"
            size={24}
            color={currentColors.secondary}
            style={{ position: "absolute", left: 10 }}
          />
          <Text
            style={{
              color: currentColors.secondary,
              fontSize: 20,
              fontWeight: "600",
            }}>
            User Suggestions
          </Text>
        </View>
      </View>

      <Tab.Navigator
  screenOptions={({ route }) => ({
    swipeEnabled: false,
    tabBarStyle: {
      backgroundColor: currentColors.background,
      borderTopWidth: 1,
      borderTopColor: currentColors.backgroundDarker,
    },
    tabBarIndicatorStyle: { backgroundColor: currentColors.secondary },
    tabBarLabelStyle: { fontSize: 14 },
    tabBarActiveTintColor: currentColors.secondary,
    tabBarInactiveTintColor: currentColors.text, 
  })}
>
  <Tab.Screen name="Issues" component={UserIssueSuggestions} />
  <Tab.Screen name="Citizen Proposals" component={UserCitizenProposalSuggestions} />
  <Tab.Screen name="Gov Proposals" component={UserGovProposalsSuggestions} />
</Tab.Navigator>

    </View>
  );
};

export default UserSuggestions;

import { ScrollView, StyleSheet, useColorScheme } from "react-native";
import UsersBarGraph from "@/components/admin/usersBarGraph";
import UserRegistrationTrends from "@/components/admin/userRegistrationTrends";
import { Colors } from "@/constants/Colors";

const ChartScreen = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContainer, {backgroundColor : currentColors.backgroundDarkest}]}
      showsVerticalScrollIndicator={false}>
      <UserRegistrationTrends />
      <UsersBarGraph />
 
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "black",
    paddingBottom: 20,
  },
});

export default ChartScreen;

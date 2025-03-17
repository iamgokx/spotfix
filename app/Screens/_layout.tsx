import { Stack } from "expo-router";
import { ProfileProvider } from "@/context/profileContext";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomHeaderEditDepartment from "@/components/admin/CustomHeaderEditDepartment";
const DrawerLayout = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  return (
    <ProfileProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: currentColors.backgroundDarker,
          },
          headerTintColor: currentColors.secondary,
          headerTitleStyle: { fontSize: 20, fontWeight: "bold" },
          headerShown: false,
          headerTitleAlign: "center",
        }}>
        <Stack.Screen name="Home" />
        <Stack.Screen name="DetailedIssue" />
        <Stack.Screen name="Feedback" />
        <Stack.Screen name="Help" />
        <Stack.Screen name="Profile" />
        <Stack.Screen name="UserIssues" />
        <Stack.Screen name="UserProposals" />
        <Stack.Screen name="UserSuggestions" />
        <Stack.Screen name="UserVotes" />
        <Stack.Screen name="UserSubscriptions" />
        <Stack.Screen name="DetailedUserProposal" />
        <Stack.Screen name="IssueMapView" />
        <Stack.Screen name="SubBranchDetailedIssue" />
        <Stack.Screen name="DetailedGovProposal" />
        <Stack.Screen name="CreateReport" />
        <Stack.Screen name="DepProposalScreen" />
        <Stack.Screen name="CompletedIssuesScreen" />
        <Stack.Screen name="PendingIssues" />
        <Stack.Screen name="UserSettings" />
        <Stack.Screen name="Faqs" />
        <Stack.Screen name="ReportaProblem" />
        <Stack.Screen name="Appversion" />
        <Stack.Screen name="TermsandCondition" />
        <Stack.Screen name="AboutSpotFix" />
        <Stack.Screen name="UserIssueSuggestions" />
        <Stack.Screen name="UserCitizenProposalSuggestions" />
        <Stack.Screen name="UserGovProposalsSuggestions" />

        <Stack.Screen
          name="EditDepartments"
          options={{
            headerShown: true,
            header: () => (
              <CustomHeaderEditDepartment title={"Edit Departments"} />
            ),
            contentStyle: { backgroundColor: currentColors.backgroundDarkest },
          }}
        />
        <Stack.Screen
          name="ManageCitizensDetailed"
          options={{
            headerShown: true,
            header: () => (
              <CustomHeaderEditDepartment title={"Manage Citizens"} />
            ),
            contentStyle: { backgroundColor: currentColors.backgroundDarkest },
          }}
        />
      </Stack>
    </ProfileProvider>
  );
};

export default DrawerLayout;

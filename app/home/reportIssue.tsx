import { useRouter } from "expo-router";
import { TouchableOpacity, StyleSheet } from "react-native";
import { View, Text } from "react-native";
import { useIssueContext } from "@/context/IssueContext";
import { IssueProvider } from "@/context/IssueContext";
const ReportIssue = () => {
  const router = useRouter();
  return (
    <IssueProvider>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.btnContainer}
          onPress={() => router.push("/issues/issue")}>
          <Text style={styles.btn}>New Issue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnContainer} 
         onPress={() => router.push("/issues/SaveIssue")}>
          <Text style={styles.btn}>New Proposal</Text>
        </TouchableOpacity>
      </View>
    </IssueProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 50,
  },

  btn: {
    width: "100%",
    backgroundColor: "#0066ff",
    padding: 20,
    textAlign: "center",
    borderRadius: 30,
    color: "white",
  },
  btnContainer: {
    width: "60%",
  },
});

export default ReportIssue;

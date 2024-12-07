import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from "react-native";
import CustomHeader from "@/components/CustomHeader";

import Issue from "@/components/Issue";

const HomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} />
      <StatusBar barStyle="light-content" translucent />
      <ScrollView

        contentContainerStyle={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          padding: 10,
        }}
        showsVerticalScrollIndicator={false}>
        <Issue />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#EEF7FF",
    
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "#0066ff",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  scrollContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;

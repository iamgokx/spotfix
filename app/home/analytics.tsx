import { View, Text, ImageBackground } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import background from "../../assets/images/gradients/bluegradient.png";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useEffect, useState } from "react";

const analytics = () => {
  const colorTheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const currentColors = colorTheme == "dark" ? Colors.dark : Colors.light;
  const [issueData, setissueData] = useState();

  const getIssueData = async () => {
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/issues/getIssueAnalytics`
      );
      if (response.data.status) {
        console.log("response.data.status: ", response.data.results);
        setissueData(response.data.results);
      } else {
        console.log("No issue data from backend ");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getIssueData();
  }, []);

  function getTotalIssues(issues) {
    return issues.length;
  }

  function getSolvedIssues(issues) {
    return issues.filter((issue) => issue.issue_status === "completed").length;
  }

  function getUnsolvedIssues(issues) {
    return issues.filter((issue) => issue.issue_status !== "completed").length;
  }

  return (
    <View
      style={{
        backgroundColor: currentColors.backgroundDarkest,
        flex: 1,
      }}>
      <ImageBackground
        source={background}
        style={{ paddingTop: insets.top + 20 }}>
        <Text
          style={{
            color: "white",
            paddingBottom: 30,
            textAlign: "center",
            fontSize: 20,
            fontWeight: 900,
          }}>
          Reports and Analytics
        </Text>
      </ImageBackground>

      <View
        style={{
          flex: 1,
          backgroundColor: currentColors.backgroundDarker,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          marginTop: -20,
          overflow: "hidden",
          padding: 10,
        }}>
        <View
          style={{
            width: "100%",

            backgroundColor: currentColors.backgroundLighter,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            borderRadius: 30,
            padding: 20,
          }}>
          <View style={{ gap: 10, width: "30%" }}>
            <Text
              style={{
                color: currentColors.text,
                fontSize: 15,
                textAlign: "center",
              }}>
              Total Cases
            </Text>
            <View>
              <Text
                style={{
                  color: currentColors.text,
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: 800,
                }}>
                {issueData ? getTotalIssues(issueData) : 'Loading'}
              </Text>
            </View>
          </View>
          <View
            style={{
              gap: 10,
              width: "30%",
              borderLeftWidth: 2,
              borderRightWidth: 2,
              borderColor: "rgba(255,255,255,0.3)",
              padding: 10,
            }}>
            <Text
              style={{
                color: currentColors.text,
                fontSize: 15,
                textAlign: "center",
              }}>
              Solved
            </Text>
            <View>
              <Text
                style={{
                  color: currentColors.text,
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: 800,
                }}>
                {issueData ? getSolvedIssues(issueData) : 'Loading'}
              </Text>
            </View>
          </View>
          <View style={{ gap: 10, width: "30%" }}>
            <Text
              style={{
                color: currentColors.text,
                fontSize: 15,
                textAlign: "center",
              }}>
              Unsolved
            </Text>
            <View>
              <Text
                style={{
                  color: currentColors.text,
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: 800,
                }}>
                { issueData ? getUnsolvedIssues(issueData) : 'Loading'}
              </Text>
            </View>
          </View>
        </View>
        
      </View>
    </View>
  );
};

export default analytics;

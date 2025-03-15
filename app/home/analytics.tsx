import { View, Text, ImageBackground, Dimensions } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import background from "../../assets/images/gradients/bluegradient.png";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useEffect, useState } from "react";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const analytics = () => {
  const colorTheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const currentColors = colorTheme === "dark" ? Colors.dark : Colors.light;
  const dummyIssueData = [
    {
      date_time_created: "2025-01-05T10:30:00Z",
      issue_status: "completed",
    },
    {
      date_time_created: "2025-01-12T14:45:00Z",
      issue_status: "pending",
    },
    {
      date_time_created: "2025-01-20T08:15:00Z",
      issue_status: "completed",
    },
    {
      date_time_created: "2025-01-28T19:00:00Z",
      issue_status: "in_progress",
    },
    {
      date_time_created: "2025-02-03T11:20:00Z",
      issue_status: "completed",
    },
    {
      date_time_created: "2025-02-10T16:10:00Z",
      issue_status: "pending",
    },
    {
      date_time_created: "2025-02-15T09:30:00Z",
      issue_status: "completed",
    },
    {
      date_time_created: "2025-02-25T13:40:00Z",
      issue_status: "pending",
    },
    {
      date_time_created: "2025-03-01T07:50:00Z",
      issue_status: "in_progress",
    },
    {
      date_time_created: "2025-03-10T20:25:00Z",
      issue_status: "completed",
    },
  ];
  const [issueData, setIssueData] = useState(dummyIssueData);

  useEffect(() => {
    const getIssueData = async () => {
      try {
        const response = await axios.post(
          `http://${API_IP_ADDRESS}:8000/api/issues/getIssueAnalytics`
        );
        if (response.data.status) {
          console.log("response.data.status: ", response.data.results);
          setIssueData(response.data.results);
        } else {
          console.log("No issue data from backend ");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getIssueData();
  }, []);

  const getIssuesByMonth = (year, month) => {
    const filteredIssues = issueData.filter((issue) => {
      const issueDate = new Date(issue.date_time_created);
      return issueDate.getFullYear() === year && issueDate.getMonth() === month;
    });

    return {
      total: filteredIssues.length,
      solved: filteredIssues.filter(
        (issue) => issue.issue_status === "completed"
      ).length,
      unsolved: filteredIssues.filter(
        (issue) => issue.issue_status !== "completed"
      ).length,
    };
  };

  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(1);

  const issueStats = getIssuesByMonth(selectedYear, selectedMonth);

  // const chartData = {
  //   labels: ["Total", "Solved", "Unsolved"],
  //   datasets: [
  //     {
  //       data: [issueStats.total, issueStats.solved, issueStats.unsolved],
  //       colors: [() => "#1E90FF", () => "#32CD32", () => "#FF4500"],
  //     },
  //   ],
  // };
  
  const total = issueData ?  getTotalIssues(issueData) : 0;
  const solved = issueData ? getSolvedIssues(issueData) : 0;
  const unsolved = issueData ? getUnsolvedIssues(issueData) : 0;

  let chartData = {
    labels: ["Total", "Solved", "Unsolved"],
    datasets: [
      {
        data: [total, solved, unsolved],
        colors: [() => "#1E90FF", () => "#32CD32", () => "#FF4500"],
      },
    ],
  };

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
                {issueData ? getTotalIssues(issueData) : "Loading"}
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
                {issueData ? getSolvedIssues(issueData) : "Loading"}
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
                {issueData ? getUnsolvedIssues(issueData) : "Loading"}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1, marginTop: 20, alignItems: "center" }}>
          {issueData.length > 0 ? (
            <BarChart
              data={chartData}
              width={screenWidth - 20}
              height={300}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: currentColors.background,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                barPercentage: 0.5,
              }}
              style={{ borderRadius: 30 }}
              verticalLabelRotation={0}
              fromZero
            />
          ) : (
            <Text
              style={{ color: "white", textAlign: "center", marginTop: 20 }}>
              No Data Available
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default analytics;

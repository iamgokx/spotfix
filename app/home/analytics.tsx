import { View, Text, ImageBackground, Dimensions, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import background from "../../assets/images/gradients/bluegradient.png";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { useEffect, useState } from "react";
import { BarChart } from "react-native-chart-kit";
import watermark from "../../assets/images/watermark.png";
import * as Animatable from "react-native-animatable";
import IssueMapView from "../screens/IssueMapView";
import { ScrollView } from "react-native-gesture-handler";
const screenWidth = Dimensions.get("window").width -40;

const dummyReportsData = [
  { month_year: "Jan 2024", report_count: 20 },
  { month_year: "Feb 2024", report_count: 35 },
  { month_year: "Mar 2024", report_count: 50 },
  { month_year: "Apr 2024", report_count: 40 },
  { month_year: "May 2024", report_count: 60 },
  { month_year: "Jun 2024", report_count: 75 },
  { month_year: "Jul 2024", report_count: 65 },
  { month_year: "Aug 2024", report_count: 80 },
  { month_year: "Sep 2024", report_count: 90 },
  { month_year: "Oct 2024", report_count: 100 },
  { month_year: "Nov 2024", report_count: 110 },
  { month_year: "Dec 2024", report_count: 95 },
];

import { LineChart } from "react-native-chart-kit";

import moment from "moment";
import { PieChart } from "react-native-chart-kit";

import CustomHeader from "@/components/branchCoordinators/CustomHeader";

import { getStoredData } from "@/hooks/useJwt";
import { ProgressChart } from "react-native-chart-kit";

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
  const [reportsData, setReportsData] = useState([]);
  const [chartDataTwo, setChartDataTwo] = useState({
    labels: [],
    reportCounts: [],
  });

  const [PieChartData, setPieChartData] = useState([]);
  const [ProgressChartData, setProgressChartData] = useState([]);
  const [IssuePriorityChartData, setIssuePriorityChartData] = useState([]);
  const getReportsChartData = async () => {
    const user = await getStoredData();
    const email = user.email;
    try {
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/branchCoordinator/getReportsChartData`,
        { email }
      );

      if (response.data.status) {
        // console.log("API Data:", response.data.results);
        setReportsData(response.data.results);
      }

      const getPieChart = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/admin/getissueStatusChartData`,
        { email }
      );

      if (getPieChart.data.status) {
        // console.log("Pie Chart Data:", getPieChart.data.results);
        setPieChartData(getPieChart.data.results);
      }

      const progressChartResponse = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/admin/getCompletionChartData`,
        { email }
      );

      if (progressChartResponse.data.status) {
        // console.log("Pie Chart Data:", progressChartResponse.data.results);
        setProgressChartData(progressChartResponse.data.results);
      }
      const PriorityChartResponse = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/admin/getIssuePriorityChartData`,
        { email }
      );

      if (PriorityChartResponse.data.status) {
        console.log("Priority chart data:", PriorityChartResponse.data.results);
        setIssuePriorityChartData(PriorityChartResponse.data.results);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  useEffect(() => {
    getReportsChartData();
  }, []);

  const processReportsData = (data) => {
    let groupedData = {};

    data.forEach((item) => {
      const monthYear = item.month_year;
      if (!groupedData[monthYear]) {
        groupedData[monthYear] = 0;
      }
      groupedData[monthYear] += item.report_count;
    });

    const sortedKeys = Object.keys(groupedData).sort((a, b) =>
      moment(a, "MMM YYYY").isBefore(moment(b, "MMM YYYY")) ? -1 : 1
    );

    return {
      labels: sortedKeys,
      reportCounts: sortedKeys.map((key) => groupedData[key]),
    };
  };

  useEffect(() => {
    if (dummyReportsData.length > 0) {
      console.log("Processing Reports Data...");
      const processedData = processReportsData(dummyReportsData);
      // console.log("Processed Reports Data:", processedData);
      setChartDataTwo(processedData);
    }
  }, [reportsData]);

  const badgeColors = [
    { backgroundColor: "#D1D5DB", color: "#000" },
    { backgroundColor: "#B5EAD7", color: "#000" },
    { backgroundColor: "#FFDD57", color: "#000" },
    { backgroundColor: "#A0E7E5", color: "#000" },
  ];

  const chartConfig = {
    // backgroundColor: currentColors.background,
    backgroundGradientFrom: currentColors.backgroundDarker,
    backgroundGradientTo: currentColors.backgroundDarker,
    decimalPlaces: 0,
    color: (opacity = 1) => currentColors.secondary,
    labelColor: (opacity = 1) => currentColors.text,
    strokeWidth: 1,
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "white",
    },
    propsForBackgroundLines: {
      stroke: currentColors.textShade,
      strokeDasharray: "4",
    },
  };

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

  const total = issueData ? getTotalIssues(issueData) : 0;
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
          backgroundColor: currentColors.backgroundDarkest,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          marginTop: -20,
          overflow: "hidden",
          padding: 10,
        }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ gap: 80, padding: 10 }}
          showsVerticalScrollIndicator={false}>
          <View style={{ width: "100%" }}>
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
            <View
              style={{
                flex: 1,
                marginTop: 20,
                alignItems: "center",
              }}>
              {issueData.length > 0 ? (
                <BarChart
                  data={chartData}
                  width={screenWidth - 20}
                  height={300}
                  yAxisLabel=""
                  chartConfig={chartConfig}
                  style={{ borderRadius: 30, overflow: "hidden" }}
                  verticalLabelRotation={0}
                  fromZero
                />
              ) : (
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    marginTop: 20,
                  }}>
                  No Data Available
                </Text>
              )}
            </View>
          </View>

          <View style={{ width: "100%" }}>
            <Text
              style={{
                color: currentColors.text,
                fontSize: 20,
                marginBottom: 20,
              }}>
              Issue Analytics
            </Text>
            <View
              style={{
                backgroundColor: currentColors.background,
                borderRadius: 20,
              }}>
              <PieChart
                data={PieChartData.map((item, index) => ({
                  name: item.category,
                  population: item.value,
                  color: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4CAF50",
                    "#FF9800",
                  ][index % 5],
                  legendFontColor: currentColors.text,
                  legendFontSize: 15,
                }))}
                width={screenWidth - 20}
                height={220}
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#f8f9fa",
                  backgroundGradientTo: "#e9ecef",
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
              />
            </View>
          </View>

          <View style={{ width: "100%" }}>
            <Text
              style={{
                color: currentColors.text,
                fontSize: 20,
                marginBottom: 20,
              }}>
              Issue Completion Progress Analytics
            </Text>
            <View
              style={{
                backgroundColor: currentColors.background,
                borderRadius: 20,
                width: "100%",
              }}>
              <ProgressChart
                data={{
                  data: ProgressChartData.map((item) => item.value / 100),
                }}
                width={screenWidth}
                height={220}
                strokeWidth={16}
                radius={32}
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#f8f9fa",
                  backgroundGradientTo: "#e9ecef",
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
                }}
                hideLegend={false}
                style={{ borderRadius: 20 }}
              />
            </View>
          </View>

          <View style={{ width: "100%" }}>
            <Text
              style={{
                color: currentColors.text,
                fontSize: 20,
                marginBottom: 20,
              }}>
              Issue Priority Analytics
            </Text>
            <View
              style={{
                backgroundColor: currentColors.backgroundDarker,
                borderRadius: 20,
                flex: 1,
              }}>
              <BarChart
                data={{
                  labels:
                    IssuePriorityChartData.length > 0
                      ? IssuePriorityChartData.map((item) => item.category)
                      : ["Low", "moderate", "High"],
                  datasets: [
                    {
                      data:
                        IssuePriorityChartData.length > 0
                          ? IssuePriorityChartData.map((item) => item.value)
                          : [10, 20, 30],
                    },
                  ],
                }}
                width={screenWidth}
                height={250}
                yAxisLabel=""
                yAxisSuffix=" "
                chartConfig={chartConfig}
                showValuesOnTopOfBars
                style={{
                  borderRadius: 20,
                }}
              />
            </View>
          </View>

          <Animatable.View
            animation={"fadeInUp"}
            style={{
              marginTop: 100,
              paddingBottom: insets.bottom + 100,
              gap: 10,
            }}>
            <Image
              source={watermark}
              style={{ width: "100%", height: 100, objectFit: "contain" }}
            />
          </Animatable.View>
        </ScrollView>
      </View>
    </View>
  );
};

export default analytics;

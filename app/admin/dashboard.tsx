import { ScrollView, StyleSheet } from "react-native";
import UsersBarGraph from "@/components/admin/usersBarGraph";
import UserRegistrationTrends from "@/components/admin/userRegistrationTrends";

import React, { useState, useEffect } from "react";
import { Image } from "react-native";
import { View, Text, Dimensions } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { useColorScheme } from "react-native";
import axios from "axios";
import moment from "moment";
import { PieChart } from "react-native-chart-kit";
import { Colors } from "@/constants/Colors";
import CustomHeader from "@/components/branchCoordinators/CustomHeader";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { getStoredData } from "@/hooks/useJwt";
import { ProgressChart } from "react-native-chart-kit";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import watermark from "../../assets/images/watermark.png";
import * as Animatable from "react-native-animatable";

const screenWidth = Dimensions.get("window").width - 40;

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

const ChartScreen = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const [reportsData, setReportsData] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], reportCounts: [] });

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

  //dummy data bar
  useEffect(() => {
    if (dummyReportsData.length > 0) {
      console.log("Processing Reports Data...");
      const processedData = processReportsData(dummyReportsData);
      // console.log("Processed Reports Data:", processedData);
      setChartData(processedData);
    }
  }, [reportsData]);

  const badgeColors = [
    { backgroundColor: "#D1D5DB", color: "#000" },
    { backgroundColor: "#B5EAD7", color: "#000" },
    { backgroundColor: "#FFDD57", color: "#000" },
    { backgroundColor: "#A0E7E5", color: "#000" },
  ];

  const chartConfig = {
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

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContainer,
        { backgroundColor: currentColors.backgroundDarkest, padding: 20 },
      ]}
      showsVerticalScrollIndicator={false}>
      <UserRegistrationTrends />
      <UsersBarGraph />

      <View style={{ flex: 1, gap: 20 }}>
        <Text style={{ color: currentColors.text, fontSize: 20 }}>
          Reports Graph Analytics
        </Text>
        <ScrollView
          horizontal
          style={{
            backgroundColor: currentColors.background,
            borderRadius: 20,
            flex: 1,
          }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsHorizontalScrollIndicator={false}>
          <View style={{ height: 220, justifyContent: "center" }}>
            {reportsData && (
              <LineChart
                data={{
                  labels:
                    chartData.labels.length > 0
                      ? chartData.labels
                      : ["Jan", "Feb", "Mar", "Apr", "May"],
                  datasets: [
                    {
                      data:
                        chartData.reportCounts.length > 0
                          ? chartData.reportCounts
                          : [50, 60, 80, 90, 120],
                      color: () => currentColors.secondary,
                    },
                  ],
                }}
                width={Math.max(screenWidth, chartData.labels.length * 80)}
                height={220}
                yAxisInterval={20}
                chartConfig={chartConfig}
                bezier
                style={{ flex: 1, minHeight: 220 }}
              />
            )}
          </View>
        </ScrollView>
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
              color: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9800"][
                index % 5
              ],
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
            hideLegend={true}
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
            chartConfig={{
              backgroundGradientFrom: currentColors.backgroundDarker,
              backgroundGradientTo: currentColors.backgroundDarker,
              decimalPlaces: 0,
              color: (opacity = 1) => currentColors.secondary,
              labelColor: (opacity = 1) => currentColors.text,
              strokeWidth: 1,
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#007AFF",
              },
              propsForBackgroundLines: {
                stroke: currentColors.textShade,
                strokeDasharray: "4",
              },
            }}
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
          paddingBottom: insets.bottom + 20,
          gap: 10,
        }}>
        <Image
          source={watermark}
          style={{ width: "100%", height: 100, objectFit: "contain" }}
        />
      <View style={{ paddingBottom: insets.bottom + 20 }}>
            <Image
              source={watermark}
              style={{ width: 300, height: 100, objectFit: "contain" }}
            />
          </View>
      </Animatable.View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "black",
    paddingBottom: 20,
    gap: 20,
  },
});

export default ChartScreen;

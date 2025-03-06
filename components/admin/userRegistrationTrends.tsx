import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import moment from "moment";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
const UserRegistrationTrends = () => {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  const [User, SetUser] = useState([]);
  const [chartDatag, setChartData] = useState({
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    approvedData: [],
    pendingData: [],
    rejectedData: [],
  });
  const getUserGraph = async () => {
    try {
      console.log("Fetching data...");
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/admin/userGraphData`
      );

      console.log("API Response Data:", JSON.stringify(response.data, null, 2));

      SetUser(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  const processData = (data) => {
    let groupedData = {};

    data.forEach((item) => {
      const monthYear = moment(item.registration_date_time).format("MMM YYYY");

      if (!groupedData[monthYear]) {
        groupedData[monthYear] = { approved: 0, pending: 0, rejected: 0 };
      }

      if (["approved", "pending", "rejected"].includes(item.status)) {
        groupedData[monthYear][item.status] += 1;
      }
    });

  
    const sortedKeys = Object.keys(groupedData).sort((a, b) =>
      moment(a, "MMM YYYY").isBefore(moment(b, "MMM YYYY")) ? -1 : 1
    );

    const labels = sortedKeys;
    const approvedData = labels.map((key) => groupedData[key].approved);
    const pendingData = labels.map((key) => groupedData[key].pending);
    const rejectedData = labels.map((key) => groupedData[key].rejected);

    return { labels, approvedData, pendingData, rejectedData };
  };

  useEffect(() => {
    if (User.length > 0) {
      console.log("Processing User Data...");
      const groupedData = processData(User);
      console.log("Grouped Data:", groupedData);

      setChartData(groupedData);
    }
  }, [User]);

  const chartData =
    chartDatag.approvedData.length > 0
      ? chartDatag
      : {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          approvedData: Array(12).fill(0),
          pendingData: Array(12).fill(0),
          rejectedData: Array(12).fill(0),
        };

  useEffect(() => {
    getUserGraph();
  }, []);

  return (
    <>
      <Text style={[styles.title, { color: currentColors.text }]}>
        User Registration Trends
      </Text>
      <LineChart
        data={{
          labels: chartData.labels,
          datasets: [
            {
              data: chartData.approvedData,
              color: (opacity = 1) => `rgba(115, 214, 250, ${opacity})`,
              strokeWidth: 2,
            },
            {
              data: chartData.pendingData,
              color: (opacity = 1) => `rgba(229, 245, 5, ${opacity})`,
              strokeWidth: 2,
            },
            {
              data: chartData.rejectedData,
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              strokeWidth: 2,
            },
          ],
          legend: ["Approved", "Pending", "Rejected"],
        }}
        width={Dimensions.get("window").width - 30}
        height={300}
        chartConfig={{
          backgroundGradientFrom: currentColors.backgroundDarker,
          backgroundGradientTo: currentColors.backgroundDarker,
          color: (opacity = 1) => `rgba(255,255, 255, ${opacity})`,
          strokeWidth: 9,
          decimalPlaces: 0,

          labelColor: (opacity = 1) => currentColors.text,
        }}
        style={styles.chart}
      />

      <View style={styles.statsContainer}>
        <View
          style={[
            styles.statsBox,
            { backgroundColor: currentColors.backgroundDarker },
          ]}>
          <Text style={styles.statsNumber}>
            {chartDatag.approvedData.reduce((total, curr) => total + curr, 0)}
          </Text>
          <Text style={[styles.statsHeading, { color: currentColors.text }]}>
            Approved Users
          </Text>
        </View>
        <View
          style={[
            styles.statsBox,
            { backgroundColor: currentColors.backgroundDarker },
            styles.statsDepartment,
          ]}>
          <Text style={[styles.statsNumber, styles.statsNumDep]}>
            {chartDatag.pendingData.reduce((total, curr) => total + curr, 0)}
          </Text>
          <Text style={[styles.statsHeading, { color: currentColors.text }]}>
            Pending Users
          </Text>
        </View>
        <View
          style={[
            styles.statsBox,
            { backgroundColor: currentColors.backgroundDarker },
            styles.statsSubDep,
          ]}>
          <Text style={[styles.statsNumber, styles.statsNumSubDep]}>
            {chartDatag.rejectedData.reduce((total, curr) => total + curr, 0)}
          </Text>
          <Text style={[styles.statsHeading, { color: currentColors.text }]}>
            Rejected Users
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 20,
    elevation: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 30,
  },
  statsBox: {
    width: "30%",
    backgroundColor: "#e3f4ff",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    elevation: 10,
  },

  statsNumber: {
    fontWeight: "600",
    fontSize: 20,
    color: "rgba(115, 214, 250 , 1)",
  },
  statsNumSubDep: {
    color: "rgba(255, 0, 0,1)",
  },
  statsNumDep: {
    color: "rgba(229, 245, 5,1)",
  },
  statsHeading: {
    fontWeight: "400",
    marginTop: 10,
    textAlign: "center",
  },
});

export default UserRegistrationTrends;

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
  const [chartDataLive, setChartData] = useState({
    labels: [],
    approvedData: [],
    registeredData: [],
    rejectedData: [],
  });
  const getUserGraph = async () => {
    try {
      console.log("Fetching data...");
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/admin/userGraphData`
      );

      console.log("API Response:", response.data);
      SetUser(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const processData = (data) => {
    let groupedData = {};

    data.forEach((item) => {
      const month = moment(item.registration_date_time).format("MMM");

      if (!groupedData[month]) {
        groupedData[month] = { approved: 0, registered: 0, rejected: 0 };
      }

      if (["approved", "registered", "rejected"].includes(item.status)) {
        groupedData[month][item.status]++;
      }
    });

    return groupedData;
  };

  useEffect(() => {
    getUserGraph();
  }, []);

  useEffect(() => {
    if (User.length > 0) {
      console.log("Processing User Data...");
      const groupedData = processData(User);
      console.log("Grouped Data:", groupedData);

      const labels = [
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
      ];

      const approvedData = labels.map(
        (month) => groupedData[month]?.approved || 0
      );
      const registeredData = labels.map(
        (month) => groupedData[month]?.registered || 0
      );
      const rejectedData = labels.map(
        (month) => groupedData[month]?.rejected || 0
      );

      console.log("Approved Data:", approvedData);
      console.log("Registered Data:", registeredData);
      console.log("Rejected Data:", rejectedData);

      setChartData({ labels, approvedData, registeredData, rejectedData });
    }
  }, [User]);

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    approvedData: [5, 10, 15, 20, 25, 30],
    registeredData: [8, 12, 18, 22, 28, 35],
    rejectedData: [2, 5, 7, 10, 12, 15],
  };
  return (
    <>
      <Text style={[styles.title, {color : currentColors.text}
      ]}>User Registration Trends</Text>
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
              data: chartData.registeredData,
              color: (opacity = 1) => `rgba(229, 245, 5, ${opacity})`,
              strokeWidth: 2,
            },
            {
              data: chartData.rejectedData,
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              strokeWidth: 2,
            },
          ],
          legend: ["Approved", "Registered", "Rejected"],
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
        <View style={[styles.statsBox,{backgroundColor  : currentColors.backgroundDarker}]}>
          <Text style={styles.statsNumber}>245</Text>
          <Text style={[styles.statsHeading, {color : currentColors.text}]}>Citizens</Text>
        </View>
        <View style={[styles.statsBox,{backgroundColor  : currentColors.backgroundDarker}, styles.statsDepartment]}>
          <Text style={[styles.statsNumber, styles.statsNumDep]}>45</Text>
          <Text style={[styles.statsHeading, {color : currentColors.text}]}>Department Coordinators</Text>
        </View>
        <View style={[styles.statsBox,{backgroundColor  : currentColors.backgroundDarker}, styles.statsSubDep]}>
          <Text style={[styles.statsNumber, styles.statsNumSubDep]}>25</Text>
          <Text style={[styles.statsHeading, {color : currentColors.text}]}>Sub Branch Coordinators</Text>
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
    color: "#1f78b4",
  },
  statsNumSubDep: {
    color: "#65b8e3",
  },
  statsNumDep: {
    color: "#57ba01",
  },
  statsHeading: {
    fontWeight: "400",
    marginTop: 10,
    textAlign : 'center'
  },
});

export default UserRegistrationTrends;

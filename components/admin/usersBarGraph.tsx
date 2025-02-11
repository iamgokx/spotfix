import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import axios from "axios";
import { API_IP_ADDRESS } from "../../ipConfig.json";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
const UsersBarGraph = () => {
  const [User, SetUser] = useState([]);
  const colorScheme = useColorScheme();
  const currentColors = colorScheme == "dark" ? Colors.dark : Colors.light;
  useEffect(() => {
    getUserGraphAllUsers();
  }, []);

  const getUserGraphAllUsers = async () => {
    try {
      console.log("Fetching data...");
      const response = await axios.post(
        `http://${API_IP_ADDRESS}:8000/api/admin/userGraphDataAllUsers`
      );

      console.log("API Response:", response.data);
      SetUser(response.data || []);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const userCounts = User.reduce((acc, user) => {
    acc[user.user_type] = (acc[user.user_type] || 0) + 1;
    return acc;
  }, {});

  const labelMap = {
    super_admin: "Admins",
    citizen: "Citizens",
    sub_branch_coordinator: "Coordinators",
    department_coordinator: "Departments",
  };

  const labels = Object.keys(userCounts).map((key) => labelMap[key] || key);
  const dataValues = Object.values(userCounts);

  return (
    <View style={[styles.container]}>
      <Text style={[styles.title, { color: currentColors.text }]}>
        User Type Distribution
      </Text>
      {labels.length > 0 ? (
        <BarChart
          data={{
            labels,
            datasets: [{ data: dataValues.length ? dataValues : [0] }],
          }}
          width={Dimensions.get("window").width - 20}
          height={300}
          yAxisLabel=""
          chartConfig={{
            backgroundGradientFrom: currentColors.backgroundDarker,
            backgroundGradientTo: currentColors.backgroundDarker,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(5, 214, 250, ${opacity})`,
            barPercentage: 0.6,
            labelColor: () => currentColors.text,
          }}
          style={styles.chart}
          showValuesOnTopOfBars
        />
      ) : (
        <Text style={styles.noDataText}>No data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    padding: 10,
    marginTop: 30,
    borderRadius: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    elevation: 10,
  },
  noDataText: {
    fontSize: 16,
    color: "gray",
    marginTop: 10,
  },
});

export default UsersBarGraph;

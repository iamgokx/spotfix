import React from "react";
import { BarChart } from "react-native-chart-kit";
import { View, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const PriorityChart = ({ data }) => {
  return (
    <View>
      {data && <BarChart
        data={{
          labels: data.map((item) => item.category),
          datasets: [{ data: data.map((item) => item.value) }],
        }}
        width={screenWidth - 20}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#f8f9fa",
          backgroundGradientTo: "#e9ecef",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={{ marginVertical: 8, borderRadius: 16 }}
      />}
    </View>
  );
};



export default PriorityChart
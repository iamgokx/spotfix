import React from "react";
import { ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const MonthlyReportCountChart = ({ data }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {data && <LineChart
        data={{
          labels: data.map((item) => item.category),
          datasets: [{ data: data.map((item) => item.value) }],
        }}
        width={Math.max(screenWidth, data.length * 80)}
        height={220}
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#f8f9fa",
          backgroundGradientTo: "#e9ecef",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />}
    </ScrollView>
  );
};


export default MonthlyReportCountChart
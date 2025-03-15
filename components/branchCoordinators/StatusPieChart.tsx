import React from "react";
import { PieChart } from "react-native-chart-kit";
import { View, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const StatusPieChart = ({ data }) => {
  const pieData = data.map((item, index) => ({
    name: item.category,
    value: item.value,
    color: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9800"][
      index % 5
    ],
    legendFontColor: "#7F7F7F",
    legendFontSize: 14,
  }));

  return (
    <View>
      <PieChart
        data={pieData}
        width={screenWidth - 20}
        height={220}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#f8f9fa",
          backgroundGradientTo: "#e9ecef",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="15"
      />
    </View>
  );
};



export default StatusPieChart
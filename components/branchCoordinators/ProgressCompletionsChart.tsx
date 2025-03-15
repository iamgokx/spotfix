import React from "react";
import { ProgressChart } from "react-native-chart-kit";
import { View, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const ProgressCompletionsChart = ({ value }) => {
  return (
    <View>
      <ProgressChart
        data={{ data: [value / 100] }}
        width={screenWidth - 20}
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
      />
    </View>
  );
};



export default ProgressCompletionsChart
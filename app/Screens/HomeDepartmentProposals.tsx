import { View, Text } from "react-native";
import axios from "axios";
import {API_IP_ADDRESS} from '../../ipConfig.json'
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
const HomeDepartmentProposals = () => {
const colorScheme = useColorScheme();
const currentColors = colorScheme == 'dark' ? Colors.dark : Colors.light
  
  return (
    <View style={{flex : 1, backgroundColor : currentColors.backgroundDarkest}}>
      <Text>HomeDepartmentProposals</Text>
    </View>
  );
};
export default HomeDepartmentProposals;

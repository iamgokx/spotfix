import { View, Text } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
const analytics = () => {
  const colorTheme = useColorScheme();
  const currentColors = colorTheme =='dark' ? Colors.dark : Colors.light
  return (
    <View style={{backgroundColor : currentColors.backgroundDarker, flex : 1, justifyContent : 'center', alignItems : 'center'}}>
      <Text style={{color : currentColors.text}}>Work in progress...</Text>
    </View>
  );
};


export default analytics
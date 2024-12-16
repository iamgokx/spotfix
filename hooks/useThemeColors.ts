import { useColorScheme } from "react-native";

const useThemeColors = () => {
  const colorScheme = useColorScheme();
  const Colors = {
    light: {
      primary: "#fff",
      secondary: "#f0f0f0",
      accent: "#6200ee",
    },
    dark: {
      primary: "#000",
      secondary: "#121212",
      accent: "#bb86fc",
    },
  };

  return colorScheme === "dark" ? Colors.dark : Colors.light;
};

export default useThemeColors;

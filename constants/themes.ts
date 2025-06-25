import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

const SEED_COLOR = "#840032";

export const useFruityTheme = () => {
  const { theme: material3Theme } = useMaterial3Theme({
    sourceColor: SEED_COLOR,
    fallbackSourceColor: SEED_COLOR,
  });

  const hasMaterial3Colors =
    material3Theme &&
    typeof material3Theme === "object" &&
    "light" in material3Theme &&
    "dark" in material3Theme;

  const lightTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...(hasMaterial3Colors && material3Theme.light
        ? material3Theme.light
        : {}),
    },
  };

  const darkTheme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...(hasMaterial3Colors && material3Theme.dark ? material3Theme.dark : {}),
    },
  };

  return {
    lightTheme,
    darkTheme,
  };
};

export const { lightTheme, darkTheme } = (() => {
  const { theme } = useMaterial3Theme({
    sourceColor: SEED_COLOR,
    fallbackSourceColor: SEED_COLOR,
  });

  const hasColors = theme && "light" in theme && "dark" in theme;

  return {
    lightTheme: {
      ...MD3LightTheme,
      colors: {
        ...MD3LightTheme.colors,
        ...(hasColors ? theme.light : {}),
      },
    },
    darkTheme: {
      ...MD3DarkTheme,
      colors: {
        ...MD3DarkTheme.colors,
        ...(hasColors ? theme.dark : {}),
      },
    },
  };
})();

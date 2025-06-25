import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

const FRUITY_YELLOW = "#FFFD82";

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: FRUITY_YELLOW,
    primaryContainer: "#FFF9C4",
    secondary: "#FFB74D",
    secondaryContainer: "#FFF3C4",
    tertiary: "#81C784",
    tertiaryContainer: "#C8E6C9",
    surface: "#FFFBFE",
    surfaceVariant: "#F7F2FA",
    background: "#FFFBFE",
    error: "#BA1A1A",
    errorContainer: "#FFDAD6",
    onPrimary: "#1C1B00",
    onPrimaryContainer: "#1C1B00",
    onSecondary: "#2E1500",
    onSecondaryContainer: "#2E1500",
    onTertiary: "#002106",
    onTertiaryContainer: "#002106",
    onSurface: "#1C1B1E",
    onSurfaceVariant: "#49454E",
    onBackground: "#1C1B1E",
    outline: "#7A757F",
    outlineVariant: "#CAC4CF",
    inverseSurface: "#313033",
    inverseOnSurface: "#F4EFF4",
    inversePrimary: "#E6E100",
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#E6E100",
    primaryContainer: "#4A4800",
    secondary: "#DFC226",
    secondaryContainer: "#3E2F00",
    tertiary: "#A2D2A5",
    tertiaryContainer: "#0F3F12",
    surface: "#131316",
    surfaceVariant: "#49454E",
    background: "#101013",
    error: "#FFB4AB",
    errorContainer: "#93000A",
    onPrimary: "#333200",
    onPrimaryContainer: "#E6E100",
    onSecondary: "#3E2F00",
    onSecondaryContainer: "#DFC226",
    onTertiary: "#0F3F12",
    onTertiaryContainer: "#A2D2A5",
    onSurface: "#E6E1E6",
    onSurfaceVariant: "#CAC4CF",
    onBackground: "#E6E1E6",
    outline: "#938F99",
    outlineVariant: "#49454E",
    inverseSurface: "#E6E1E6",
    inverseOnSurface: "#313033",
    inversePrimary: "#FFFD82",
  },
};

export const useFruityTheme = () => {
  const { theme: material3Theme } = useMaterial3Theme();

  // Verificamos si material3Theme tiene la estructura esperada
  const hasMaterial3Colors =
    material3Theme &&
    typeof material3Theme === "object" &&
    "light" in material3Theme;

  const customLightTheme = {
    ...lightTheme,
    colors: {
      ...lightTheme.colors,
      // Solo aplicamos los colores de material3 si están disponibles
      ...(hasMaterial3Colors && material3Theme.light
        ? material3Theme.light
        : {}),
      // Mantenemos nuestro color primary personalizado
      primary: FRUITY_YELLOW,
    },
  };

  const customDarkTheme = {
    ...darkTheme,
    colors: {
      ...darkTheme.colors,
      // Solo aplicamos los colores de material3 si están disponibles
      ...(hasMaterial3Colors && material3Theme.dark ? material3Theme.dark : {}),
      // Mantenemos nuestro color primary personalizado para tema oscuro
      primary: "#E6E100",
    },
  };

  return {
    lightTheme: customLightTheme,
    darkTheme: customDarkTheme,
  };
};

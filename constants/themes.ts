// themes/index.js
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

// Colores base de tu paleta
const baseColors = {
  // Colores principales y de acento
  primary: "#4CAF50", // Verde brillante
  secondary: "#00695C", // Verde azulado oscuro
  tertiary: "#E91E63", // Rosa
  outline: "#BDBDBD",
  error: "#B00020",
  // Colores para contenedores y variantes
  primaryContainer: "#C8E6C9",
  secondaryContainer: "#82B1FF",
  tertiaryContainer: "#F8BBD0",
};

// Colores de tu nueva paleta (blanco y negro no puros)
const pureWhite = "#F3FCF0"; // Blanco ligeramente verdoso
const pureBlack = "#071E22"; // Verde azulado oscuro

// Tema Claro
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...baseColors,
    // Aquí usamos tus colores para el tema claro
    background: pureWhite, // Fondo principal crema/blanco
    onBackground: pureBlack, // Texto y elementos sobre fondo claro
    surface: pureWhite, // Superficies como tarjetas
    onSurface: pureBlack, // Texto sobre superficies
    onPrimary: pureWhite, // Texto sobre el color primario
    onSecondary: pureWhite,
    onTertiary: pureWhite,
    onPrimaryContainer: pureBlack,
    onSecondaryContainer: pureBlack,
    onTertiaryContainer: pureBlack,
  },
};

// Tema Oscuro
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...baseColors,
    // Aquí usamos tus colores para el tema oscuro
    background: pureBlack, // Fondo principal oscuro
    onBackground: pureWhite, // Texto sobre fondo oscuro
    surface: "#1E1E1E", // Superficies ligeramente más claras que el fondo
    onSurface: pureWhite, // Texto sobre superficies oscuras
    onPrimary: pureBlack,
    onSecondary: pureWhite,
    onTertiary: pureWhite,
    onPrimaryContainer: pureBlack,
    onSecondaryContainer: pureBlack,
    onTertiaryContainer: pureBlack,
  },
};

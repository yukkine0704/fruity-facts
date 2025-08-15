import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

// ---------------------------------------------------
// PALETA DE COLORES PASTEL
// ---------------------------------------------------

// Tus alternativas para blanco y negro puros
const offWhite = "#EAE8E6"; // Un blanco cálido y suave
const offBlack = "#242423"; // Un negro no tan intenso, más natural

// Paleta para el Tema Claro (Pastel)
const lightPastelPalette = {
  // Un azul cielo suave como color principal
  primary: "#8FB8DE",
  primaryContainer: "#D3E3F3",
  // Un verde menta para elementos secundarios
  secondary: "#A2D9A4",
  secondaryContainer: "#D9F1DA",
  // Un rosa coral suave para acentos o alertas
  tertiary: "#FFADAD",
  tertiaryContainer: "#FFE4E4",
  // Usamos tu color base para el fondo principal
  background: offWhite,
  // Las tarjetas un poco más claras para que se distingan sutilmente
  surface: "#F5F5F3",
  outline: "#BDBAAE",
  error: "#B00020",
  // --- Colores de texto (On-Color) ---
  // Sobre colores pastel claros, el texto oscuro funciona mejor
  onPrimary: offBlack,
  onPrimaryContainer: "#001D34",
  onSecondary: offBlack,
  onSecondaryContainer: "#0E1F0F",
  onTertiary: offBlack,
  onTertiaryContainer: "#2E1515",
  // El texto principal será tu negro alternativo
  onBackground: offBlack,
  onSurface: offBlack,
  onSurfaceVariant: "#4E4A49",
};

// Paleta para el Tema Oscuro (Pastel)
const darkPastelPalette = {
  // Los mismos tonos pastel, pero ajustados para un fondo oscuro
  primary: "#8FB8DE", // El azul pastel resalta muy bien
  primaryContainer: "#004877",
  secondary: "#A2D9A4", // El verde menta también
  secondaryContainer: "#254D28",
  tertiary: "#FFADAD",
  tertiaryContainer: "#753F3F",
  // Usamos tu color base para el fondo oscuro
  background: offBlack,
  // Las superficies un poco más claras para crear profundidad
  surface: "#333332",
  outline: "#989392",
  error: "#CF6679",
  // --- Colores de texto (On-Color) ---
  onPrimary: offBlack,
  onPrimaryContainer: "#D3E3F3",
  onSecondary: offBlack,
  onSecondaryContainer: "#D9F1DA",
  onTertiary: offBlack,
  onTertiaryContainer: "#FFE4E4",
  // El texto principal será tu blanco alternativo
  onBackground: offWhite,
  onSurface: offWhite,
  onSurfaceVariant: "#CDC6C4",
};

// ---------------------------------------------------
// DEFINICIÓN DE LOS TEMAS
// ---------------------------------------------------

// Tema Claro
export const lightTheme = {
  ...MD3LightTheme,
  // Mantenemos los bordes redondeados que le dan un toque moderno
  roundness: 3,
  colors: {
    ...MD3LightTheme.colors,
    ...lightPastelPalette,
  },
};

// Tema Oscuro
export const darkTheme = {
  ...MD3DarkTheme,
  roundness: 3, // Consistencia en la redondez
  colors: {
    ...MD3DarkTheme.colors,
    ...darkPastelPalette,
  },
};

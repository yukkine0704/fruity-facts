import { darkTheme, lightTheme } from "@/constants/themes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useColorScheme } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ThemeMode = "light" | "dark" | "system";

type ThemeStore = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  cycleTheme: () => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      themeMode: "dark",
      setThemeMode: (mode: ThemeMode) => set({ themeMode: mode }),
      toggleTheme: () => {
        const current = get().themeMode;
        if (current === "system") {
          set({ themeMode: "light" });
        } else if (current === "light") {
          set({ themeMode: "dark" });
        } else {
          set({ themeMode: "system" });
        }
      },
      cycleTheme: () => {
        const current = get().themeMode;
        const modes: ThemeMode[] = ["system", "light", "dark"];
        const currentIndex = modes.indexOf(current);
        const nextIndex = (currentIndex + 1) % modes.length;
        set({ themeMode: modes[nextIndex] });
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const { themeMode, setThemeMode, toggleTheme, cycleTheme } = useThemeStore();
  const isDarkMode = React.useMemo(() => {
    if (themeMode === "system") {
      return systemColorScheme === "dark";
    }
    return themeMode === "dark";
  }, [themeMode, systemColorScheme]);

  const theme = React.useMemo(() => {
    return isDarkMode ? darkTheme : lightTheme;
  }, [isDarkMode, darkTheme, lightTheme]);

  const getThemeDisplayName = React.useMemo(() => {
    switch (themeMode) {
      case "light":
        return "Claro";
      case "dark":
        return "Oscuro";
      case "system":
        return "Sistema";
      default:
        return "Sistema";
    }
  }, [themeMode]);

  const getThemeIcon = React.useMemo(() => {
    switch (themeMode) {
      case "light":
        return "white-balance-sunny";
      case "dark":
        return "moon-waning-crescent";
      case "system":
        return "theme-light-dark";
      default:
        return "theme-light-dark";
    }
  }, [themeMode]);

  return {
    isDarkMode,
    theme,
    themeMode,
    setThemeMode,
    toggleTheme,
    cycleTheme,
    getThemeDisplayName,
    getThemeIcon,
    systemColorScheme,
  };
};

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme } = useTheme();

  return <PaperProvider theme={theme}>{children}</PaperProvider>;
};

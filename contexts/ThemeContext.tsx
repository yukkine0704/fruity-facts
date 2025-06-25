import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useColorScheme } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useFruityTheme } from "../constants/themes";

type ThemeMode = "light" | "dark" | "system";

type ThemeStore = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      themeMode: "system",
      setThemeMode: (mode: ThemeMode) => set({ themeMode: mode }),
      toggleTheme: () => {
        const current = get().themeMode;
        if (current === "system") {
          set({ themeMode: "light" });
        } else if (current === "light") {
          set({ themeMode: "dark" });
        } else {
          set({ themeMode: "light" });
        }
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
  const { themeMode } = useThemeStore();
  const { lightTheme, darkTheme } = useFruityTheme();

  const isDarkMode = React.useMemo(() => {
    if (themeMode === "system") {
      return systemColorScheme === "dark";
    }
    return themeMode === "dark";
  }, [themeMode, systemColorScheme]);

  const theme = React.useMemo(() => {
    return isDarkMode ? darkTheme : lightTheme;
  }, [isDarkMode, darkTheme, lightTheme]);

  return {
    isDarkMode,
    theme,
    themeMode,
    setThemeMode: useThemeStore.getState().setThemeMode,
    toggleTheme: useThemeStore.getState().toggleTheme,
  };
};

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme } = useTheme();

  return <PaperProvider theme={theme}>{children}</PaperProvider>;
};

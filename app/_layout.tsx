// app/_layout.tsx

import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { useStatusBarHeight } from "@/hooks/useStatusBarHeight";
import { hexToRgba } from "@/utils/hexConverter";
import { BlurView } from "expo-blur";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Componente para el overlay de blur en la barra de estado
function StatusBarBlurOverlay() {
  const { theme } = useTheme();
  const statusBarHeight = useStatusBarHeight();

  if (statusBarHeight === 0) {
    return null;
  }

  const blurTint = theme.dark ? "dark" : "light";
  const blurBackgroundColor = hexToRgba(
    theme.colors.surface,
    Platform.OS === "android" ? 0.75 : 0.75
  );

  return (
    <View style={[styles.statusBarOverlay, { height: statusBarHeight }]}>
      <BlurView
        intensity={Platform.OS === "android" ? 25 : 15}
        tint={blurTint}
        style={[
          styles.statusBarBlur,
          {
            backgroundColor: blurBackgroundColor,
          },
        ]}
        experimentalBlurMethod="dimezisBlurView"
      />
    </View>
  );
}

// Wrapper para el contenido principal de la app
function AppContent() {
  return (
    <>
      <StatusBar
        style="auto"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Overlay de blur para status bar */}
      <StatusBarBlurOverlay />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: {
            backgroundColor: "transparent",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            contentStyle: {
              backgroundColor: "transparent",
            },
          }}
        />
        {/* Aquí puedes añadir otras pantallas a medida que las vayas creando */}
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PaperProvider>
          <AppContent />
        </PaperProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  statusBarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    ...Platform.select({
      android: {
        elevation: 10,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  statusBarBlur: {
    flex: 1,
    overflow: "hidden",
  },
});

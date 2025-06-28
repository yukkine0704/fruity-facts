import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { useStatusBarHeight } from "@/hooks/useStatusBarHeight";
import { hexToRgba } from "@/utils/hexConverter";
import { BlurView } from "expo-blur";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

function StatusBarBlurOverlay() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

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
        intensity={Platform.OS === "android" ? 25 : 15} // Más intensidad en Android
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

// Wrapper para el contenido principal
function AppContent() {
  return (
    <>
      <StatusBar
        style="auto"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Overlay de blur para status bar - funciona en iOS y Android */}
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
          name="(tabs)"
          options={{
            headerShown: false,
            contentStyle: {
              backgroundColor: "transparent",
            },
          }}
        />
        <Stack.Screen
          name="fruit-details/[fruitName]"
          options={{
            headerShown: false,
            presentation: "card",
            contentStyle: {
              backgroundColor: "transparent",
            },
          }}
        />
        <Stack.Screen
          name="search/index"
          options={{
            headerShown: false,
            presentation: "card",
            contentStyle: {
              backgroundColor: "transparent",
            },
          }}
        />
        <Stack.Screen
          name="compare/index"
          options={{
            headerShown: false,
            presentation: "card",
            contentStyle: {
              backgroundColor: "transparent",
            },
          }}
        />
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
        elevation: 10, // Sombra en Android
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

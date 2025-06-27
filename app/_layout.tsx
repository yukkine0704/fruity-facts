import { ThemeProvider } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <PaperProvider>
        <StatusBar
          style="auto"
          backgroundColor="transparent"
          translucent={true}
        />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="fruit-details/[fruitName]"
            options={{
              headerShown: false,
              presentation: "card",
            }}
          />
          <Stack.Screen
            name="search/index"
            options={{
              headerShown: false,
              presentation: "card",
            }}
          />
          <Stack.Screen
            name="compare/index"
            options={{
              headerShown: false,
              presentation: "card",
            }}
          />
        </Stack>
      </PaperProvider>
    </ThemeProvider>
  );
}

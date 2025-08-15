// app/[...unmatched].tsx

import { Link } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

// Iconos de Lucide
import { Frown } from "lucide-react-native";

export default function NotFoundScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Frown size={80} color={theme.colors.onBackground} />
        <Text
          variant="displaySmall"
          style={[styles.title, { color: theme.colors.onBackground }]}
        >
          404 - ¡Página no encontrada!
        </Text>
        <Text
          variant="bodyLarge"
          style={[styles.description, { color: theme.colors.onBackground }]}
        >
          Lo sentimos, la página que estás buscando no existe.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Link href="/" asChild>
          <Button
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Volver al inicio
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 24,
  },
  button: {
    borderRadius: 12,
  },
  buttonLabel: {
    fontWeight: "bold",
    fontSize: 16,
    paddingVertical: 4,
  },
});

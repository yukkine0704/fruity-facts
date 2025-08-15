// app/landing.tsx

import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

// Iconos de Lucide
import { Carrot } from "lucide-react-native";

// URL de una imagen de Unsplash para la landing page.
// He seleccionado esta por su estilo minimalista y relacionado con alimentos.
const UNSPLASH_IMAGE_URL =
  "https://images.unsplash.com/photo-1542838132-de9748b6f3b0?q=80&w=1974&auto=format&fit=crop";

export default function LandingScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: UNSPLASH_IMAGE_URL }}
          style={styles.image}
          contentFit="cover"
          transition={500}
        />
        <View style={styles.overlay} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Carrot size={48} color={theme.colors.onSurface} />
          <Text
            variant="headlineLarge"
            style={[styles.title, { color: theme.colors.onSurface }]}
          >
            Fruity Facts
          </Text>
        </View>
        <Text
          variant="bodyLarge"
          style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
        >
          Descubre información nutricional detallada de tus alimentos favoritos,
          directamente desde la base de datos de la USDA.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Link href="/search" asChild>
          <Button
            mode="contained"
            onPress={() => console.log("Botón de empezar presionado")}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            ¡Comenzar ahora!
          </Button>
        </Link>
        <Link href="/login" asChild>
          <Button
            mode="text"
            onPress={() => console.log("Botón de iniciar sesión presionado")}
            style={styles.secondaryButton}
            labelStyle={{ color: theme.colors.primary }}
          >
            Ya tengo una cuenta
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  imageContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontWeight: "bold",
  },
  description: {
    textAlign: "center",
  },
  buttonContainer: {
    gap: 12,
    alignItems: "center",
  },
  button: {
    width: "100%",
    borderRadius: 12,
  },
  buttonLabel: {
    fontWeight: "bold",
    fontSize: 16,
    paddingVertical: 4,
  },
  secondaryButton: {
    width: "100%",
  },
});

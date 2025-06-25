import { HelloWave } from "@/components/HelloWave";
import { useTheme } from "@/contexts/ThemeContext";
import { Image } from "expo-image";
import React from "react";
import { Platform, ScrollView, StyleSheet } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Divider,
  Surface,
  Text,
} from "react-native-paper";

export default function HomeScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Card */}
      <Card
        style={[
          styles.headerCard,
          { backgroundColor: theme.colors.primaryContainer },
        ]}
      >
        <Card.Content style={styles.headerContent}>
          <Surface
            style={[
              styles.logoContainer,
              { backgroundColor: theme.colors.surface },
            ]}
            elevation={2}
          >
            <Image
              source={require("@/assets/images/partial-react-logo.png")}
              style={styles.reactLogo}
            />
          </Surface>
          <Text
            variant="headlineLarge"
            style={[
              styles.welcomeText,
              { color: theme.colors.onPrimaryContainer },
            ]}
          >
            ¡Bienvenido! 🍊
          </Text>
          <HelloWave />
        </Card.Content>
      </Card>

      {/* Steps Cards */}
      <Card
        style={[styles.stepCard, { backgroundColor: theme.colors.surface }]}
        elevation={2}
      >
        <Card.Content>
          <Text
            variant="headlineSmall"
            style={{ color: theme.colors.primary, marginBottom: 8 }}
          >
            🚀 Paso 1: Pruébalo
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
            Edita{" "}
            <Text style={{ fontWeight: "bold", color: theme.colors.primary }}>
              app/(tabs)/index.tsx
            </Text>{" "}
            para ver los cambios.
          </Text>
          <Chip
            style={[
              styles.platformChip,
              { backgroundColor: theme.colors.secondaryContainer },
            ]}
            textStyle={{ color: theme.colors.onSecondaryContainer }}
          >
            {Platform.select({
              ios: "⌘ + D para herramientas",
              android: "⌘ + M para herramientas",
              web: "F12 para herramientas",
            })}
          </Chip>
        </Card.Content>
      </Card>

      <Card
        style={[styles.stepCard, { backgroundColor: theme.colors.surface }]}
        elevation={2}
      >
        <Card.Content>
          <Text
            variant="headlineSmall"
            style={{ color: theme.colors.secondary, marginBottom: 8 }}
          >
            🔍 Paso 2: Explora
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurface, marginBottom: 12 }}
          >
            Toca la pestaña Explorar para descubrir más sobre esta app.
          </Text>
          <Button
            mode="contained-tonal"
            onPress={() => console.log("Ir a Explorar")}
            buttonColor={theme.colors.secondaryContainer}
            textColor={theme.colors.onSecondaryContainer}
          >
            Ir a Explorar
          </Button>
        </Card.Content>
      </Card>

      <Card
        style={[styles.stepCard, { backgroundColor: theme.colors.surface }]}
        elevation={2}
      >
        <Card.Content>
          <Text
            variant="headlineSmall"
            style={{ color: theme.colors.tertiary, marginBottom: 8 }}
          >
            ✨ Paso 3: Nuevo Comienzo
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurface, marginBottom: 12 }}
          >
            Cuando estés listo, ejecuta{" "}
            <Text style={{ fontWeight: "bold", color: theme.colors.tertiary }}>
              npm run reset-project
            </Text>{" "}
            para obtener un directorio{" "}
            <Text style={{ fontWeight: "bold" }}>app</Text> nuevo.
          </Text>
          <Divider style={{ marginVertical: 8 }} />
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Esto moverá el <Text style={{ fontWeight: "bold" }}>app</Text>{" "}
            actual a <Text style={{ fontWeight: "bold" }}>app-example</Text>.
          </Text>
        </Card.Content>
      </Card>

      {/* Fruity Facts Info */}
      <Card
        style={[
          styles.infoCard,
          { backgroundColor: theme.colors.tertiaryContainer },
        ]}
        elevation={1}
      >
        <Card.Content style={styles.infoContent}>
          <Avatar.Icon
            size={48}
            icon="fruit-citrus"
            style={{ backgroundColor: theme.colors.tertiary }}
          />
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.onTertiaryContainer }}
          >
            Fruity Facts App
          </Text>
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onTertiaryContainer }}
          >
            Descubre datos increíbles sobre frutas 🍎🍌🍇
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    borderRadius: 16,
  },
  headerContent: {
    alignItems: "center",
    padding: 8,
  },
  logoContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reactLogo: {
    height: 120,
    width: 160,
  },
  welcomeText: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "bold",
  },
  stepCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  platformChip: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  infoCard: {
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 12,
  },
  infoContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});

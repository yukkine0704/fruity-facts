import { HelloWave } from "@/components/HelloWave";
import { useTheme } from "@/contexts/ThemeContext";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Chip, Surface, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { theme } = useTheme();

  const handleNavigateToExplore = () => {
    router.push("/(tabs)/explore");
  };

  const handleNavigateToSearch = () => {
    router.push("/search");
  };

  const handleNavigateToCompare = () => {
    router.push("/compare");
  };

  const handleNavigateToFavorites = () => {
    router.push("/(tabs)/favorites");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={[
          styles.scrollView,
          { backgroundColor: theme.colors.background },
        ]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Card */}
        <Card
          style={[
            styles.headerCard,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
          elevation={3}
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
                contentFit="contain"
              />
            </Surface>
            <Text
              variant="headlineLarge"
              style={[
                styles.welcomeText,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              ¡Bienvenido a Fruity Facts! 🍊
            </Text>
            <HelloWave />
            <Text
              variant="bodyMedium"
              style={[
                styles.description,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              Descubre el mundo de las frutas y sus beneficios nutricionales
            </Text>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card
          style={[
            styles.actionsCard,
            { backgroundColor: theme.colors.surface },
          ]}
          elevation={2}
        >
          <Card.Content>
            <Text
              variant="headlineSmall"
              style={{ color: theme.colors.primary, marginBottom: 16 }}
            >
              🚀 Acciones Rápidas
            </Text>

            <Button
              mode="contained"
              onPress={handleNavigateToExplore}
              icon="compass"
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.primary },
              ]}
              labelStyle={{ color: theme.colors.onPrimary }}
            >
              Explorar Frutas
            </Button>

            <Button
              mode="contained-tonal"
              onPress={handleNavigateToSearch}
              icon="magnify"
              style={styles.actionButton}
              buttonColor={theme.colors.secondaryContainer}
              textColor={theme.colors.onSecondaryContainer}
            >
              Búsqueda Avanzada
            </Button>

            <Button
              mode="contained-tonal"
              onPress={handleNavigateToFavorites}
              icon="heart"
              style={styles.actionButton}
              buttonColor={theme.colors.tertiaryContainer}
              textColor={theme.colors.onTertiaryContainer}
            >
              Mis Favoritos
            </Button>

            <Button
              mode="outlined"
              onPress={handleNavigateToCompare}
              icon="scale-balance"
              style={styles.actionButton}
            >
              Comparar Frutas
            </Button>
          </Card.Content>
        </Card>

        {/* Features Card */}
        <Card
          style={[
            styles.featuresCard,
            { backgroundColor: theme.colors.surface },
          ]}
          elevation={2}
        >
          <Card.Content>
            <Text
              variant="headlineSmall"
              style={{ color: theme.colors.secondary, marginBottom: 16 }}
            >
              ✨ Características
            </Text>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Avatar.Icon
                  size={40}
                  icon="database"
                  style={{ backgroundColor: theme.colors.primaryContainer }}
                />
                <View style={styles.featureText}>
                  <Text
                    variant="titleSmall"
                    style={{ color: theme.colors.onSurface }}
                  >
                    Base de datos USDA
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.outline }}
                  >
                    Información nutricional oficial y actualizada
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <Avatar.Icon
                  size={40}
                  icon="heart"
                  style={{ backgroundColor: theme.colors.secondaryContainer }}
                />
                <View style={styles.featureText}>
                  <Text
                    variant="titleSmall"
                    style={{ color: theme.colors.onSurface }}
                  >
                    Favoritos personalizados
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.outline }}
                  >
                    Guarda tus frutas favoritas para acceso rápido
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <Avatar.Icon
                  size={40}
                  icon="compare"
                  style={{ backgroundColor: theme.colors.tertiaryContainer }}
                />
                <View style={styles.featureText}>
                  <Text
                    variant="titleSmall"
                    style={{ color: theme.colors.onSurface }}
                  >
                    Comparación nutricional
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.outline }}
                  >
                    Compara valores nutricionales lado a lado
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <Avatar.Icon
                  size={40}
                  icon="magnify"
                  style={{ backgroundColor: theme.colors.primaryContainer }}
                />
                <View style={styles.featureText}>
                  <Text
                    variant="titleSmall"
                    style={{ color: theme.colors.onSurface }}
                  >
                    Búsqueda avanzada
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.outline }}
                  >
                    Filtros y opciones de búsqueda personalizadas
                  </Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Getting Started */}
        <Card
          style={[styles.stepCard, { backgroundColor: theme.colors.surface }]}
          elevation={2}
        >
          <Card.Content>
            <Text
              variant="headlineSmall"
              style={{ color: theme.colors.tertiary, marginBottom: 16 }}
            >
              � Primeros Pasos
            </Text>

            <View style={styles.stepsList}>
              <View style={styles.stepItem}>
                <Chip
                  icon="numeric-1"
                  style={[
                    styles.stepChip,
                    { backgroundColor: theme.colors.primaryContainer },
                  ]}
                  textStyle={{ color: theme.colors.onPrimaryContainer }}
                >
                  Paso 1
                </Chip>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurface, flex: 1 }}
                >
                  Explora el catálogo de frutas disponibles
                </Text>
              </View>

              <View style={styles.stepItem}>
                <Chip
                  icon="numeric-2"
                  style={[
                    styles.stepChip,
                    { backgroundColor: theme.colors.secondaryContainer },
                  ]}
                  textStyle={{ color: theme.colors.onSecondaryContainer }}
                >
                  Paso 2
                </Chip>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurface, flex: 1 }}
                >
                  Toca cualquier fruta para ver su información nutricional
                </Text>
              </View>

              <View style={styles.stepItem}>
                <Chip
                  icon="numeric-3"
                  style={[
                    styles.stepChip,
                    { backgroundColor: theme.colors.tertiaryContainer },
                  ]}
                  textStyle={{ color: theme.colors.onTertiaryContainer }}
                >
                  Paso 3
                </Chip>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurface, flex: 1 }}
                >
                  Guarda tus favoritas y compáralas entre sí
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Development Info */}
        <Card
          style={[styles.stepCard, { backgroundColor: theme.colors.surface }]}
          elevation={2}
        >
          <Card.Content>
            <Text
              variant="headlineSmall"
              style={{ color: theme.colors.primary, marginBottom: 8 }}
            >
              🛠️ Para Desarrolladores
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurface }}
            >
              Edita{" "}
              <Text style={{ fontWeight: "bold", color: theme.colors.primary }}>
                app/(tabs)/index.tsx
              </Text>{" "}
              para ver los cambios en tiempo real.
            </Text>
            <Chip
              style={[
                styles.platformChip,
                { backgroundColor: theme.colors.secondaryContainer },
              ]}
              textStyle={{ color: theme.colors.onSecondaryContainer }}
            >
              {Platform.select({
                ios: "⌘ + D para herramientas de desarrollo",
                android: "⌘ + M para herramientas de desarrollo",
                web: "F12 para herramientas de desarrollo",
              })}
            </Chip>
          </Card.Content>
        </Card>

        {/* App Info */}
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
            <View style={styles.infoText}>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.onTertiaryContainer }}
              >
                Fruity Facts v1.0.0
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onTertiaryContainer }}
              >
                Desarrollado con React Native y Expo
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onTertiaryContainer }}
              >
                Datos nutricionales de USDA Food Database
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
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
  description: {
    textAlign: "center",
    marginTop: 8,
    opacity: 0.9,
  },
  actionsCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 24,
  },
  featuresCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    flex: 1,
  },
  stepCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  stepsList: {
    gap: 12,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepChip: {
    minWidth: 80,
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
  infoText: {
    flex: 1,
  },
});

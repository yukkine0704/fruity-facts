import { HelloWave } from "@/components/HelloWave";
import { useTheme } from "@/contexts/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Importamos los iconos
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
          elevation={theme.dark ? 2 : 3} // Ajusta la elevación según el tema
        >
          <Card.Content style={styles.headerContent}>
            <Surface
              style={[
                styles.logoContainer,
                { backgroundColor: theme.colors.surfaceVariant }, // Usar surfaceVariant para un contraste sutil
              ]}
              elevation={theme.dark ? 1 : 2}
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
              ¡Bienvenido a Fruity Facts! <HelloWave />
            </Text>
            <Text
              variant="bodyMedium"
              style={[
                styles.description,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              Descubre el mundo de las frutas y sus beneficios nutricionales.
            </Text>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card
          style={[
            styles.actionsCard,
            { backgroundColor: theme.colors.surface },
          ]}
          elevation={theme.dark ? 1 : 2}
        >
          <Card.Content>
            <Text
              variant="titleLarge" // Cambiado a titleLarge para un mejor impacto
              style={{ color: theme.colors.primary, marginBottom: 16 }}
            >
              <MaterialCommunityIcons name="rocket" size={24} /> Acciones
              Rápidas
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
              textColor={theme.colors.onSurface} // Color del texto para outlined
              labelStyle={{ color: theme.colors.primary }} // Color del label
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
          elevation={theme.dark ? 1 : 2}
        >
          <Card.Content>
            <Text
              variant="titleLarge" // Cambiado a titleLarge
              style={{ color: theme.colors.secondary, marginBottom: 16 }}
            >
              <MaterialCommunityIcons name="star-four-points" size={24} />{" "}
              Características
            </Text>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Avatar.Icon
                  size={40}
                  icon="database"
                  style={{ backgroundColor: theme.colors.primaryContainer }}
                  color={theme.colors.onPrimaryContainer} // Color del icono dentro del Avatar
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
                  icon="heart-outline" // Cambiado a outline para un estilo más suave
                  style={{ backgroundColor: theme.colors.secondaryContainer }}
                  color={theme.colors.onSecondaryContainer}
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
                  icon="scale-balance" // Reutilizamos el icono de comparar
                  style={{ backgroundColor: theme.colors.tertiaryContainer }}
                  color={theme.colors.onTertiaryContainer}
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
                  color={theme.colors.onPrimaryContainer}
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
          elevation={theme.dark ? 1 : 2}
        >
          <Card.Content>
            <Text
              variant="titleLarge" // Cambiado a titleLarge
              style={{ color: theme.colors.tertiary, marginBottom: 16 }}
            >
              <MaterialCommunityIcons name="gesture-tap" size={24} /> Primeros
              Pasos
            </Text>

            <View style={styles.stepsList}>
              <View style={styles.stepItem}>
                <Chip
                  icon={() => (
                    <MaterialCommunityIcons
                      name="numeric-1-box" // Icono de número en un cuadro
                      size={20}
                      color={theme.colors.onPrimaryContainer}
                    />
                  )}
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
                  icon={() => (
                    <MaterialCommunityIcons
                      name="numeric-2-box"
                      size={20}
                      color={theme.colors.onSecondaryContainer}
                    />
                  )}
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
                  icon={() => (
                    <MaterialCommunityIcons
                      name="numeric-3-box"
                      size={20}
                      color={theme.colors.onTertiaryContainer}
                    />
                  )}
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
          elevation={theme.dark ? 1 : 2}
        >
          <Card.Content>
            <Text
              variant="titleLarge" // Cambiado a titleLarge
              style={{ color: theme.colors.primary, marginBottom: 8 }}
            >
              <MaterialCommunityIcons name="tools" size={24} /> Para
              Desarrolladores
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
          elevation={theme.dark ? 0 : 1}
        >
          <Card.Content style={styles.infoContent}>
            <Avatar.Icon
              size={48}
              icon="fruit-citrus"
              style={{ backgroundColor: theme.colors.tertiary }}
              color={theme.colors.onTertiary} // Color del icono dentro del Avatar
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16, // Espaciado horizontal para el contenido
    paddingBottom: 32,
    paddingTop: 16, // Añadir un poco de padding superior para que no esté pegado al AppBar
  },
  headerCard: {
    marginBottom: 24, // Aumentado el margen inferior para más espacio
    borderRadius: 20, // Bordes más redondeados para un look moderno
    overflow: "hidden", // Asegura que el contenido respete el borderRadius
  },
  headerContent: {
    alignItems: "center",
    paddingVertical: 32, // Más padding vertical
    paddingHorizontal: 16,
  },
  logoContainer: {
    borderRadius: 16, // Bordes más redondeados para el contenedor del logo
    padding: 20, // Más padding
    marginBottom: 24, // Más margen inferior
  },
  reactLogo: {
    height: 100, // Ajuste de tamaño para el logo
    width: 140,
  },
  welcomeText: {
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "bold",
  },
  description: {
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22, // Mejora la legibilidad
  },
  actionsCard: {
    marginBottom: 24, // Margen consistente
    borderRadius: 16,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 28, // Más redondeado
    height: 56, // Altura estándar para botones de Material Design
    justifyContent: "center", // Centra el contenido verticalmente
  },
  featuresCard: {
    marginBottom: 24, // Margen consistente
    borderRadius: 16,
  },
  featuresList: {
    gap: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  featureText: {
    flex: 1,
  },
  stepCard: {
    marginBottom: 16,
    borderRadius: 16,
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  stepChip: {
    minWidth: 90,
    justifyContent: "center",
    paddingVertical: 4,
    borderRadius: 20,
  },
  platformChip: {
    marginTop: 16,
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  infoCard: {
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 16,
  },
  infoContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 20,
  },
  infoText: {
    flex: 1,
  },
});

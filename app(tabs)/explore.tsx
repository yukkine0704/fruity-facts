import { FruitCard } from "@/components/FruitCard";
import { FruitCardSkeleton } from "@/components/FruitCardSkeleton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/contexts/ThemeContext";
import { useFruitStore } from "@/stores/fruitStore";
import { Fruit } from "@/types/fruit";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  FAB,
  Snackbar,
  Surface,
  Text,
} from "react-native-paper";

export default function ExploreScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isScreenFocused, setIsScreenFocused] = React.useState(false);

  const {
    fruits,
    isLoading,
    error,
    fetchAllFruits,
    fetchNutritionStats,
    clearError,
    nutritionStats,
  } = useFruitStore();

  useFocusEffect(
    React.useCallback(() => {
      setIsScreenFocused(true);
      loadFruits();
      return () => {
        setIsScreenFocused(false);
      };
    }, [])
  );

  const loadFruits = async () => {
    try {
      await fetchAllFruits();
      await fetchNutritionStats();
    } catch (err) {
      console.error("Error loading fruits:", err);
    }
  };

  const handleRefresh = async () => {
    await loadFruits();
    showMessage("Frutas actualizadas 🍎");
  };

  const handleFruitPress = (fruit: Fruit) => {
    showMessage(`Navegando a detalles de: ${fruit.name} 🔍`);

    // Navegar a la pantalla de detalles
    router.push({
      pathname: "/fruit-details[fruitName]",
      params: { fruitName: fruit.name },
    });
  };

  const showMessage = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  const handleRetry = () => {
    clearError();
    loadFruits();
  };

  const renderHeader = () => (
    <Surface
      style={[
        styles.header,
        { backgroundColor: theme.colors.primaryContainer },
      ]}
      elevation={3}
    >
      <IconSymbol
        size={60}
        color={theme.colors.onPrimaryContainer}
        name="apple.logo"
        style={styles.headerIcon}
      />
      <Text
        variant="headlineLarge"
        style={[styles.title, { color: theme.colors.onPrimaryContainer }]}
      >
        Fruity Facts
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.subtitle, { color: theme.colors.onPrimaryContainer }]}
      >
        Descubre el mundo de las frutas y sus beneficios nutricionales
      </Text>

      {nutritionStats && (
        <Surface
          style={[
            styles.statsContainer,
            { backgroundColor: theme.colors.surface },
          ]}
          elevation={2}
        >
          <View style={styles.statItem}>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.primary, fontWeight: "bold" }}
            >
              {nutritionStats.totalFruits}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
              Frutas
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.secondary, fontWeight: "bold" }}
            >
              {nutritionStats.averageCalories}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
              Cal. promedio
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.tertiary, fontWeight: "bold" }}
            >
              {nutritionStats.highestProtein.name}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
              Más proteína
            </Text>
          </View>
        </Surface>
      )}
    </Surface>
  );

  const renderError = () => (
    <Surface
      style={[
        styles.errorContainer,
        { backgroundColor: theme.colors.errorContainer },
      ]}
      elevation={2}
    >
      <IconSymbol
        name="exclamationmark.triangle"
        size={48}
        color={theme.colors.onErrorContainer}
        style={styles.errorIcon}
      />
      <Text
        variant="titleMedium"
        style={[styles.errorTitle, { color: theme.colors.onErrorContainer }]}
      >
        ¡Ups! Algo salió mal
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.errorMessage, { color: theme.colors.onErrorContainer }]}
      >
        {error}
      </Text>
      <Button
        mode="contained"
        onPress={handleRetry}
        style={[styles.retryButton, { backgroundColor: theme.colors.error }]}
        labelStyle={{ color: theme.colors.onError }}
      >
        Reintentar
      </Button>
    </Surface>
  );

  const renderEmptyState = () => (
    <Surface
      style={[
        styles.emptyContainer,
        { backgroundColor: theme.colors.surfaceVariant },
      ]}
      elevation={1}
    >
      <IconSymbol
        name="questionmark.folder"
        size={64}
        color={theme.colors.onSurfaceVariant}
        style={styles.emptyIcon}
      />
      <Text
        variant="titleLarge"
        style={[styles.emptyTitle, { color: theme.colors.onSurfaceVariant }]}
      >
        No hay frutas disponibles
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.emptyMessage, { color: theme.colors.onSurfaceVariant }]}
      >
        Intenta recargar la lista para ver las frutas disponibles
      </Text>
      <Button
        mode="outlined"
        onPress={handleRefresh}
        style={styles.refreshButton}
      >
        Recargar
      </Button>
    </Surface>
  );

  const renderSkeletons = () => (
    <View>
      {Array.from({ length: 6 }, (_, index) => (
        <FruitCardSkeleton key={`skeleton-${index}`} index={index} />
      ))}
    </View>
  );

  const renderContent = () => {
    if (error) {
      return renderError();
    }

    if (isLoading) {
      return renderSkeletons();
    }

    if (fruits.length === 0) {
      return renderEmptyState();
    }

    return (
      <View style={styles.fruitsContainer}>
        <Text
          variant="titleMedium"
          style={[styles.fruitsTitle, { color: theme.colors.onBackground }]}
        >
          🍎 Todas las frutas ({fruits.length})
        </Text>
        <Text
          variant="bodySmall"
          style={[styles.instructionText, { color: theme.colors.outline }]}
        >
          Toca una fruta para ver su información nutricional detallada
        </Text>
        {fruits.map((fruit, index) => (
          <FruitCard
            key={fruit.id}
            fruit={fruit}
            onPress={handleFruitPress}
            index={index}
          />
        ))}
      </View>
    );
  };

  if (!isScreenFocused) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeader()}
        {renderContent()}

        {/* Espaciado inferior para el FAB */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* FAB */}
      <FAB
        icon="refresh"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleRefresh}
        loading={isLoading}
        disabled={isLoading}
      />

      {/* Snackbar */}
      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
        style={{ backgroundColor: theme.colors.inverseSurface }}
        action={{
          label: "OK",
          onPress: () => setShowSnackbar(false),
        }}
      >
        <Text style={{ color: theme.colors.inverseOnSurface }}>
          {snackbarMessage}
        </Text>
      </Snackbar>
    </View>
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
    paddingBottom: 100,
  },
  header: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
  },
  headerIcon: {
    marginBottom: 12,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    width: "100%",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  fruitsContainer: {},
  fruitsTitle: {
    fontWeight: "bold",
    marginHorizontal: 16,
    marginBottom: 4,
    fontSize: 18,
  },
  instructionText: {
    marginHorizontal: 16,
    marginBottom: 16,
    textAlign: "center",
    fontStyle: "italic",
  },
  // Error styles
  errorContainer: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  errorMessage: {
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    borderRadius: 24,
    paddingHorizontal: 16,
  },
  // Empty state styles
  emptyContainer: {
    margin: 16,
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyMessage: {
    textAlign: "center",
    marginBottom: 16,
  },
  refreshButton: {
    borderRadius: 24,
  },
  bottomSpacing: {
    height: 80,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 28,
  },
});

// src/components/FruitList.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { AlertCircle, RefreshCcw, Search } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";

interface FruitListStateProps {
  isLoading: boolean;
  error: string | null;
  filteredFruitsLength: number;
  searchQuery: string;
  onRetry: () => void;
  onClearSearch: () => void;
}

export function FruitListState({
  isLoading,
  error,
  filteredFruitsLength,
  searchQuery,
  onRetry,
  onClearSearch,
}: FruitListStateProps) {
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.stateContainer, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}
        >
          Cargando frutas...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.stateContainer, styles.errorContainer]}>
        <AlertCircle size={48} stroke={theme.colors.error} />
        <Text
          variant="titleMedium"
          style={[styles.title, { color: theme.colors.onErrorContainer }]}
        >
          ¡Ups!
        </Text>
        <Text
          variant="bodyMedium"
          style={[styles.message, { color: theme.colors.onErrorContainer }]}
        >
          Algo salió mal. Por favor, inténtalo de nuevo.
        </Text>
        <Button mode="contained" onPress={onRetry} style={styles.button}>
          Reintentar
        </Button>
      </View>
    );
  }

  if (filteredFruitsLength === 0 && searchQuery) {
    return (
      <View style={[styles.stateContainer, styles.emptyContainer]}>
        <Search size={48} stroke={theme.colors.onSurfaceVariant} />
        <Text
          variant="titleMedium"
          style={[styles.title, { color: theme.colors.onSurfaceVariant }]}
        >
          No se encontraron frutas
        </Text>
        <Text
          variant="bodyMedium"
          style={[styles.message, { color: theme.colors.onSurfaceVariant }]}
        >
          Intenta con otro término de búsqueda.
        </Text>
        <Button mode="text" onPress={onClearSearch} style={styles.button}>
          Limpiar búsqueda
        </Button>
      </View>
    );
  }

  if (filteredFruitsLength === 0 && !searchQuery) {
    return (
      <View style={[styles.stateContainer, styles.emptyContainer]}>
        <RefreshCcw size={48} stroke={theme.colors.onSurfaceVariant} />
        <Text
          variant="titleMedium"
          style={[styles.title, { color: theme.colors.onSurfaceVariant }]}
        >
          No hay frutas disponibles
        </Text>
        <Text
          variant="bodyMedium"
          style={[styles.message, { color: theme.colors.onSurfaceVariant }]}
        >
          Intenta recargar la lista.
        </Text>
        <Button mode="text" onPress={onRetry} style={styles.button}>
          Recargar
        </Button>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  stateContainer: {
    padding: 24,
    alignItems: "center",
  },
  loadingContainer: {
    minHeight: 150,
    justifyContent: "center",
  },
  errorContainer: {
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 32,
    backgroundColor: "rgba(255, 0, 0, 0.1)",
  },
  emptyContainer: {
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 32,
  },
  title: {
    fontWeight: "bold",
    marginTop: 16,
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  button: {
    marginTop: 12,
  },
});

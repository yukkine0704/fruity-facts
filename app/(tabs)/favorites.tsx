import { FruitCard } from "@/components/FruitCard";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/contexts/ThemeContext";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { Fruit } from "@/types/fruit";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Chip,
  FAB,
  IconButton,
  Menu,
  Searchbar,
  Snackbar,
  Surface,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavoritesScreen() {
  const { theme } = useTheme();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "dateAdded" | "calories">(
    "dateAdded"
  );

  const {
    favorites,
    isLoading,
    loadFavorites,
    removeFavorite,
    clearAllFavorites,
    getFavoriteStats,
  } = useFavoritesStore();

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleRefresh = async () => {
    await loadFavorites();
    showMessage("Favoritos actualizados 💖");
  };

  const handleFruitPress = (fruit: Fruit) => {
    router.push({
      pathname: "/fruit-details/[fruitName]",
      params: { fruitName: encodeURIComponent(fruit.name) },
    });
  };

  const handleRemoveFavorite = async (fruit: Fruit) => {
    await removeFavorite(fruit.id.toString());
    showMessage(`${fruit.name} eliminado de favoritos`);
  };

  const handleClearAll = async () => {
    await clearAllFavorites();
    showMessage("Todos los favoritos eliminados");
  };

  const handleSort = (newSortBy: "name" | "dateAdded" | "calories") => {
    setSortBy(newSortBy);
    setShowMenu(false);
    showMessage(
      `Ordenado por ${
        newSortBy === "name"
          ? "nombre"
          : newSortBy === "dateAdded"
          ? "fecha"
          : "calorías"
      }`
    );
  };

  const showMessage = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  const getSortedFavorites = () => {
    const sortedFavorites = [...favorites];
    switch (sortBy) {
      case "name":
        return sortedFavorites.sort((a, b) => a.name.localeCompare(b.name));
      case "calories":
        return sortedFavorites.sort(
          (a, b) => (b.nutritions.calories || 0) - (a.nutritions.calories || 0)
        );
      case "dateAdded":
      default:
        return sortedFavorites.sort(
          (a, b) =>
            new Date(b.dateAdded || 0).getTime() -
            new Date(a.dateAdded || 0).getTime()
        );
    }
  };

  const getFilteredFavorites = () => {
    const sortedFavorites = getSortedFavorites();
    if (!searchQuery.trim()) return sortedFavorites;

    return sortedFavorites.filter((fruit) =>
      fruit.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const stats = getFavoriteStats();

  const renderHeader = () => (
    <Surface
      style={[
        styles.header,
        { backgroundColor: theme.colors.tertiaryContainer },
      ]}
      elevation={3}
    >
      <IconSymbol
        size={60}
        color={theme.colors.onTertiaryContainer}
        name="heart.fill"
        style={styles.headerIcon}
      />
      <Text
        variant="headlineLarge"
        style={[styles.title, { color: theme.colors.onTertiaryContainer }]}
      >
        Mis Favoritos
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.subtitle, { color: theme.colors.onTertiaryContainer }]}
      >
        Tus frutas favoritas guardadas para acceso rápido
      </Text>

      {stats && (
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
              {stats.totalFavorites}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
              Favoritos
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.secondary, fontWeight: "bold" }}
            >
              {stats.averageCalories}
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
              {stats.mostRecent?.name || "N/A"}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
              Más reciente
            </Text>
          </View>
        </Surface>
      )}
    </Surface>
  );

  const renderSearchSection = () => (
    <Surface
      style={[styles.searchSection, { backgroundColor: theme.colors.surface }]}
      elevation={1}
    >
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar en favoritos..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[
            styles.searchbar,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
          inputStyle={{ color: theme.colors.onSurface }}
          iconColor={theme.colors.onSurfaceVariant}
          placeholderTextColor={theme.colors.onSurfaceVariant}
        />
      </View>

      <View style={styles.controlsContainer}>
        <Menu
          visible={showMenu}
          onDismiss={() => setShowMenu(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setShowMenu(true)}
              icon="sort"
              compact
              style={styles.sortButton}
            >
              Ordenar
            </Button>
          }
        >
          <Menu.Item
            onPress={() => handleSort("dateAdded")}
            title="Por fecha"
            leadingIcon="calendar"
            trailingIcon={sortBy === "dateAdded" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => handleSort("name")}
            title="Por nombre"
            leadingIcon="alphabetical"
            trailingIcon={sortBy === "name" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => handleSort("calories")}
            title="Por calorías"
            leadingIcon="fire"
            trailingIcon={sortBy === "calories" ? "check" : undefined}
          />
        </Menu>

        {favorites.length > 0 && (
          <Button
            mode="text"
            onPress={handleClearAll}
            icon="delete"
            compact
            textColor={theme.colors.error}
            style={styles.clearButton}
          >
            Limpiar todo
          </Button>
        )}
      </View>
    </Surface>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Surface
        style={[
          styles.emptyCard,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
        elevation={1}
      >
        <IconSymbol
          name="heart.slash"
          size={80}
          color={theme.colors.onSurfaceVariant}
          style={styles.emptyIcon}
        />
        <Text
          variant="headlineSmall"
          style={[styles.emptyTitle, { color: theme.colors.onSurfaceVariant }]}
        >
          {searchQuery ? "Sin resultados" : "Sin favoritos aún"}
        </Text>
        <Text
          variant="bodyMedium"
          style={[
            styles.emptyMessage,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          {searchQuery
            ? `No se encontraron favoritos para "${searchQuery}"`
            : "Explora frutas y marca tus favoritas tocando el corazón"}
        </Text>

        <View style={styles.emptyActions}>
          {searchQuery ? (
            <Button
              mode="outlined"
              onPress={() => setSearchQuery("")}
              icon="close"
            >
              Limpiar búsqueda
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={() => router.push("/(tabs)/explore")}
              icon="compass"
            >
              Explorar frutas
            </Button>
          )}
        </View>
      </Surface>
    </View>
  );

  const renderContent = () => {
    const filteredFavorites = getFilteredFavorites();

    if (filteredFavorites.length === 0) {
      return renderEmptyState();
    }

    return (
      <View style={styles.favoritesContainer}>
        <View style={styles.favoritesHeader}>
          <Text
            variant="titleMedium"
            style={[
              styles.favoritesTitle,
              { color: theme.colors.onBackground },
            ]}
          >
            💖 {searchQuery ? "Resultados" : "Tus favoritos"} (
            {filteredFavorites.length})
          </Text>
          {searchQuery && (
            <Text
              variant="bodySmall"
              style={[
                styles.searchInfo,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Buscando: "{searchQuery}"
            </Text>
          )}
        </View>

        {filteredFavorites.map((fruit, index) => (
          <View key={fruit.id} style={styles.favoriteItem}>
            <FruitCard fruit={fruit} onPress={handleFruitPress} index={index} />
            <View style={styles.favoriteActions}>
              <Chip
                icon="calendar"
                compact
                style={styles.dateChip}
                textStyle={{ fontSize: 11 }}
              >
                {fruit.dateAdded
                  ? new Date(fruit.dateAdded).toLocaleDateString()
                  : "N/A"}
              </Chip>
              <IconButton
                icon="heart-remove"
                size={20}
                iconColor={theme.colors.error}
                onPress={() => handleRemoveFavorite(fruit)}
              />
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView
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
        stickyHeaderIndices={[1]}
      >
        {renderHeader()}
        {renderSearchSection()}
        {renderContent()}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {favorites.length > 0 && (
        <FAB
          icon="heart-plus"
          style={[styles.fab, { backgroundColor: theme.colors.tertiary }]}
          onPress={() => router.push("/(tabs)/explore")}
          label="Agregar más"
        />
      )}

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
    paddingBottom: 100,
  },
  header: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 24,
    marginBottom: 8,
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
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchbar: {
    elevation: 0,
    borderRadius: 12,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sortButton: {
    borderRadius: 20,
  },
  clearButton: {
    borderRadius: 20,
  },
  favoritesContainer: {
    paddingHorizontal: 16,
  },
  favoritesHeader: {
    marginBottom: 8,
  },
  favoritesTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
  },
  searchInfo: {
    fontStyle: "italic",
  },
  favoriteItem: {
    marginBottom: 8,
  },
  favoriteActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  dateChip: {
    height: 28,
  },
  emptyContainer: {
    flex: 1,
    padding: 16,
  },
  emptyCard: {
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
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyActions: {
    flexDirection: "row",
    gap: 12,
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

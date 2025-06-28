import { AppSnackbar } from "@/components/AppSnackBar";
import { FruitCard } from "@/components/FruitCard";
import { FruitCardSkeleton } from "@/components/FruitCardSkeleton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/contexts/ThemeContext";
import { useFruitStore } from "@/stores/fruitStore";
import { Fruit } from "@/types/fruit";
import { hexToRgba } from "@/utils/hexConverter";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  FAB,
  IconButton,
  List,
  Menu,
  Searchbar,
  Surface,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const ITEMS_PER_PAGE = 3;
const INITIAL_ITEMS = 3;

export default function ExploreScreen() {
  const { theme } = useTheme();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isScreenFocused, setIsScreenFocused] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "calories" | "protein">("name");

  // Estados para paginación
  const [displayedItemsCount, setDisplayedItemsCount] = useState(INITIAL_ITEMS);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
      // Resetear la paginación cuando se cargan nuevas frutas
      setDisplayedItemsCount(INITIAL_ITEMS);
    } catch (err) {
      console.error("Error loading fruits:", err);
    }
  };

  const handleRefresh = async () => {
    await loadFruits();
    showMessage("Lista de frutas actualizada.");
  };

  const handleFruitPress = (fruit: Fruit) => {
    console.log("Fruit selected:", fruit);
    router.push({
      pathname: "/fruit-details/[fruitName]",
      params: { fruitName: encodeURIComponent(fruit.name) },
    });
  };

  const handleSearch = () => {
    showMessage(`Buscando: "${searchQuery}"`);
    // Resetear paginación al buscar
    setDisplayedItemsCount(INITIAL_ITEMS);
  };

  const handleAdvancedSearch = () => {
    router.push("/search");
    showMessage("Navegando a búsqueda avanzada.");
  };

  const showMessage = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  const handleRetry = () => {
    clearError();
    loadFruits();
  };

  const handleSort = (newSortBy: "name" | "calories" | "protein") => {
    setSortBy(newSortBy);
    setShowMenu(false);
    // Resetear paginación al cambiar ordenamiento
    setDisplayedItemsCount(INITIAL_ITEMS);
    showMessage(
      `Ordenado por ${
        newSortBy === "name"
          ? "nombre"
          : newSortBy === "calories"
          ? "calorías"
          : "proteína"
      }`
    );
  };

  // Función para ordenar frutas
  const getSortedFruits = () => {
    const sortedFruits = [...fruits];
    switch (sortBy) {
      case "name":
        return sortedFruits.sort((a, b) => a.name.localeCompare(b.name));
      case "calories":
        return sortedFruits.sort(
          (a, b) => (b.nutritions.calories || 0) - (a.nutritions.calories || 0)
        );
      case "protein":
        return sortedFruits.sort(
          (a, b) => (b.nutritions.protein || 0) - (a.nutritions.protein || 0)
        );
      default:
        return sortedFruits;
    }
  };

  // Función para filtrar frutas por búsqueda local
  const getFilteredFruits = () => {
    const sortedFruits = getSortedFruits();
    if (!searchQuery.trim()) return sortedFruits;

    return sortedFruits.filter((fruit) =>
      fruit.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Función para obtener las frutas que se deben mostrar (con paginación)
  const getDisplayedFruits = () => {
    const filteredFruits = getFilteredFruits();
    return filteredFruits.slice(0, displayedItemsCount);
  };

  // Función para cargar más elementos
  const loadMoreItems = useCallback(async () => {
    const filteredFruits = getFilteredFruits();
    const currentDisplayed = displayedItemsCount;
    const totalAvailable = filteredFruits.length;

    if (currentDisplayed >= totalAvailable || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);

    // Simular un pequeño delay para mostrar el loading
    setTimeout(() => {
      const newCount = Math.min(
        currentDisplayed + ITEMS_PER_PAGE,
        totalAvailable
      );
      setDisplayedItemsCount(newCount);
      setIsLoadingMore(false);

      const loadedItems = newCount - currentDisplayed;
    }, 500);
  }, [displayedItemsCount, isLoadingMore, searchQuery, sortBy, fruits]);

  // Detectar cuando se llega al final del scroll
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;
      const paddingToBottom = 20;

      if (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
      ) {
        loadMoreItems();
      }
    },
    [loadMoreItems]
  );

  // Resetear paginación cuando cambie la búsqueda
  React.useEffect(() => {
    setDisplayedItemsCount(INITIAL_ITEMS);
  }, [searchQuery]);

  const renderHeader = () => (
    <Surface
      style={[
        styles.header,
        { backgroundColor: theme.colors.primaryContainer },
      ]}
      elevation={theme.dark ? 2 : 3}
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
        Descubre el mundo de las frutas y sus beneficios nutricionales.
      </Text>

      {nutritionStats && (
        <Surface
          style={[
            styles.statsContainer,
            { backgroundColor: theme.colors.surface },
          ]}
          elevation={theme.dark ? 1 : 2}
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

  const renderSearchSection = () => (
    <Surface
      style={[
        styles.searchSection,
        {
          backgroundColor: hexToRgba(
            theme.colors.surfaceContainerHigh || "",
            0.55
          ),
          elevation: 0,
        },
      ]}
    >
      <BlurView
        intensity={20}
        experimentalBlurMethod="dimezisBlurView"
        tint={theme.dark ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar frutas localmente..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={[
            styles.searchbar,
            {
              backgroundColor: theme.colors.surfaceVariant,
              // Reducimos la elevación del Searchbar para un look más plano dentro del Surface blureado
              elevation: 0,
            },
          ]}
          inputStyle={{ color: theme.colors.onSurface }}
          iconColor={theme.colors.onSurfaceVariant}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          right={() => (
            <IconButton
              icon="tune-variant"
              size={24}
              onPress={handleAdvancedSearch}
              iconColor={theme.colors.primary}
            />
          )}
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
              labelStyle={{ color: theme.colors.primary }}
              textColor={theme.colors.primary}
            >
              Ordenar por
            </Button>
          }
        >
          <List.Section>
            <List.Subheader>Ordenar por:</List.Subheader>
            <List.Item
              title="Nombre"
              left={() => (
                <MaterialCommunityIcons
                  name="alphabetical-variant"
                  size={24}
                  color={theme.colors.onSurface}
                />
              )}
              right={() =>
                sortBy === "name" && (
                  <MaterialCommunityIcons
                    name="check"
                    size={24}
                    color={theme.colors.primary}
                  />
                )
              }
              onPress={() => handleSort("name")}
              style={{
                backgroundColor:
                  sortBy === "name"
                    ? theme.colors.primaryContainer
                    : "transparent",
              }}
              titleStyle={{
                color:
                  sortBy === "name"
                    ? theme.colors.onPrimaryContainer
                    : theme.colors.onSurface,
              }}
            />
            <List.Item
              title="Calorías"
              left={() => (
                <MaterialCommunityIcons
                  name="fire"
                  size={24}
                  color={theme.colors.onSurface}
                />
              )}
              right={() =>
                sortBy === "calories" && (
                  <MaterialCommunityIcons
                    name="check"
                    size={24}
                    color={theme.colors.primary}
                  />
                )
              }
              onPress={() => handleSort("calories")}
              style={{
                backgroundColor:
                  sortBy === "calories"
                    ? theme.colors.primaryContainer
                    : "transparent",
              }}
              titleStyle={{
                color:
                  sortBy === "calories"
                    ? theme.colors.onPrimaryContainer
                    : theme.colors.onSurface,
              }}
            />
            <List.Item
              title="Proteína"
              left={() => (
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={24}
                  color={theme.colors.onSurface}
                />
              )}
              right={() =>
                sortBy === "protein" && (
                  <MaterialCommunityIcons
                    name="check"
                    size={24}
                    color={theme.colors.primary}
                  />
                )
              }
              onPress={() => handleSort("protein")}
              style={{
                backgroundColor:
                  sortBy === "protein"
                    ? theme.colors.primaryContainer
                    : "transparent",
              }}
              titleStyle={{
                color:
                  sortBy === "protein"
                    ? theme.colors.onPrimaryContainer
                    : theme.colors.onSurface,
              }}
            />
          </List.Section>
        </Menu>

        <Button
          mode="text"
          onPress={handleAdvancedSearch}
          icon="magnify-plus"
          compact
          style={styles.advancedButton}
          labelStyle={{ color: theme.colors.primary }}
          textColor={theme.colors.primary}
        >
          Búsqueda avanzada
        </Button>
      </View>
    </Surface>
  );

  const renderError = () => (
    <Surface
      style={[
        styles.errorContainer,
        { backgroundColor: theme.colors.errorContainer },
      ]}
      elevation={theme.dark ? 1 : 2}
    >
      <MaterialCommunityIcons
        name="alert-circle-outline"
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
      elevation={theme.dark ? 0 : 1}
    >
      <MaterialCommunityIcons
        name="fruit-watermelon"
        size={64}
        color={theme.colors.onSurfaceVariant}
        style={styles.emptyIcon}
      />
      <Text
        variant="titleLarge"
        style={[styles.emptyTitle, { color: theme.colors.onSurfaceVariant }]}
      >
        {searchQuery ? "No se encontraron frutas" : "No hay frutas disponibles"}
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.emptyMessage, { color: theme.colors.onSurfaceVariant }]}
      >
        {searchQuery
          ? `No hay resultados para "${searchQuery}". Intenta con otro término.`
          : "Intenta recargar la lista para ver las frutas disponibles."}
      </Text>
      {searchQuery ? (
        <Button
          mode="outlined"
          onPress={() => setSearchQuery("")}
          style={styles.refreshButton}
          textColor={theme.colors.primary}
        >
          Limpiar búsqueda
        </Button>
      ) : (
        <Button
          mode="outlined"
          onPress={handleRefresh}
          style={styles.refreshButton}
          textColor={theme.colors.primary}
        >
          Recargar lista
        </Button>
      )}
    </Surface>
  );

  const renderSkeletons = () => (
    <View style={styles.skeletonContainer}>
      {/* Asegúrate de que FruitCardSkeleton acepte y use el prop 'index' si es necesario para animaciones o diferencias */}
      {Array.from({ length: 6 }, (_, index) => (
        <FruitCardSkeleton key={`skeleton-${index}`} index={index} />
      ))}
    </View>
  );

  const renderLoadMoreIndicator = () => {
    const filteredFruits = getFilteredFruits();
    const hasMoreItems = displayedItemsCount < filteredFruits.length;

    if (!hasMoreItems) return null;

    return (
      <View style={styles.loadMoreContainer}>
        {isLoadingMore ? (
          <View style={styles.loadingMoreIndicator}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text
              variant="bodyMedium"
              style={[
                styles.loadingMoreText,
                { color: theme.colors.onSurface },
              ]}
            >
              Cargando más frutas...
            </Text>
          </View>
        ) : (
          <Button
            mode="outlined"
            onPress={loadMoreItems}
            icon="chevron-down"
            style={styles.loadMoreButton}
            textColor={theme.colors.primary}
          >
            Cargar más ({filteredFruits.length - displayedItemsCount} restantes)
          </Button>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (error) {
      return renderError();
    }

    if (isLoading && fruits.length === 0) {
      return renderSkeletons();
    }

    const filteredFruits = getFilteredFruits();
    const displayedFruits = getDisplayedFruits();

    if (filteredFruits.length === 0 && !isLoading) {
      return renderEmptyState();
    }

    return (
      <View style={styles.fruitsContainer}>
        <View style={styles.fruitsHeader}>
          <Text
            variant="titleMedium"
            style={[styles.fruitsTitle, { color: theme.colors.onBackground }]}
          >
            <MaterialCommunityIcons name="food-apple" size={20} />
            {searchQuery ? "Resultados" : "Todas las frutas"} (
            {filteredFruits.length})
          </Text>
          {searchQuery.trim() !== "" && (
            <Text
              variant="bodySmall"
              style={[
                styles.searchInfo,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Mostrando resultados para: "{searchQuery}"
            </Text>
          )}
          {displayedFruits.length < filteredFruits.length && (
            <Text
              variant="bodySmall"
              style={[
                styles.paginationInfo,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Mostrando {displayedFruits.length} de {filteredFruits.length}{" "}
              frutas
            </Text>
          )}
        </View>

        {displayedFruits.map((fruit, index) => (
          <FruitCard
            key={fruit.id}
            fruit={fruit}
            onPress={handleFruitPress}
            index={index}
          />
        ))}

        {renderLoadMoreIndicator()}
      </View>
    );
  };

  // Pantalla de carga inicial antes de que la vista esté enfocada y cargue datos
  if (!isScreenFocused) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            variant="titleMedium"
            style={{ marginTop: 16, color: theme.colors.onBackground }}
          >
            Cargando frutas...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
            progressBackgroundColor={theme.colors.surfaceVariant}
          />
        }
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[1]}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        {renderHeader()}
        <View>{renderSearchSection()}</View>
        {renderContent()}

        {/* El espaciado inferior ahora se manejará con el padding del scrollContent */}
      </ScrollView>

      <FAB
        icon="filter-variant"
        label="Filtrar"
        style={[
          styles.fab,
          {
            backgroundColor: theme.colors.primary,
            // Ajuste de posición para que el FAB no quede tan pegado y pueda flotar mejor
            bottom: 30,
            right: 20,
          },
        ]}
        onPress={handleAdvancedSearch}
        color={theme.colors.onPrimary}
      />

      <AppSnackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        message={snackbarMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // Aumenta el paddingBottom para dar más espacio al final del scroll,
    // considerando el FAB para que no lo cubra si el contenido es corto.
    // Un valor mayor que el bottom del FAB + su altura es ideal.
    paddingBottom: 120,
  },
  header: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
  },
  headerIcon: {
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    width: "100%",
    justifyContent: "space-around",
    gap: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },

  searchSection: {
    padding: 20,
    borderRadius: 26,
    marginHorizontal: 16,
    marginVertical: 20,
    overflow: "hidden", // ¡Importante para que el blur funcione correctamente dentro de los bordes!
    position: "relative", // Necesario para que `StyleSheet.absoluteFill` funcione en `BlurView`
    minHeight: 150, // Opcional: Dale una altura mínima si el contenido es variable
    justifyContent: "center", // Centra el contenido verticalmente
  },
  searchContainer: {
    marginBottom: 20,
    zIndex: 1, // Asegura que el contenido esté por encima del blur
  },
  searchbar: {
    elevation: 0, // Quitamos la elevación del Searchbar para un look más plano
    borderRadius: 16,
    height: 56,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    zIndex: 1, // Asegura que el contenido esté por encima del blur
  },
  sortButton: {
    borderRadius: 28,
    minWidth: 120,
    height: 48,
    justifyContent: "center",
  },
  advancedButton: {
    borderRadius: 28,
    height: 48,
    justifyContent: "center",
  },

  // Fruits section styles
  fruitsContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  fruitsHeader: {
    marginBottom: 16,
  },
  fruitsTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInfo: {
    fontStyle: "italic",
    marginTop: 4,
  },
  paginationInfo: {
    fontStyle: "italic",
    marginTop: 4,
    fontSize: 12,
  },
  skeletonContainer: {
    paddingHorizontal: 16,
  },

  // Load more styles
  loadMoreContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  loadMoreButton: {
    borderRadius: 24,
    paddingHorizontal: 20,
  },
  loadingMoreIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  loadingMoreText: {
    fontSize: 14,
  },

  // Error styles
  errorContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
  },
  errorIcon: {
    marginBottom: 20,
  },
  errorTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  errorMessage: {
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  retryButton: {
    borderRadius: 28,
    height: 52,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  // Empty state styles
  emptyContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 32,
    borderRadius: 20,
    alignItems: "center",
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyMessage: {
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  refreshButton: {
    borderRadius: 28,
    height: 52,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  fab: {
    position: "absolute",
    borderRadius: 16,
  },
});

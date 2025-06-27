import { FruitCard } from "@/components/FruitCard";
import { FruitCardSkeleton } from "@/components/FruitCardSkeleton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/contexts/ThemeContext";
import { useFruitStore } from "@/stores/fruitStore";
import { Fruit } from "@/types/fruit";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  FAB,
  IconButton,
  List,
  Menu,
  Searchbar,
  Snackbar,
  Surface,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExploreScreen() {
  const { theme } = useTheme();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isScreenFocused, setIsScreenFocused] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "calories" | "protein">("name");

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
    showMessage("Lista de frutas actualizada."); // Mensaje más genérico
  };

  const handleFruitPress = (fruit: Fruit) => {
    // showMessage(`Navegando a: ${fruit.name}`); // Podríamos eliminar este snackbar para no saturar
    console.log("Fruit selected:", fruit);

    router.push({
      pathname: "/fruit-details/[fruitName]",
      params: { fruitName: encodeURIComponent(fruit.name) },
    });
  };

  const handleSearch = () => {
    // Si la búsqueda local es el enfoque principal de este Searchbar,
    // el onSubmitEditing simplemente filtra la lista mostrada.
    // Si se presiona el icono de tune, se va a la búsqueda avanzada.
    showMessage(`Buscando: "${searchQuery}"`);
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

  const renderHeader = () => (
    <Surface
      style={[
        styles.header,
        { backgroundColor: theme.colors.primaryContainer },
      ]}
      elevation={theme.dark ? 2 : 3}
    >
      {/* Asumo que IconSymbol renderiza MaterialCommunityIcons o similar */}
      <IconSymbol
        size={60}
        color={theme.colors.onPrimaryContainer}
        name="apple.logo" // Ajusta el nombre del icono si IconSymbol usa un conjunto diferente (ej: "apple")
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
      style={[styles.searchSection, { backgroundColor: theme.colors.surface }]}
      elevation={theme.dark ? 0 : 1} // Menor elevación para la barra de búsqueda
    >
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar frutas localmente..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={[
            styles.searchbar,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
          inputStyle={{ color: theme.colors.onSurface }}
          iconColor={theme.colors.onSurfaceVariant}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          right={() => (
            <IconButton
              icon="tune-variant" // Icono más moderno para filtros
              size={24} // Aumentar tamaño
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
              labelStyle={{ color: theme.colors.primary }} // Color del texto del botón
              textColor={theme.colors.primary} // Color del icono
            >
              Ordenar por
            </Button>
          }
        >
          {/* Usar List.Item para mayor coherencia con Material Design */}
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
        name="alert-circle-outline" // Icono de error más amigable
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
      {Array.from({ length: 6 }, (_, index) => (
        <FruitCardSkeleton key={`skeleton-${index}`} index={index} />
      ))}
    </View>
  );

  const renderContent = () => {
    if (error) {
      return renderError();
    }

    if (isLoading && fruits.length === 0) {
      // Mostrar skeletons solo si no hay frutas cargadas aún
      return renderSkeletons();
    }

    const filteredFruits = getFilteredFruits();

    if (filteredFruits.length === 0 && !isLoading) {
      // Mostrar estado vacío solo si no hay frutas y no está cargando
      return renderEmptyState();
    }

    return (
      <View style={styles.fruitsContainer}>
        <View style={styles.fruitsHeader}>
          <Text
            variant="titleMedium"
            style={[styles.fruitsTitle, { color: theme.colors.onBackground }]}
          >
            <MaterialCommunityIcons name="food-apple" size={20} />{" "}
            {searchQuery ? "Resultados" : "Todas las frutas"} (
            {filteredFruits.length})
          </Text>
          {searchQuery.trim() !== "" && ( // Mostrar info de búsqueda solo si hay query
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
        </View>
        {filteredFruits.map((fruit, index) => (
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
            progressBackgroundColor={theme.colors.surfaceVariant} // Fondo para el indicador de refresh
          />
        }
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[1]} // Hacer sticky la sección de búsqueda
      >
        {renderHeader()}
        {renderSearchSection()}
        {renderContent()}

        {/* Espaciado inferior para evitar que el contenido sea cubierto por el FAB */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* FAB para Búsqueda Avanzada/Filtros */}
      <FAB
        icon="filter-variant" // Nuevo icono más relevante para la acción principal
        label="Filtrar" // Etiqueta para una mejor comprensión
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAdvancedSearch} // Acción principal del FAB
        color={theme.colors.onPrimary} // Color del icono y texto del FAB
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
          textColor: theme.colors.inversePrimary, // Color para el texto de la acción del Snackbar
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Espacio para que el FAB no cubra el contenido
  },
  header: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 24,
    marginBottom: 16, // Aumentado el margen inferior
    alignItems: "center",
  },
  headerIcon: {
    marginBottom: 16, // Aumentado el margen inferior
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24, // Aumentado el margen inferior
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
    gap: 16, // Espacio entre los ítems de las estadísticas
  },
  statItem: {
    alignItems: "center",
    flex: 1, // Para que cada ítem ocupe el mismo espacio
  },

  // Search section styles
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16, // Aumentado el margen inferior
  },
  searchContainer: {
    marginBottom: 16, // Aumentado el margen inferior
  },
  searchbar: {
    elevation: 0,
    borderRadius: 16, // Más redondeado
    height: 56, // Altura estándar para input de Material Design
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap", // Para que los botones se ajusten en pantallas pequeñas
  },
  sortButton: {
    borderRadius: 28, // Más redondeado
    minWidth: 120, // Ancho mínimo para el botón
    height: 48, // Altura estándar para botones de Material Design
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
    paddingTop: 8, // Pequeño padding superior para separación
  },
  fruitsHeader: {
    marginBottom: 16, // Más espacio debajo del encabezado de frutas
  },
  fruitsTitle: {
    fontWeight: "bold",
    fontSize: 20, // Un poco más grande
    marginBottom: 4,
    flexDirection: "row", // Para alinear icono y texto
    alignItems: "center",
    gap: 8, // Espacio entre icono y texto
  },
  searchInfo: {
    fontStyle: "italic",
    marginTop: 4,
  },
  skeletonContainer: {
    paddingHorizontal: 16,
  },

  // Error styles
  errorContainer: {
    marginHorizontal: 16,
    marginTop: 16, // Margen superior
    padding: 24,
    borderRadius: 20, // Más redondeado
    alignItems: "center",
  },
  errorIcon: {
    marginBottom: 20, // Más margen
  },
  errorTitle: {
    fontWeight: "bold",
    marginBottom: 12, // Más margen
    textAlign: "center",
  },
  errorMessage: {
    textAlign: "center",
    marginBottom: 20, // Más margen
    lineHeight: 22,
  },
  retryButton: {
    borderRadius: 28, // Más redondeado
    height: 52, // Altura consistente
    justifyContent: "center",
    paddingHorizontal: 20, // Más padding horizontal
  },

  // Empty state styles
  emptyContainer: {
    marginHorizontal: 16,
    marginTop: 16, // Margen superior
    padding: 32,
    borderRadius: 20, // Más redondeado
    alignItems: "center",
  },
  emptyIcon: {
    marginBottom: 20, // Más margen
  },
  emptyTitle: {
    fontWeight: "bold",
    marginBottom: 12, // Más margen
    textAlign: "center",
  },
  emptyMessage: {
    textAlign: "center",
    marginBottom: 20, // Más margen
    lineHeight: 22,
  },
  refreshButton: {
    borderRadius: 28, // Más redondeado
    height: 52, // Altura consistente
    justifyContent: "center",
    paddingHorizontal: 20, // Más padding horizontal
  },

  // FAB and spacing
  bottomSpacing: {
    height: 90, // Un poco más de espacio para el FAB con etiqueta
  },
  fab: {
    position: "absolute",
    margin: 20, // Margen consistente con Material 3
    right: 0,
    bottom: 0,
    borderRadius: 16, // FAB puede tener bordes menos redondeados en Material 3 Expressive
    // Opcional: si quieres un FAB extendido con texto
    // width: 140,
    // justifyContent: 'flex-start',
    // paddingHorizontal: 20,
  },
});

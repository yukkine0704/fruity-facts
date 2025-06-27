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
    // Mensaje de Snackbar ahora más descriptivo y con ícono
    showMessage("Favoritos actualizados ✔️");
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
      // Usar primaryContainer para un encabezado más vibrante y Material 3
      style={[
        styles.header,
        {
          backgroundColor: theme.colors.primaryContainer,
          borderBottomLeftRadius: 36, // Bordes más curvados
          borderBottomRightRadius: 36, // Bordes más curvados
        },
      ]}
      elevation={4} // Mayor elevación para distinguirlo
    >
      {/* IconSymbol ya está bien para Material 3 */}
      <IconSymbol
        size={72} // Un poco más grande para impactar
        color={theme.colors.onPrimaryContainer} // Color acorde al contenedor
        name="heart.fill"
        style={styles.headerIcon}
      />
      <Text
        variant="headlineLarge" // Título principal más grande
        style={[styles.title, { color: theme.colors.onPrimaryContainer }]}
      >
        Mis Favoritos
      </Text>
      <Text
        variant="bodyLarge" // Subtítulo más legible
        style={[
          styles.subtitle,
          { color: theme.colors.onPrimaryContainer, opacity: 0.8 },
        ]}
      >
        Aquí encontrarás todas las frutas que has marcado como favoritas.
      </Text>

      {stats && (
        <Surface
          style={[
            styles.statsContainer,
            {
              backgroundColor: theme.colors.surfaceContainerHigh, // Contenedor de estadísticas más elevado
              borderRadius: 24, // Bordes más suaves
              paddingVertical: 18, // Más padding vertical
            },
          ]}
          elevation={2}
        >
          <View style={styles.statItem}>
            <Text
              variant="titleLarge" // Números de estadísticas más grandes y audaces
              style={{ color: theme.colors.primary, fontWeight: "bold" }}
            >
              {stats.totalFavorites}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurface }}
            >
              Total
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.secondary, fontWeight: "bold" }}
            >
              {stats.averageCalories}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurface }}
            >
              Cal. promedio
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.tertiary, fontWeight: "bold" }}
            >
              {stats.mostRecent?.name || "N/A"}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurface }}
            >
              Más reciente
            </Text>
          </View>
        </Surface>
      )}
    </Surface>
  );

  const renderSearchSection = () => (
    <Surface
      // Usar surfaceContainerHighest para la sección de búsqueda que es "flotante"
      style={[
        styles.searchSection,
        {
          backgroundColor: theme.colors.surfaceContainerHighest, // Color más prominente para la barra de búsqueda
          borderRadius: 28, // Bordes más suaves y modernos
          marginHorizontal: 16, // Márgenes laterales para que "flote"
          marginTop: -32, // Para superponerla ligeramente sobre el header
          paddingVertical: 12, // Más padding
          paddingHorizontal: 16, // Más padding
          zIndex: 1, // Asegurar que esté por encima de otros elementos
        },
      ]}
      elevation={3} // Una buena elevación para el elemento flotante
    >
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar en favoritos..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          mode="view" // Usar el nuevo modo 'view' para Material 3
          style={[
            styles.searchbar,
            {
              backgroundColor: theme.colors.surfaceContainerHigh, // Color de fondo más claro
              borderRadius: 16, // Bordes más suaves para la searchbar
            },
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
              mode="outlined" // outlined es bueno para acciones secundarias
              onPress={() => setShowMenu(true)}
              icon="sort"
              style={styles.sortButton}
              textColor={theme.colors.primary} // Color del texto del botón
              compact // Hacer el botón más compacto
            >
              Ordenar
            </Button>
          }
          // Estilo del menú para Material 3
          contentStyle={{
            backgroundColor: theme.colors.surfaceContainerHigh,
            borderRadius: 16,
          }}
        >
          <Menu.Item
            onPress={() => handleSort("dateAdded")}
            title="Por fecha"
            leadingIcon="calendar-outline" // Ícono de Material Design
            trailingIcon={sortBy === "dateAdded" ? "check" : undefined}
            titleStyle={{ color: theme.colors.onSurface }}
          />
          <Menu.Item
            onPress={() => handleSort("name")}
            title="Por nombre"
            leadingIcon="alphabetical-variant" // Ícono de Material Design
            trailingIcon={sortBy === "name" ? "check" : undefined}
            titleStyle={{ color: theme.colors.onSurface }}
          />
          <Menu.Item
            onPress={() => handleSort("calories")}
            title="Por calorías"
            leadingIcon="fire" // Ícono de Material Design
            trailingIcon={sortBy === "calories" ? "check" : undefined}
            titleStyle={{ color: theme.colors.onSurface }}
          />
        </Menu>

        {favorites.length > 0 && (
          <Button
            mode="text"
            onPress={handleClearAll}
            icon="delete-empty-outline" // Ícono de Material Design
            textColor={theme.colors.error}
            style={styles.clearButton}
            compact // Hacer el botón más compacto
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
          {
            backgroundColor: theme.colors.surfaceContainerHigh, // Usa surfaceContainerHigh
            borderRadius: 28, // Más redondeado
          },
        ]}
        elevation={2} // Elevación para el estado vacío
      >
        <IconSymbol
          name="heart.slash" // Ícono ya está bien
          size={96} // Un poco más grande
          color={theme.colors.onSurfaceVariant}
          style={styles.emptyIcon}
        />
        <Text
          variant="headlineMedium" // Título más impactante
          style={[styles.emptyTitle, { color: theme.colors.onSurfaceVariant }]}
        >
          {searchQuery ? "Sin resultados" : "Aún no hay favoritos"}
        </Text>
        <Text
          variant="bodyLarge" // Mensaje más legible
          style={[
            styles.emptyMessage,
            { color: theme.colors.onSurfaceVariant, opacity: 0.7 },
          ]}
        >
          {searchQuery
            ? `No se encontraron frutas favoritas que coincidan con "${searchQuery}".`
            : "Explora frutas y márcalas como favoritas para guardarlas aquí."}
        </Text>

        <View style={styles.emptyActions}>
          {searchQuery ? (
            <Button
              mode="contained-tonal" // Botón tonal para Material 3
              onPress={() => setSearchQuery("")}
              icon="close-circle-outline" // Ícono de Material Design
              style={{ borderRadius: 20 }}
            >
              Limpiar búsqueda
            </Button>
          ) : (
            <Button
              mode="contained" // Contained para la acción principal
              onPress={() => router.push("/(tabs)/explore")}
              icon="compass-outline" // Ícono de Material Design
              style={{ borderRadius: 20 }}
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
            variant="titleLarge" // Título de sección más grande
            style={[
              styles.favoritesTitle,
              { color: theme.colors.onBackground, marginBottom: 8 },
            ]}
          >
            <IconButton
              icon="heart-multiple-outline"
              size={24}
              iconColor={theme.colors.primary}
              style={{ margin: 0 }}
            />
            {searchQuery ? "Resultados" : "Tus Favoritos"} (
            {filteredFavorites.length})
          </Text>
          {searchQuery && (
            <Chip
              icon="magnify" // Ícono de Material Design
              compact
              style={[
                styles.searchInfoChip,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
              textStyle={{ color: theme.colors.onSurfaceVariant }}
            >
              Buscando: "{searchQuery}"
            </Chip>
          )}
        </View>

        {filteredFavorites.map((fruit, index) => (
          <Surface
            key={fruit.id}
            style={[
              styles.favoriteItem,
              {
                backgroundColor: theme.colors.surfaceContainerLow, // Fondo para cada ítem
                borderRadius: 20, // Bordes más suaves
                padding: 12, // Más padding interno
              },
            ]}
            elevation={1} // Pequeña elevación
          >
            <FruitCard fruit={fruit} onPress={handleFruitPress} index={index} />
            <View style={styles.favoriteActions}>
              <Chip
                icon="calendar-month-outline" // Ícono de Material Design
                compact
                style={[
                  styles.dateChip,
                  { backgroundColor: theme.colors.surfaceVariant },
                ]}
                textStyle={{
                  fontSize: 12,
                  color: theme.colors.onSurfaceVariant,
                }} // Tamaño de fuente y color ajustados
              >
                {fruit.dateAdded
                  ? new Date(fruit.dateAdded).toLocaleDateString()
                  : "N/A"}
              </Chip>
              <IconButton
                icon="heart-off-outline" // Ícono de Material Design para eliminar favorito
                size={24} // Un poco más grande
                iconColor={theme.colors.error}
                onPress={() => handleRemoveFavorite(fruit)}
                containerColor={theme.colors.errorContainer} // Nuevo color de contenedor para IconButton
                style={{ borderRadius: 24 }} // Botón circular
              />
            </View>
          </Surface>
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
      >
        {renderHeader()}
        {renderSearchSection()}
        {renderContent()}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {favorites.length > 0 && (
        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.tertiary }]}
          onPress={() => router.push("/(tabs)/explore")}
          label="Agregar más"
          variant="secondary"
        />
      )}

      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
        // Estilos de Snackbar para Material 3
        style={{
          backgroundColor: theme.colors.inverseSurface,
          borderRadius: 8,
          marginBottom: 16,
        }}
        action={{
          label: "Cerrar", // Texto de acción más claro
          onPress: () => setShowSnackbar(false),
          textColor: theme.colors.inversePrimary,
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
    padding: 24,
    // marginBottom: 8, // Se elimina, el searchSection se superpone
    alignItems: "center",
    // Bordes y elevación en línea
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
    // borderRadius, padding, etc. en línea
    marginTop: 8,
    width: "90%", // Ajustar el ancho para que "flote" mejor
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1, // Para distribuir uniformemente
  },
  searchSection: {
    // paddingHorizontal, paddingVertical, etc. en línea
    marginBottom: 16, // Espacio después de la sección de búsqueda
    // border radius, margin, elevation, zIndex en línea
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchbar: {
    elevation: 0, // La elevación del Surface padre es suficiente
    // borderRadius en línea
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8, // Pequeño padding interno
  },
  sortButton: {
    borderRadius: 20,
    height: 40, // Altura fija para botones compactos
  },
  clearButton: {
    borderRadius: 20,
    height: 40,
  },
  favoritesContainer: {
    paddingHorizontal: 16,
    paddingTop: 16, // Espacio superior para el contenido principal
  },
  favoritesHeader: {
    marginBottom: 16, // Más espacio después del encabezado de la lista
    flexDirection: "row", // Para el ícono y el texto
    alignItems: "center",
  },
  favoritesTitle: {
    fontWeight: "bold",
    // fontSize en línea
    // marginBottom en línea
  },
  searchInfo: {
    // Este estilo ya no se usa con el Chip
    fontStyle: "italic",
  },
  searchInfoChip: {
    // Nuevo estilo para el Chip de búsqueda
    marginTop: 8,
    alignSelf: "flex-start", // Para que el chip no ocupe todo el ancho
  },
  favoriteItem: {
    marginBottom: 12, // Más espacio entre cada tarjeta de fruta
    // padding y borderRadius en línea
  },
  favoriteActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4, // Padding más ajustado
    paddingTop: 8,
  },
  dateChip: {
    height: 32, // Altura ligeramente mayor para el chip
    // font size y background color en línea
    // textStyle en línea
  },
  emptyContainer: {
    flex: 1,
    padding: 24, // Más padding
    justifyContent: "center", // Centrar verticalmente el contenido
    alignItems: "center",
    minHeight: 400, // Asegurar que tenga un tamaño mínimo
  },
  emptyCard: {
    padding: 32,
    alignItems: "center",
    width: "100%", // Ancho completo dentro del padding del contenedor
    maxWidth: 400, // Limitar ancho para pantallas grandes
  },
  emptyIcon: {
    marginBottom: 20, // Más espacio
  },
  emptyTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyMessage: {
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22, // Mayor altura de línea para mejor legibilidad
  },
  emptyActions: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap", // Asegurar que los botones se envuelvan si no caben
    justifyContent: "center",
  },
  bottomSpacing: {
    height: 80, // Más espacio al final para el FAB
  },
  fab: {
    position: "absolute",
    margin: 24, // Mayor margen para el FAB
    right: 0,
    bottom: 0,
    borderRadius: 28, // Mayor radio para Material 3 FAB
    height: 56, // Altura estándar de FAB extendido
    // color y variant en línea
  },
});

import { FruitListSkeleton } from "@/components/FruitListSkeleton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/contexts/ThemeContext";
import { useFoodSearch } from "@/hooks/useFDCStore";
import { SearchResultFood } from "@/types/fdc";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Appbar,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  FAB,
  RadioButton,
  Searchbar,
  SegmentedButtons,
  Snackbar,
  Surface,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type DataType = "Foundation" | "Branded" | "Survey";
type SortBy = "lowercaseDescription.keyword" | "publishedDate" | "fdcId";
type SortOrder = "asc" | "desc";

export default function AdvancedSearchScreen() {
  const { theme } = useTheme();
  const { query: initialQuery } = useLocalSearchParams<{ query?: string }>();

  // Estados de búsqueda
  const [searchQuery, setSearchQuery] = useState(initialQuery || "");
  const [dataTypes, setDataTypes] = useState<DataType[]>([
    "Foundation",
    "Branded",
  ]);
  const [sortBy, setSortBy] = useState<SortBy>("lowercaseDescription.keyword");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  // Estados de UI
  const [showFilters, setShowFilters] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { search, searchResults, isLoading, error, clearSearchResults } =
    useFoodSearch();

  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
  }, [initialQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showMessage("Ingresa un término de búsqueda");
      return;
    }

    try {
      await search(searchQuery, {
        dataType: dataTypes,
        pageSize,
        pageNumber: currentPage,
        sortBy,
        sortOrder,
      });

      const resultsCount = searchResults?.[0]?.totalHits || 0;
      showMessage(`${resultsCount} resultados encontrados`);
    } catch (err) {
      showMessage("Error en la búsqueda");
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    clearSearchResults();
    setCurrentPage(1);
  };

  const handleDataTypeToggle = (type: DataType) => {
    setDataTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleFoodPress = (food: SearchResultFood) => {
    router.push(`/fruit-details/${encodeURIComponent(food.description)}`);
  };

  const showMessage = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  const renderSearchHeader = () => (
    <Surface
      style={[
        styles.searchHeader,
        { backgroundColor: theme.colors.primaryContainer },
      ]}
      elevation={2}
    >
      <IconSymbol
        name="magnifyingglass.circle.fill"
        size={48}
        color={theme.colors.onPrimaryContainer}
        style={styles.searchIcon}
      />
      <Text
        variant="headlineMedium"
        style={[styles.searchTitle, { color: theme.colors.onPrimaryContainer }]}
      >
        Búsqueda Avanzada
      </Text>
      <Text
        variant="bodyMedium"
        style={[
          styles.searchSubtitle,
          { color: theme.colors.onPrimaryContainer },
        ]}
      >
        Encuentra información nutricional específica en la base de datos USDA
      </Text>
    </Surface>
  );

  const renderSearchBar = () => (
    <View style={styles.searchBarContainer}>
      <Searchbar
        placeholder="Buscar alimentos, frutas, marcas..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={handleSearch}
        style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
        inputStyle={{ color: theme.colors.onSurface }}
        iconColor={theme.colors.onSurfaceVariant}
        placeholderTextColor={theme.colors.onSurfaceVariant}
        right={() =>
          searchQuery ? (
            <Searchbar.Icon
              icon="close"
              onPress={handleClearSearch}
              color={theme.colors.onSurfaceVariant}
            />
          ) : undefined
        }
      />

      <View style={styles.searchActions}>
        <Button
          mode="contained"
          onPress={handleSearch}
          loading={isLoading}
          disabled={!searchQuery.trim() || isLoading}
          icon="magnify"
          style={styles.searchButton}
        >
          Buscar
        </Button>

        <Button
          mode="outlined"
          onPress={() => setShowFilters(!showFilters)}
          icon={showFilters ? "filter-off" : "filter"}
          style={styles.filterButton}
        >
          Filtros
        </Button>
      </View>
    </View>
  );

  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <Card
        style={[styles.filtersCard, { backgroundColor: theme.colors.surface }]}
      >
        <Card.Content>
          <Text
            variant="titleMedium"
            style={[styles.filterTitle, { color: theme.colors.onSurface }]}
          >
            🔧 Filtros de búsqueda
          </Text>

          {/* Tipos de datos */}
          <View style={styles.filterSection}>
            <Text
              variant="titleSmall"
              style={[
                styles.filterSectionTitle,
                { color: theme.colors.onSurface },
              ]}
            >
              Tipos de datos
            </Text>

            {(["Foundation", "Branded", "Survey"] as DataType[]).map((type) => (
              <View key={type} style={styles.checkboxRow}>
                <Checkbox
                  status={dataTypes.includes(type) ? "checked" : "unchecked"}
                  onPress={() => handleDataTypeToggle(type)}
                  color={theme.colors.primary}
                />
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurface, marginLeft: 8 }}
                >
                  {type === "Foundation"
                    ? "Datos básicos"
                    : type === "Branded"
                    ? "Productos comerciales"
                    : "Encuestas"}
                </Text>
              </View>
            ))}
          </View>

          <Divider style={{ marginVertical: 16 }} />

          {/* Ordenamiento */}
          <View style={styles.filterSection}>
            <Text
              variant="titleSmall"
              style={[
                styles.filterSectionTitle,
                { color: theme.colors.onSurface },
              ]}
            >
              Ordenar por
            </Text>

            <RadioButton.Group
              onValueChange={(value) => setSortBy(value as SortBy)}
              value={sortBy}
            >
              <View style={styles.radioRow}>
                <RadioButton
                  value="lowercaseDescription.keyword"
                  color={theme.colors.primary}
                />
                <Text style={{ color: theme.colors.onSurface, marginLeft: 8 }}>
                  Descripción
                </Text>
              </View>
              <View style={styles.radioRow}>
                <RadioButton
                  value="publishedDate"
                  color={theme.colors.primary}
                />
                <Text style={{ color: theme.colors.onSurface, marginLeft: 8 }}>
                  Fecha de publicación
                </Text>
              </View>
              <View style={styles.radioRow}>
                <RadioButton value="fdcId" color={theme.colors.primary} />
                <Text style={{ color: theme.colors.onSurface, marginLeft: 8 }}>
                  ID del alimento
                </Text>
              </View>
            </RadioButton.Group>
          </View>

          <Divider style={{ marginVertical: 16 }} />

          {/* Orden */}
          <View style={styles.filterSection}>
            <Text
              variant="titleSmall"
              style={[
                styles.filterSectionTitle,
                { color: theme.colors.onSurface },
              ]}
            >
              Orden
            </Text>

            <SegmentedButtons
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value as SortOrder)}
              buttons={[
                { value: "asc", label: "Ascendente", icon: "arrow-up" },
                { value: "desc", label: "Descendente", icon: "arrow-down" },
              ]}
              style={styles.segmentedButtons}
            />
          </View>

          <Divider style={{ marginVertical: 16 }} />

          {/* Resultados por página */}
          <View style={styles.filterSection}>
            <Text
              variant="titleSmall"
              style={[
                styles.filterSectionTitle,
                { color: theme.colors.onSurface },
              ]}
            >
              Resultados por página
            </Text>

            <SegmentedButtons
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(parseInt(value))}
              buttons={[
                { value: "10", label: "10" },
                { value: "25", label: "25" },
                { value: "50", label: "50" },
              ]}
              style={styles.segmentedButtons}
            />
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderResults = () => {
    if (isLoading) {
      return <FruitListSkeleton count={pageSize} />;
    }

    if (error) {
      return (
        <Card
          style={[
            styles.errorCard,
            { backgroundColor: theme.colors.errorContainer },
          ]}
        >
          <Card.Content style={styles.errorContent}>
            <IconSymbol
              name="exclamationmark.triangle.fill"
              size={48}
              color={theme.colors.onErrorContainer}
            />
            <Text
              variant="titleMedium"
              style={[
                styles.errorTitle,
                { color: theme.colors.onErrorContainer },
              ]}
            >
              Error en la búsqueda
            </Text>
            <Text
              variant="bodyMedium"
              style={[
                styles.errorMessage,
                { color: theme.colors.onErrorContainer },
              ]}
            >
              {error}
            </Text>
            <Button
              mode="contained"
              onPress={handleSearch}
              style={[
                styles.retryButton,
                { backgroundColor: theme.colors.error },
              ]}
              labelStyle={{ color: theme.colors.onError }}
            >
              Reintentar
            </Button>
          </Card.Content>
        </Card>
      );
    }

    if (!searchResults || searchResults.length === 0) {
      return (
        <Card
          style={[
            styles.emptyCard,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          <Card.Content style={styles.emptyContent}>
            <IconSymbol
              name="magnifyingglass"
              size={64}
              color={theme.colors.onSurfaceVariant}
            />
            <Text
              variant="titleLarge"
              style={[
                styles.emptyTitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {searchQuery ? "Sin resultados" : "Inicia una búsqueda"}
            </Text>
            <Text
              variant="bodyMedium"
              style={[
                styles.emptyMessage,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {searchQuery
                ? `No se encontraron resultados para "${searchQuery}"`
                : "Usa la barra de búsqueda para encontrar información nutricional"}
            </Text>
          </Card.Content>
        </Card>
      );
    }

    const results = searchResults[0];
    const foods = results.foods || [];

    return (
      <View style={styles.resultsContainer}>
        <Surface
          style={[
            styles.resultsHeader,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
          elevation={1}
        >
          <View style={styles.resultsInfo}>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onPrimaryContainer }}
            >
              📊 Resultados de búsqueda
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onPrimaryContainer }}
            >
              {results.totalHits} resultados encontrados para "{searchQuery}"
            </Text>
          </View>

          <View style={styles.resultsChips}>
            <Chip
              icon="database"
              compact
              style={{ backgroundColor: theme.colors.surface }}
            >
              Página {currentPage}
            </Chip>
            <Chip
              icon="format-list-numbered"
              compact
              style={{ backgroundColor: theme.colors.surface }}
            >
              {foods.length} elementos
            </Chip>
          </View>
        </Surface>

        <View style={styles.foodsList}>
          {foods.map((food, index) => (
            <Card
              key={food.fdcId}
              style={[
                styles.foodCard,
                { backgroundColor: theme.colors.surface },
              ]}
              onPress={() => handleFoodPress(food)}
            >
              <Card.Content>
                <Text
                  variant="titleSmall"
                  style={{ color: theme.colors.onSurface }}
                  numberOfLines={2}
                >
                  {food.description}
                </Text>

                {food.brandOwner && (
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.outline, marginTop: 4 }}
                  >
                    Marca: {food.brandOwner}
                  </Text>
                )}

                <View style={styles.foodChips}>
                  <Chip compact mode="outlined" textStyle={{ fontSize: 11 }}>
                    {food.dataType}
                  </Chip>
                  <Chip compact textStyle={{ fontSize: 11 }}>
                    ID: {food.fdcId}
                  </Chip>
                  {food.score && (
                    <Chip
                      compact
                      style={{
                        backgroundColor: theme.colors.secondaryContainer,
                      }}
                      textStyle={{ fontSize: 11 }}
                    >
                      {Math.round(food.score)}% relevancia
                    </Chip>
                  )}
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Paginación */}
        {results.totalHits > pageSize && (
          <Surface
            style={[
              styles.paginationContainer,
              { backgroundColor: theme.colors.surface },
            ]}
            elevation={2}
          >
            <Button
              mode="outlined"
              onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isLoading}
              icon="chevron-left"
              compact
            >
              Anterior
            </Button>

            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurface, marginHorizontal: 16 }}
            >
              Página {currentPage} de {Math.ceil(results.totalHits / pageSize)}
            </Text>

            <Button
              mode="outlined"
              onPress={() => setCurrentPage((prev) => prev + 1)}
              disabled={
                currentPage >= Math.ceil(results.totalHits / pageSize) ||
                isLoading
              }
              icon="chevron-right"
              compact
            >
              Siguiente
            </Button>
          </Surface>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Stack.Screen
        options={{
          title: "Búsqueda Avanzada",
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.onSurface,
          headerTitleStyle: {
            fontWeight: "600",
          },
          headerLeft: () => (
            <Appbar.BackAction
              onPress={() => router.back()}
              iconColor={theme.colors.onSurface}
            />
          ),
          presentation: "card",
          animation: "slide_from_right",
        }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {renderSearchHeader()}
        {renderSearchBar()}
        {renderFilters()}
        {renderResults()}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* FAB para búsqueda rápida */}
      {!showFilters && searchQuery && (
        <FAB
          icon="magnify"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={handleSearch}
          loading={isLoading}
          disabled={isLoading}
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

  // Search header
  searchHeader: {
    padding: 24,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  searchIcon: {
    marginBottom: 12,
  },
  searchTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  searchSubtitle: {
    textAlign: "center",
    opacity: 0.9,
  },

  // Search bar
  searchBarContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    elevation: 2,
    borderRadius: 12,
    marginBottom: 12,
  },
  searchActions: {
    flexDirection: "row",
    gap: 12,
  },
  searchButton: {
    flex: 1,
    borderRadius: 24,
  },
  filterButton: {
    borderRadius: 24,
  },

  // Filters
  filtersCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  filterTitle: {
    fontWeight: "bold",
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 8,
  },
  filterSectionTitle: {
    fontWeight: "600",
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  segmentedButtons: {
    marginTop: 8,
  },

  // Results
  resultsContainer: {
    paddingHorizontal: 16,
  },
  resultsHeader: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  resultsInfo: {
    marginBottom: 12,
  },
  resultsChips: {
    flexDirection: "row",
    gap: 8,
  },

  // Foods list
  foodsList: {
    gap: 12,
  },
  foodCard: {
    borderRadius: 12,
  },
  foodChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },

  // Pagination
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },

  // Error state
  errorCard: {
    marginHorizontal: 16,
    borderRadius: 16,
  },
  errorContent: {
    alignItems: "center",
    padding: 16,
  },
  errorTitle: {
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 8,
  },
  errorMessage: {
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    borderRadius: 24,
  },

  // Empty state
  emptyCard: {
    marginHorizontal: 16,
    borderRadius: 16,
  },
  emptyContent: {
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyMessage: {
    textAlign: "center",
    lineHeight: 20,
  },

  // FAB
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 28,
  },

  bottomSpacing: {
    height: 80,
  },
});

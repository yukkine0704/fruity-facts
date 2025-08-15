import SearchSkeleton from "@/components/skeletons/search-skeleton";
import { useFoodSearch } from "@/hooks/useFDCStore";
import { FoodItem } from "@/types/fdc";
import { Link, useNavigation } from "expo-router";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Grid3X3,
  LayoutList,
  Search,
  Vegan,
  XCircle,
} from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, Keyboard, Pressable, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  IconButton,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type ViewMode = "list" | "grid";

// Componente para la vista de lista
interface FoodItemCardProps {
  food: FoodItem;
}

const FoodItemCard = React.memo(({ food }: FoodItemCardProps) => {
  const theme = useTheme();

  return (
    <Link href={`/fruit-details/${food.fdcId}`} asChild>
      <Pressable
        style={({ pressed }) => [
          styles.foodItemCard,
          {
            backgroundColor: theme.colors.surface,
            opacity: pressed ? 0.7 : 1,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
      >
        <View style={styles.cardContent}>
          <View
            style={[
              styles.cardIcon,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            <Vegan size={24} color={theme.colors.onSurfaceVariant} />
          </View>
          <View style={styles.cardTextContent}>
            <Text
              variant="titleMedium"
              style={styles.foodTitle}
              numberOfLines={1}
            >
              {food.description}
            </Text>
            {"brandOwner" in food && food.brandOwner && (
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Marca: {food.brandOwner}
              </Text>
            )}
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Tipo: {food.dataType}
            </Text>
          </View>
        </View>
        <ChevronRight size={24} color={theme.colors.onSurfaceVariant} />
      </Pressable>
    </Link>
  );
});

// Componente para la vista de cuadrícula
const FoodItemGridCard = React.memo(({ food }: FoodItemCardProps) => {
  const theme = useTheme();

  return (
    <Link href={`/fruit-details/${food.fdcId}`} asChild>
      <Pressable
        style={({ pressed }) => [
          styles.foodItemGridCard,
          {
            backgroundColor: theme.colors.surface,
            opacity: pressed ? 0.7 : 1,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
      >
        <View
          style={[
            styles.gridImageContainer,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          <Vegan size={64} color={theme.colors.onSurfaceVariant} />
        </View>
        <View style={styles.gridTextContent}>
          <Text variant="bodyMedium" style={styles.gridTitle} numberOfLines={2}>
            {food.description}
          </Text>
          {"brandOwner" in food && food.brandOwner && (
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
              numberOfLines={1}
            >
              {food.brandOwner}
            </Text>
          )}
        </View>
      </Pressable>
    </Link>
  );
});

export default function SearchScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list"); // Nuevo estado para la vista

  const {
    currentFoods,
    isLoading,
    search,
    clearSearchResults,
    hasResults,
    currentPage,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    loadNextPage,
    loadPreviousPage,
    totalHits,
    error,
  } = useFoodSearch();

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      clearSearchResults();
      return;
    }
    Keyboard.dismiss();
    await search(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    clearSearchResults();
  };

  const renderContent = () => {
    if (isLoading) {
      return <SearchSkeleton viewMode={viewMode} />;
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Card
            style={[
              styles.errorCard,
              { backgroundColor: theme.colors.errorContainer },
            ]}
          >
            <View style={styles.errorCardContent}>
              <AlertTriangle size={32} color={theme.colors.onErrorContainer} />
              <View style={{ flex: 1 }}>
                <Text
                  variant="titleMedium"
                  style={{ color: theme.colors.onErrorContainer }}
                >
                  Ocurrió un error
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onErrorContainer }}
                >
                  No pudimos cargar los resultados. Intenta de nuevo más tarde.
                </Text>
              </View>
              <IconButton
                icon="refresh"
                iconColor={theme.colors.onErrorContainer}
                size={24}
                onPress={() => search(searchQuery)}
              />
            </View>
          </Card>
        </View>
      );
    }

    if (!hasResults && searchQuery.length > 0) {
      return (
        <View style={styles.noResultsContainer}>
          <View
            style={[
              styles.noResultsIcon,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            <ClipboardList size={64} color={theme.colors.onSurfaceVariant} />
          </View>
          <Text
            variant="titleLarge"
            style={[styles.noResultsTitle, { color: theme.colors.onSurface }]}
          >
            ¡Ups! No se encontraron resultados.
          </Text>
          <Text
            variant="bodyMedium"
            style={[
              styles.noResultsDescription,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            No pudimos encontrar lo que buscabas. Intenta con otras palabras
            clave.
          </Text>
        </View>
      );
    }

    if (!hasResults && searchQuery.length === 0) {
      return (
        <View style={styles.noResultsContainer}>
          <View
            style={[
              styles.noResultsIcon,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            <Search size={64} color={theme.colors.onSurfaceVariant} />
          </View>
          <Text
            variant="titleLarge"
            style={[styles.noResultsTitle, { color: theme.colors.onSurface }]}
          >
            Busca un alimento
          </Text>
          <Text
            variant="bodyMedium"
            style={[
              styles.noResultsDescription,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Utiliza la barra de búsqueda para encontrar información nutricional
            de miles de alimentos.
          </Text>
        </View>
      );
    }

    return (
      <>
        <View style={styles.resultsHeader}>
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Resultados encontrados: {totalHits}
          </Text>
        </View>
        <FlatList
          key={viewMode === "list" ? "list-key" : "grid-key"}
          data={currentFoods}
          keyExtractor={(item) => String(item.fdcId)}
          renderItem={({ item }) =>
            viewMode === "list" ? (
              <FoodItemCard food={item as FoodItem} />
            ) : (
              <FoodItemGridCard food={item as FoodItem} />
            )
          }
          numColumns={viewMode === "grid" ? 2 : 1}
          contentContainerStyle={
            viewMode === "grid"
              ? styles.listContentGrid
              : styles.listContentList
          }
        />
      </>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.searchBarContainer}>
        <Searchbar
          placeholder="Buscar un alimento..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onIconPress={handleSearch}
          onSubmitEditing={handleSearch}
          style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
          inputStyle={{ color: theme.colors.onSurface }}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          iconColor={theme.colors.onSurface}
          clearIcon={() => (
            <Pressable onPress={handleClearSearch}>
              <XCircle size={24} color={theme.colors.onSurfaceVariant} />
            </Pressable>
          )}
        />
        <IconButton
          icon={() =>
            viewMode === "list" ? (
              <Grid3X3 size={24} color={theme.colors.primary} />
            ) : (
              <LayoutList size={24} color={theme.colors.primary} />
            )
          }
          size={24}
          onPress={() => setViewMode(viewMode === "list" ? "grid" : "list")}
        />
      </View>

      {renderContent()}

      {/* Paginación */}
      {!isLoading && hasResults && totalPages > 1 && (
        <View
          style={[
            styles.paginationContainer,
            { borderTopColor: theme.colors.outlineVariant },
          ]}
        >
          <Button
            mode="text"
            onPress={loadPreviousPage}
            disabled={!hasPreviousPage}
            icon={() => (
              <ChevronLeft
                size={24}
                color={
                  hasPreviousPage
                    ? theme.colors.primary
                    : theme.colors.onSurfaceDisabled
                }
              />
            )}
          >
            Anterior
          </Button>
          <Text style={{ color: theme.colors.onSurface }}>
            Página {currentPage} de {totalPages}
          </Text>
          <Button
            mode="text"
            onPress={loadNextPage}
            disabled={!hasNextPage}
            icon={() => (
              <ChevronRight
                size={24}
                color={
                  hasNextPage
                    ? theme.colors.primary
                    : theme.colors.onSurfaceDisabled
                }
              />
            )}
            contentStyle={{ flexDirection: "row-reverse" }}
          >
            Siguiente
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    flex: 1,
    borderRadius: 24,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  noResultsIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsTitle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  noResultsDescription: {
    textAlign: "center",
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listContentList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  listContentGrid: {
    paddingHorizontal: 8, // Ajuste para el padding de las tarjetas
    paddingBottom: 24,
    gap: 8,
  },
  foodItemCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTextContent: {
    flex: 1,
    gap: 2,
  },
  foodTitle: {
    fontWeight: "bold",
  },
  foodItemGridCard: {
    flex: 1,
    marginHorizontal: 8,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 8,
  },
  gridImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  gridTextContent: {
    alignItems: "center",
    gap: 4,
  },
  gridTitle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  errorContainer: {
    padding: 16,
  },
  errorCard: {
    borderRadius: 12,
  },
  errorCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
});

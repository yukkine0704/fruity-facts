import { NutritionDetailsCard } from "@/components/NutritionDetailsCard";
import { SearchProgressIndicator } from "@/components/SearchProgressIndicator";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/contexts/ThemeContext";
import { useFoodDetails, useFoodSearch } from "@/hooks/useFDCStore";
import { SearchResultFood } from "@/types/fdc";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Button,
  Card,
  Chip,
  Surface,
  Text,
} from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedSurface = Animated.createAnimatedComponent(Surface);

// Helper para logs de desarrollo
const isDev = __DEV__;
const devLog = (message: string, data?: any) => {
  if (isDev) {
    console.log(`[FruitDetails] ${message}`, data || "");
  }
};

const devError = (message: string, error?: any) => {
  if (isDev) {
    console.error(`[FruitDetails] ${message}`, error || "");
  }
};

export default function FruitDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { fruitName } = route.params as { fruitName: string };
  const { theme } = useTheme();

  const [searchStage, setSearchStage] = useState<
    "searching" | "results" | "loading-details" | "completed" | "error"
  >("searching");
  const [searchProgress, setSearchProgress] = useState(0);
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const {
    search,
    searchResults,
    isLoading: isSearching,
    error: searchError,
    clearSearchResults,
  } = useFoodSearch();

  const {
    currentFood,
    loadFood,
    isLoading: isLoadingFood,
    error: foodError,
    clearCurrentFood,
  } = useFoodDetails();

  // Animaciones
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);

  useEffect(() => {
    devLog("Component mounted", { fruitName });
    fadeAnim.value = withTiming(1, { duration: 600 });
    slideAnim.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, []);

  useEffect(() => {
    if (fruitName) {
      devLog("Starting fruit search", { fruitName });
      searchFruitInformation();
    } else {
      devError("No fruit name provided");
    }
  }, [fruitName]);

  // Log de cambios en el estado de búsqueda
  useEffect(() => {
    devLog("Search stage changed", {
      searchStage,
      progress: searchProgress,
      step: currentStep,
      currentTerm: currentSearchTerm,
    });
  }, [searchStage, searchProgress, currentStep, currentSearchTerm]);

  // Log de cambios en resultados de búsqueda
  useEffect(() => {
    if (searchResults) {
      devLog("Search results updated", {
        resultsCount: searchResults.length,
        firstResultFoods: searchResults[0]?.foods?.length || 0,
        totalHits: searchResults[0]?.totalHits,
      });
    }
  }, [searchResults]);

  // Log de cambios en la comida actual
  useEffect(() => {
    if (currentFood) {
      devLog("Current food loaded", {
        fdcId: currentFood.fdcId,
        description: currentFood.description,
        nutrientsCount: currentFood.foodNutrients?.length || 0,
      });
    }
  }, [currentFood]);

  // Log de errores
  useEffect(() => {
    if (searchError) {
      devError("Search error occurred", searchError);
    }
  }, [searchError]);

  useEffect(() => {
    if (foodError) {
      devError("Food loading error occurred", foodError);
    }
  }, [foodError]);

  const searchFruitInformation = async () => {
    if (!fruitName) {
      devError("searchFruitInformation called without fruitName");
      return;
    }

    try {
      devLog("Starting comprehensive fruit search", { fruitName });

      clearSearchResults();
      clearCurrentFood();
      setSearchStage("searching");
      setSearchProgress(0);
      setCurrentStep(1);

      // Términos de búsqueda progresivos
      const searchTerms = [
        fruitName,
        `${fruitName} fresh`,
        `${fruitName} raw`,
        `fresh ${fruitName}`,
        `raw ${fruitName}`,
        `${fruitName} fruit`,
      ];

      devLog("Search terms prepared", { searchTerms });

      for (let i = 0; i < searchTerms.length; i++) {
        const term = searchTerms[i];
        setCurrentSearchTerm(term);
        setCurrentStep(i + 1);
        setSearchProgress(((i + 1) / searchTerms.length) * 100);

        devLog(`Searching with term ${i + 1}/${searchTerms.length}`, {
          term,
          progress: ((i + 1) / searchTerms.length) * 100,
        });

        const searchParams = {
          dataType: ["Foundation", "Branded"] as ("Foundation" | "Branded")[],
          pageSize: 10,
          sortBy: "lowercaseDescription.keyword" as const,
          sortOrder: "asc" as const,
        };

        devLog("Search parameters", searchParams);

        await search(term, searchParams);

        // Pequeña pausa para mostrar el progreso
        await new Promise((resolve) => setTimeout(resolve, 800));

        const hasResults =
          searchResults &&
          searchResults.length > 0 &&
          searchResults[0]?.foods &&
          searchResults[0].foods.length > 0;

        devLog(`Search attempt ${i + 1} completed`, {
          term,
          hasResults,
          resultsCount: searchResults?.[0]?.foods?.length || 0,
        });

        if (hasResults) {
          devLog("Found results, stopping search", {
            finalTerm: term,
            totalResults: searchResults[0].foods.length,
          });
          break;
        }
      }

      devLog("Search process completed", {
        finalStage: "results",
        hasResults: searchResults && searchResults.length > 0,
      });

      setSearchStage("results");
    } catch (error) {
      devError("Error in searchFruitInformation", error);
      setSearchStage("error");
    }
  };

  const handleSelectFoodItem = async (foodItem: SearchResultFood) => {
    try {
      devLog("Food item selected", {
        fdcId: foodItem.fdcId,
        description: foodItem.description,
        dataType: foodItem.dataType,
      });

      setSearchStage("loading-details");

      devLog("Loading food details", { fdcId: foodItem.fdcId });
      await loadFood(foodItem.fdcId, "full");

      devLog("Food details loaded successfully");
      setSearchStage("completed");
    } catch (err) {
      devError("Error loading food details", err);
      setSearchStage("error");
    }
  };

  const handleRetry = () => {
    devLog("Retry button pressed");
    searchFruitInformation();
  };

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }],
    };
  });

  const renderSearchingState = () => {
    devLog("Rendering searching state", { currentStep, currentSearchTerm });
    return (
      <SearchProgressIndicator
        currentStep={currentStep}
        totalSteps={6}
        currentSearchTerm={currentSearchTerm}
        progress={searchProgress}
      />
    );
  };

  const renderResultsState = () => {
    const hasResults =
      searchResults &&
      searchResults.length > 0 &&
      searchResults[0]?.foods?.length;

    devLog("Rendering results state", {
      hasResults,
      resultsCount: searchResults?.[0]?.foods?.length || 0,
    });

    if (!hasResults) {
      devLog("No results found, showing empty state");
      return (
        <AnimatedSurface
          style={[
            styles.stateContainer,
            containerAnimatedStyle,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
          elevation={2}
        >
          <View style={styles.errorContent}>
            <IconSymbol
              name="magnifyingglass"
              size={64}
              color={theme.colors.outline}
            />
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}
            >
              No se encontró información
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.outline,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              No se encontró información nutricional para "{fruitName}" en la
              base de datos de USDA.
            </Text>
            <Text
              variant="bodySmall"
              style={{
                color: theme.colors.outline,
                textAlign: "center",
                marginTop: 16,
              }}
            >
              Es posible que esta fruta no esté disponible en la base de datos o
              tenga un nombre diferente.
            </Text>
            <Button
              mode="contained"
              onPress={handleRetry}
              style={{ marginTop: 24 }}
            >
              Buscar de nuevo
            </Button>
          </View>
        </AnimatedSurface>
      );
    }

    devLog("Rendering food items list", {
      itemsCount: searchResults[0].foods.length,
    });

    return (
      <View style={styles.resultsContainer}>
        <Surface
          style={[
            styles.resultsHeader,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
          elevation={2}
        >
          <IconSymbol
            name="checkmark.circle.fill"
            size={32}
            color={theme.colors.onPrimaryContainer}
          />
          <View style={styles.resultsHeaderText}>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onPrimaryContainer }}
            >
              ¡Información encontrada!
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onPrimaryContainer }}
            >
              {searchResults[0].foods.length} resultado(s) disponible(s)
            </Text>
          </View>
        </Surface>

        <Text
          variant="bodyMedium"
          style={{
            color: theme.colors.outline,
            margin: 16,
            textAlign: "center",
          }}
        >
          Selecciona el producto que mejor coincida con tu fruta:
        </Text>

        {searchResults[0].foods.map((foodItem, index) => {
          devLog(`Rendering food item ${index}`, {
            fdcId: foodItem.fdcId,
            description: foodItem.description.substring(0, 50) + "...",
          });

          return (
            <Card
              key={foodItem.fdcId}
              style={[
                styles.foodItemCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Card.Content>
                <Text
                  variant="titleSmall"
                  style={{ color: theme.colors.onSurface }}
                >
                  {foodItem.description}
                </Text>
                {foodItem.brandOwner && (
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.outline, marginTop: 4 }}
                  >
                    Marca: {foodItem.brandOwner}
                  </Text>
                )}
                <View style={styles.chipContainer}>
                  <Chip compact mode="outlined" textStyle={{ fontSize: 12 }}>
                    {foodItem.dataType}
                  </Chip>
                  <Chip compact textStyle={{ fontSize: 12 }}>
                    ID: {foodItem.fdcId}
                  </Chip>
                  {foodItem.score && (
                    <Chip
                      compact
                      style={{
                        backgroundColor: theme.colors.secondaryContainer,
                      }}
                      textStyle={{ fontSize: 12 }}
                    >
                      Relevancia: {Math.round(foodItem.score)}%
                    </Chip>
                  )}
                </View>
              </Card.Content>
              <Card.Actions>
                <Button
                  mode="contained-tonal"
                  onPress={() => handleSelectFoodItem(foodItem)}
                  loading={isLoadingFood}
                  disabled={isLoadingFood}
                  icon="arrow.right"
                >
                  Ver Detalles Nutricionales
                </Button>
              </Card.Actions>
            </Card>
          );
        })}
      </View>
    );
  };

  const renderLoadingDetailsState = () => {
    devLog("Rendering loading details state");
    return (
      <AnimatedSurface
        style={[
          styles.stateContainer,
          containerAnimatedStyle,
          { backgroundColor: theme.colors.surface },
        ]}
        elevation={2}
      >
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={theme.colors.secondary} />
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.onSurface, marginTop: 16 }}
          >
            Cargando información detallada...
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              color: theme.colors.outline,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Obteniendo datos nutricionales completos de la base de datos USDA
          </Text>

          <View style={styles.loadingSteps}>
            <View style={styles.loadingStep}>
              <IconSymbol
                name="server.rack"
                size={20}
                color={theme.colors.primary}
              />
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.outline, marginLeft: 8 }}
              >
                Conectando con USDA Food Database
              </Text>
            </View>
            <View style={styles.loadingStep}>
              <IconSymbol
                name="doc.text"
                size={20}
                color={theme.colors.primary}
              />
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.outline, marginLeft: 8 }}
              >
                Descargando información nutricional completa
              </Text>
            </View>
            <View style={styles.loadingStep}>
              <IconSymbol
                name="chart.bar"
                size={20}
                color={theme.colors.primary}
              />
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.outline, marginLeft: 8 }}
              >
                Procesando macronutrientes y micronutrientes
              </Text>
            </View>
          </View>
        </View>
      </AnimatedSurface>
    );
  };

  const renderCompletedState = () => {
    if (!currentFood) {
      devError("renderCompletedState called but currentFood is null");
      return null;
    }

    devLog("Rendering completed state", {
      fdcId: currentFood.fdcId,
      description: currentFood.description,
      nutrientsCount: currentFood.foodNutrients?.length || 0,
    });

    return (
      <View style={styles.completedContainer}>
        <Surface
          style={[
            styles.successHeader,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
          elevation={2}
        >
          <IconSymbol
            name="checkmark.circle.fill"
            size={32}
            color={theme.colors.onPrimaryContainer}
          />
          <View style={styles.successHeaderText}>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onPrimaryContainer }}
            >
              Información cargada exitosamente
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onPrimaryContainer }}
            >
              Datos completos de USDA Food Database
            </Text>
          </View>
        </Surface>

        <NutritionDetailsCard food={currentFood} />
      </View>
    );
  };

  const renderErrorState = () => {
    const errorMessage =
      searchError ||
      foodError ||
      "Ocurrió un error inesperado al conectar con la base de datos";

    devLog("Rendering error state", {
      searchError,
      foodError,
      finalErrorMessage: errorMessage,
    });

    return (
      <AnimatedSurface
        style={[
          styles.stateContainer,
          containerAnimatedStyle,
          { backgroundColor: theme.colors.errorContainer },
        ]}
        elevation={2}
      >
        <View style={styles.errorContent}>
          <IconSymbol
            name="exclamationmark.triangle.fill"
            size={64}
            color={theme.colors.onErrorContainer}
          />
          <Text
            variant="titleLarge"
            style={{ color: theme.colors.onErrorContainer, marginTop: 16 }}
          >
            Error al cargar información
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              color: theme.colors.onErrorContainer,
              textAlign: "center",
              marginTop: 8,
            }}
          >
            {errorMessage}
          </Text>

          <View style={styles.errorDetails}>
            <Text
              variant="bodySmall"
              style={{
                color: theme.colors.onErrorContainer,
                textAlign: "center",
              }}
            >
              Posibles causas:
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onErrorContainer }}
            >
              • Problemas de conectividad
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onErrorContainer }}
            >
              • Servicio temporalmente no disponible
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onErrorContainer }}
            >
              • Límite de consultas excedido
            </Text>
          </View>

          <Button
            mode="contained"
            onPress={handleRetry}
            style={{ marginTop: 24, backgroundColor: theme.colors.error }}
            labelStyle={{ color: theme.colors.onError }}
          >
            Reintentar búsqueda
          </Button>
        </View>
      </AnimatedSurface>
    );
  };

  const renderContent = () => {
    devLog("Rendering content for stage", { searchStage });

    switch (searchStage) {
      case "searching":
        return renderSearchingState();
      case "results":
        return renderResultsState();
      case "loading-details":
        return renderLoadingDetailsState();
      case "completed":
        return renderCompletedState();
      case "error":
        return renderErrorState();
      default:
        devError("Unknown search stage", { searchStage });
        return renderSearchingState();
    }
  };

  const getAppBarSubtitle = () => {
    const subtitle = (() => {
      switch (searchStage) {
        case "searching":
          return "Buscando...";
        case "results":
          return "Resultados encontrados";
        case "loading-details":
          return "Cargando detalles...";
        case "completed":
          return "Información completa";
        case "error":
          return "Error";
        default:
          return "";
      }
    })();

    devLog("AppBar subtitle updated", { searchStage, subtitle });
    return subtitle;
  };

  const handleBackPress = () => {
    devLog("Back button pressed");
    navigation.goBack();
  };

  const handleRefreshPress = () => {
    devLog("Refresh button pressed", {
      isSearching,
      isLoadingFood,
      disabled: isSearching || isLoadingFood,
    });

    if (!isSearching && !isLoadingFood) {
      handleRetry();
    }
  };

  // Log del estado general del componente
  useEffect(() => {
    devLog("Component state summary", {
      fruitName,
      searchStage,
      isSearching,
      isLoadingFood,
      hasSearchResults: !!searchResults?.length,
      hasCurrentFood: !!currentFood,
      hasSearchError: !!searchError,
      hasFoodError: !!foodError,
    });
  }, [
    fruitName,
    searchStage,
    isSearching,
    isLoadingFood,
    searchResults,
    currentFood,
    searchError,
    foodError,
  ]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={handleBackPress} />
        <Appbar.Content
          title={fruitName || "Cargando..."}
          subtitle={getAppBarSubtitle()}
          titleStyle={{ color: theme.colors.onSurface }}
          subtitleStyle={{ color: theme.colors.outline }}
        />
        <Appbar.Action
          icon="refresh"
          onPress={handleRefreshPress}
          disabled={isSearching || isLoadingFood}
        />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
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
    paddingBottom: 32,
  },
  stateContainer: {
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    margin: 16,
  },
  loadingContent: {
    alignItems: "center",
    width: "100%",
  },
  loadingSteps: {
    marginTop: 24,
    gap: 12,
    alignSelf: "flex-start",
  },
  loadingStep: {
    flexDirection: "row",
    alignItems: "center",
  },
  errorContent: {
    alignItems: "center",
    width: "100%",
  },
  errorDetails: {
    marginTop: 16,
    alignItems: "center",
    gap: 4,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    margin: 16,
  },
  resultsHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  foodItemCard: {
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  completedContainer: {
    flex: 1,
  },
  successHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    margin: 16,
  },
  successHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
});

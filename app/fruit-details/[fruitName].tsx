import { AppHeader } from "@/components/AppHeader";
import { NutritionDetailsCard } from "@/components/NutritionDetailsCard";
import { SearchProgressIndicator } from "@/components/SearchProgressIndicator";
import { useTheme } from "@/contexts/ThemeContext";
import { useFoodDetails, useFoodSearch } from "@/hooks/useFDCStore";
import { SearchResultFood } from "@/types/fdc";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
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
import { SafeAreaView } from "react-native-safe-area-context";

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
  // Obtener parámetros de la URL con Expo Router
  const { fruitName } = useLocalSearchParams<{ fruitName: string }>();
  const { theme } = useTheme();

  const [searchStage, setSearchStage] = useState<
    "searching" | "results" | "loading-details" | "completed" | "error"
  >("searching");
  const [searchProgress, setSearchProgress] = useState(0);
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const {
    search,
    searchFruit, // Usar esta función en lugar de search
    hasResults, // Usar esta utilidad
    currentFoods, // Usar esta utilidad
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
    // Animar la entrada de la vista principal
    fadeAnim.value = withTiming(1, { duration: 600 });
    slideAnim.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, []);

  useEffect(() => {
    if (fruitName) {
      const decodedFruitName = decodeURIComponent(fruitName);
      devLog("Starting fruit search", { fruitName: decodedFruitName });
      searchFruitInformation(decodedFruitName);
    } else {
      devError("No fruit name provided");
      setSearchStage("error"); // Pasa a estado de error si no hay nombre de fruta
    }
  }, [fruitName]);

  // Logs de depuración (mantener para desarrollo, eliminar en producción)
  useEffect(() => {
    devLog("Search stage changed", {
      searchStage,
      progress: searchProgress,
      step: currentStep,
      currentTerm: currentSearchTerm,
    });
  }, [searchStage, searchProgress, currentStep, currentSearchTerm]);

  useEffect(() => {
    if (currentFoods.length > 0) {
      devLog("Search results updated", {
        resultsCount: currentFoods.length,
        firstResult: currentFoods[0]?.description?.substring(0, 50) + "...",
      });
    }
  }, [currentFoods]);

  useEffect(() => {
    if (currentFood) {
      devLog("Current food loaded", {
        fdcId: currentFood.fdcId,
        description: currentFood.description,
        nutrientsCount: currentFood.foodNutrients?.length || 0,
      });
    }
  }, [currentFood]);

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

  const searchFruitInformation = async (fruitNameParam: string) => {
    if (!fruitNameParam) {
      devError("searchFruitInformation called without fruitName");
      setSearchStage("error");
      return;
    }

    try {
      devLog("Starting comprehensive fruit search", {
        fruitName: fruitNameParam,
      });

      clearSearchResults();
      clearCurrentFood();
      setSearchStage("searching");
      setSearchProgress(0);
      setCurrentStep(1);

      // Términos de búsqueda progresivos
      const searchTerms = [
        fruitNameParam,
        `${fruitNameParam} fresh`,
        `${fruitNameParam} raw`,
        `fresh ${fruitNameParam}`,
        `raw ${fruitNameParam}`,
        `${fruitNameParam} fruit`,
      ];

      devLog("Search terms prepared", { searchTerms });

      let foundResults = false;
      for (let i = 0; i < searchTerms.length; i++) {
        const term = searchTerms[i];
        setCurrentSearchTerm(term);
        setCurrentStep(i + 1);
        setSearchProgress(((i + 1) / searchTerms.length) * 100);

        devLog(`Searching with term ${i + 1}/${searchTerms.length}`, {
          term,
          progress: ((i + 1) / searchTerms.length) * 100,
        });

        // Usar la función search del hook directamente
        await search(term, {
          dataType: ["Foundation", "Branded"],
          pageSize: 10,
          sortBy: "lowercaseDescription.keyword",
          sortOrder: "asc",
        });

        // Pausa para mostrar el progreso
        await new Promise((resolve) => setTimeout(resolve, 800));

        devLog(`Search attempt ${i + 1} completed`, {
          term,
          hasResults,
          currentFoodsLength: currentFoods.length,
        });

        if (hasResults && currentFoods.length > 0) {
          foundResults = true;
          devLog("Found results, stopping search", {
            finalTerm: term,
            totalResults: currentFoods.length,
          });
          break;
        }
      }

      devLog("Search process completed", {
        finalStage: foundResults ? "results" : "error",
        hasResults: foundResults,
        currentFoodsLength: currentFoods.length,
      });

      setSearchStage(foundResults ? "results" : "error");
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
    if (fruitName) {
      searchFruitInformation(decodeURIComponent(fruitName));
    } else {
      devLog("No fruitName to retry with.");
      router.back(); // Si no hay fruta, simplemente regresa
    }
  };

  const handleBackPress = () => {
    devLog("Back button pressed");
    router.back();
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
    const hasResultsToShow = currentFoods.length > 0;

    devLog("Rendering results state", {
      hasResults: hasResultsToShow,
      resultsCount: currentFoods.length,
    });

    if (!hasResultsToShow) {
      devLog("No results found in renderResultsState, fallback to error state");
      return renderErrorState();
    }

    return (
      <View style={styles.resultsContainer}>
        <Surface
          style={[
            styles.resultsHeader,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
          elevation={2}
        >
          <MaterialCommunityIcons
            name="check-circle"
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
              {currentFoods.length} resultado(s) disponible(s)
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
        {currentFoods.map((foodItem: SearchResultFood, index: number) => {
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
              elevation={1}
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
                  <Chip
                    compact
                    mode="outlined"
                    textStyle={{
                      fontSize: 12,
                      color: theme.colors.onSurfaceVariant,
                    }}
                    style={{ borderColor: theme.colors.outlineVariant }}
                  >
                    {foodItem.dataType}
                  </Chip>
                  <Chip
                    compact
                    textStyle={{
                      fontSize: 12,
                      color: theme.colors.onSurfaceVariant,
                    }}
                    style={{
                      backgroundColor: theme.colors.surfaceContainerLow,
                    }}
                  >
                    ID: {foodItem.fdcId}
                  </Chip>
                  {foodItem.score && (
                    <Chip
                      compact
                      style={{
                        backgroundColor: theme.colors.secondaryContainer,
                      }}
                      textStyle={{
                        fontSize: 12,
                        color: theme.colors.onSecondaryContainer,
                      }}
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
                  icon="arrow-right"
                  contentStyle={{
                    flexDirection: "row-reverse",
                    justifyContent: "space-between",
                    paddingHorizontal: 16,
                  }}
                  labelStyle={{
                    flex: 1,
                    textAlign: "center",
                    marginRight: 8,
                  }}
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
          <ActivityIndicator size="large" color={theme.colors.primary} />
          {/* Cambiado a primary para consistencia */}
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
              <MaterialCommunityIcons // Usamos MaterialCommunityIcons
                name="database-search" // Icono de base de datos
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
              <MaterialCommunityIcons // Usamos MaterialCommunityIcons
                name="download" // Icono de descarga
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
              <MaterialCommunityIcons // Usamos MaterialCommunityIcons
                name="chart-bar" // Icono de gráfico
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
      // Fallback a un estado de error si no hay datos a pesar de estar "completado"
      return renderErrorState();
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
            { backgroundColor: theme.colors.tertiaryContainer },
          ]}
          elevation={2}
        >
          <MaterialCommunityIcons
            name="food-apple"
            size={32}
            color={theme.colors.onTertiaryContainer}
          />
          <View style={styles.successHeaderText}>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onTertiaryContainer }}
            >
              ¡Información cargada exitosamente!
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onTertiaryContainer }}
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
    const displayErrorMessage =
      "Ocurrió un error inesperado al conectar con la base de datos.";

    devLog("Rendering error state", {
      searchError,
      foodError,
      displayErrorMessage,
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
          <MaterialCommunityIcons
            name="alert-octagon"
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
            {displayErrorMessage}
          </Text>

          <View style={styles.errorDetails}>
            <Text
              variant="bodySmall"
              style={{
                color: theme.colors.onErrorContainer,
                textAlign: "center",
                fontWeight: "bold",
                marginBottom: 4,
              }}
            >
              Posibles causas:
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onErrorContainer }}
            >
              • Problemas de conectividad a internet
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onErrorContainer }}
            >
              • Servicio USDA temporalmente no disponible
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onErrorContainer }}
            >
              • Nombre de fruta no reconocido o límites de consultas
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
        devError("Unknown search stage, falling back to searching", {
          searchStage,
        });
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

  // Log del estado general del componente
  useEffect(() => {
    devLog("Component state summary", {
      fruitName,
      searchStage,
      isSearching,
      isLoadingFood,
      hasSearchResults: hasResults && currentFoods.length > 0,
      hasCurrentFood: !!currentFood,
      hasSearchError: !!searchError,
      hasFoodError: !!foodError,
    });
  }, [
    fruitName,
    searchStage,
    isSearching,
    isLoadingFood,
    hasResults,
    currentFoods,
    currentFood,
    searchError,
    foodError,
  ]);

  const decodedFruitName = fruitName
    ? decodeURIComponent(fruitName)
    : "Cargando...";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <AppHeader
        title={decodedFruitName}
        leftAction={{
          icon: "arrow-left",
          onPress: handleBackPress,
          accessibilityLabel: "Volver atrás",
        }}
        rightAction={{
          icon: "refresh",
          onPress: handleRefreshPress,
          accessibilityLabel: "Actualizar información",
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con información de la fruta */}
        <Surface
          style={[
            styles.fruitHeader,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
          elevation={theme.dark ? 1 : 3}
        >
          <View style={styles.fruitHeaderContent}>
            <Text
              variant="headlineMedium"
              style={[
                styles.fruitTitle,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              <MaterialCommunityIcons
                name="food-apple-outline"
                size={36}
                color={theme.colors.onPrimaryContainer}
              />
              {decodedFruitName}
            </Text>
            <Text
              variant="bodyMedium"
              style={[
                styles.fruitSubtitle,
                { color: theme.colors.onPrimaryContainer, opacity: 0.8 },
              ]}
            >
              {getAppBarSubtitle()}
            </Text>
          </View>
        </Surface>

        {renderContent()}
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
    paddingBottom: 32,
  },

  // Fruit header styles
  fruitHeader: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 20,
    padding: 16,
  },
  fruitHeaderContent: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  fruitTitle: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  fruitSubtitle: {
    textAlign: "center",
  },

  // State container styles
  stateContainer: {
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 16,
  },

  // Loading content styles
  loadingContent: {
    alignItems: "center",
    width: "100%",
  },
  loadingSteps: {
    marginTop: 24,
    gap: 12,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
  },
  loadingStep: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Error content styles
  errorContent: {
    alignItems: "center",
    width: "100%",
  },
  errorDetails: {
    marginTop: 16,
    alignItems: "flex-start",
    gap: 4,
    width: "80%",
  },

  // Results container styles
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  resultsHeaderText: {
    marginLeft: 12,
    flex: 1,
  },

  // Food item card styles
  foodItemCard: {
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },

  // Completed container styles
  completedContainer: {
    flex: 1,
  },
  successHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  successHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
});

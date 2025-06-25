import { NutritionDetailsCard } from "@/components/NutritionDetailsCard";
import { SearchProgressIndicator } from "@/components/SearchProgressIndicator";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/contexts/ThemeContext";
import { useFoodDetails, useFoodSearch } from "@/hooks/useFDCStore";
import { SearchResultFood } from "@/types/fdc";
import { useLocalSearchParams, useRouter } from "expo-router";
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

export default function FruitDetailsScreen() {
  const { fruitName } = useLocalSearchParams<{ fruitName: string }>();
  const router = useRouter();
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
    fadeAnim.value = withTiming(1, { duration: 600 });
    slideAnim.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, []);

  useEffect(() => {
    if (fruitName) {
      searchFruitInformation();
    }
  }, [fruitName]);

  const searchFruitInformation = async () => {
    if (!fruitName) return;

    try {
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

      for (let i = 0; i < searchTerms.length; i++) {
        const term = searchTerms[i];
        setCurrentSearchTerm(term);
        setCurrentStep(i + 1);
        setSearchProgress(((i + 1) / searchTerms.length) * 100);

        await search(term, {
          dataType: ["Foundation", "Branded"],
          pageSize: 10,
          sortBy: "lowercaseDescription.keyword",
          sortOrder: "asc",
        });

        // Pequeña pausa para mostrar el progreso
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (
          searchResults &&
          searchResults.length > 0 &&
          searchResults[0]?.foods &&
          searchResults[0].foods.length > 0
        ) {
          break;
        }
      }

      setSearchStage("results");
    } catch (error) {
      console.error("Error searching fruit:", error);
      setSearchStage("error");
    }
  };

  const handleSelectFoodItem = async (foodItem: SearchResultFood) => {
    try {
      setSearchStage("loading-details");
      await loadFood(foodItem.fdcId, "full");
      setSearchStage("completed");
    } catch (err) {
      console.error("Error loading food details:", err);
      setSearchStage("error");
    }
  };

  const handleRetry = () => {
    searchFruitInformation();
  };

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }],
    };
  });

  const renderSearchingState = () => (
    <SearchProgressIndicator
      currentStep={currentStep}
      totalSteps={6}
      currentSearchTerm={currentSearchTerm}
      progress={searchProgress}
    />
  );

  const renderResultsState = () => {
    if (
      !searchResults ||
      searchResults.length === 0 ||
      !searchResults[0]?.foods?.length
    ) {
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

        {searchResults[0].foods.map((foodItem, index) => (
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
                    style={{ backgroundColor: theme.colors.secondaryContainer }}
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
        ))}
      </View>
    );
  };

  const renderLoadingDetailsState = () => (
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

  const renderCompletedState = () => {
    if (!currentFood) return null;

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

  const renderErrorState = () => (
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
          {searchError ||
            foodError ||
            "Ocurrió un error inesperado al conectar con la base de datos"}
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

  const renderContent = () => {
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
        return renderSearchingState();
    }
  };

  const getAppBarSubtitle = () => {
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
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title={fruitName || "Cargando..."}
          subtitle={getAppBarSubtitle()}
          titleStyle={{ color: theme.colors.onSurface }}
          subtitleStyle={{ color: theme.colors.outline }}
        />
        <Appbar.Action
          icon="refresh"
          onPress={handleRetry}
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

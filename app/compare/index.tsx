import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/contexts/ThemeContext";
import { useCompareStore } from "@/stores/compareStore";
import { Fruit } from "@/types/fruit";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  DataTable,
  FAB,
  Snackbar,
  Surface,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CompareScreen() {
  const { theme } = useTheme();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const {
    comparedFruits,
    removeFromComparison,
    clearComparison,
    getComparisonStats,
  } = useCompareStore();

  const showMessage = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  const handleRemoveFruit = (fruit: Fruit) => {
    removeFromComparison(fruit.id.toString());
    showMessage(`${fruit.name} eliminado de la comparación`);
  };

  const handleClearAll = () => {
    clearComparison();
    showMessage("Comparación limpiada");
  };

  const handleAddMore = () => {
    router.push("/(tabs)/explore");
  };

  const stats = getComparisonStats();

  const renderHeader = () => (
    <Surface
      style={[
        styles.header,
        { backgroundColor: theme.colors.primaryContainer },
      ]}
      elevation={3}
    >
      <IconSymbol
        size={60}
        color={theme.colors.onPrimaryContainer}
        name="scale.3d"
        style={styles.headerIcon}
      />
      <Text
        variant="headlineLarge"
        style={[styles.title, { color: theme.colors.onPrimaryContainer }]}
      >
        Comparar Frutas
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.subtitle, { color: theme.colors.onPrimaryContainer }]}
      >
        Compara valores nutricionales lado a lado
      </Text>
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
          name="scale.3d"
          size={80}
          color={theme.colors.onSurfaceVariant}
          style={styles.emptyIcon}
        />
        <Text
          variant="headlineSmall"
          style={[styles.emptyTitle, { color: theme.colors.onSurfaceVariant }]}
        >
          Sin frutas para comparar
        </Text>
        <Text
          variant="bodyMedium"
          style={[
            styles.emptyMessage,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          Agrega frutas desde la sección Explorar para compararlas aquí
        </Text>

        <Button
          mode="contained"
          onPress={handleAddMore}
          icon="plus"
          style={styles.addButton}
        >
          Agregar frutas
        </Button>
      </Surface>
    </View>
  );

  const renderComparisonTable = () => {
    if (comparedFruits.length === 0) return null;

    const nutrients = [
      { key: "calories", label: "Calorías", unit: "kcal" },
      { key: "protein", label: "Proteínas", unit: "g" },
      { key: "carbs", label: "Carbohidratos", unit: "g" },
      { key: "fat", label: "Grasas", unit: "g" },
      { key: "fiber", label: "Fibra", unit: "g" },
      { key: "sugar", label: "Azúcares", unit: "g" },
      { key: "vitaminC", label: "Vitamina C", unit: "mg" },
      { key: "potassium", label: "Potasio", unit: "mg" },
    ];

    return (
      <Card
        style={[styles.tableCard, { backgroundColor: theme.colors.surface }]}
      >
        <Card.Content>
          <Text
            variant="titleMedium"
            style={[styles.tableTitle, { color: theme.colors.onSurface }]}
          >
            📊 Comparación Nutricional
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <DataTable style={styles.dataTable}>
              <DataTable.Header>
                <DataTable.Title style={styles.nutrientColumn}>
                  <Text variant="labelMedium" style={{ fontWeight: "bold" }}>
                    Nutriente
                  </Text>
                </DataTable.Title>
                {comparedFruits.map((fruit) => (
                  <DataTable.Title key={fruit.id} style={styles.fruitColumn}>
                    <Text
                      variant="labelMedium"
                      style={{ fontWeight: "bold", textAlign: "center" }}
                      numberOfLines={2}
                    >
                      {fruit.name}
                    </Text>
                  </DataTable.Title>
                ))}
              </DataTable.Header>

              {nutrients.map((nutrient) => (
                <DataTable.Row key={nutrient.key}>
                  <DataTable.Cell style={styles.nutrientColumn}>
                    <Text variant="bodySmall" style={{ fontWeight: "500" }}>
                      {nutrient.label}
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.outline, fontSize: 10 }}
                    >
                      ({nutrient.unit})
                    </Text>
                  </DataTable.Cell>
                  {comparedFruits.map((fruit) => (
                    <DataTable.Cell key={fruit.id} style={styles.fruitColumn}>
                      <Text
                        variant="bodySmall"
                        style={{ textAlign: "center", fontWeight: "500" }}
                      >
                        {(fruit as any)[nutrient.key] || "N/A"}
                      </Text>
                    </DataTable.Cell>
                  ))}
                </DataTable.Row>
              ))}
            </DataTable>
          </ScrollView>
        </Card.Content>
      </Card>
    );
  };

  const renderStatsCard = () => {
    if (!stats || comparedFruits.length === 0) return null;

    return (
      <Card
        style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}
      >
        <Card.Content>
          <Text
            variant="titleMedium"
            style={[styles.statsTitle, { color: theme.colors.onSurface }]}
          >
            📈 Estadísticas de Comparación
          </Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.primary, fontWeight: "bold" }}
              >
                {stats.highestCalories.name}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurface }}
              >
                Más calorías ({stats.highestCalories.nutritions.calories} kcal)
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.secondary, fontWeight: "bold" }}
              >
                {stats.highestProtein.name}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurface }}
              >
                Más proteína ({stats.highestProtein.nutritions.protein}g)
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.primary, fontWeight: "bold" }}
              >
                {Math.round(stats.averageCalories)}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurface }}
              >
                Promedio calorías
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderFruitsList = () => {
    if (comparedFruits.length === 0) return null;

    return (
      <Card
        style={[styles.fruitsCard, { backgroundColor: theme.colors.surface }]}
      >
        <Card.Content>
          <View style={styles.fruitsHeader}>
            <Text
              variant="titleMedium"
              style={[styles.fruitsTitle, { color: theme.colors.onSurface }]}
            >
              🍎 Frutas en comparación ({comparedFruits.length})
            </Text>

            {comparedFruits.length > 0 && (
              <Button
                mode="text"
                onPress={handleClearAll}
                icon="delete"
                compact
                textColor={theme.colors.error}
              >
                Limpiar todo
              </Button>
            )}
          </View>

          <View style={styles.fruitsList}>
            {comparedFruits.map((fruit, index) => (
              <View key={fruit.id} style={styles.fruitItem}>
                <View style={styles.fruitInfo}>
                  <Text
                    variant="titleSmall"
                    style={{ color: theme.colors.onSurface }}
                  >
                    {fruit.name}
                  </Text>
                  <View style={styles.fruitChips}>
                    <Chip compact icon="fire" textStyle={{ fontSize: 11 }}>
                      {fruit.nutritions.calories || 0} kcal
                    </Chip>
                    <Chip compact icon="dumbbell" textStyle={{ fontSize: 11 }}>
                      {fruit.nutritions.protein || 0}g proteína
                    </Chip>
                  </View>
                </View>

                <Button
                  mode="outlined"
                  onPress={() => handleRemoveFruit(fruit)}
                  icon="close"
                  compact
                  style={styles.removeButton}
                >
                  Quitar
                </Button>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Stack.Screen
        options={{
          title: "Comparar Frutas",
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.onSurface,
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeader()}

        {comparedFruits.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {renderStatsCard()}
            {renderComparisonTable()}
            {renderFruitsList()}
          </>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {comparedFruits.length > 0 && comparedFruits.length < 5 && (
        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddMore}
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

  // Header
  header: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 24,
    marginBottom: 16,
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

  // Empty state
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
  addButton: {
    borderRadius: 24,
  },

  // Stats card
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  statsTitle: {
    fontWeight: "bold",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
    minWidth: "45%",
  },

  // Table card
  tableCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  tableTitle: {
    fontWeight: "bold",
    marginBottom: 16,
  },
  dataTable: {
    minWidth: 400,
  },
  nutrientColumn: {
    minWidth: 120,
    justifyContent: "flex-start",
  },
  fruitColumn: {
    minWidth: 100,
    justifyContent: "center",
  },

  // Fruits card
  fruitsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  fruitsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  fruitsTitle: {
    fontWeight: "bold",
  },
  fruitsList: {
    gap: 12,
  },
  fruitItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  fruitInfo: {
    flex: 1,
  },
  fruitChips: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
  },
  removeButton: {
    borderRadius: 20,
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

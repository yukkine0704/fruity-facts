import { useTheme } from "@/contexts/ThemeContext";
import { AbridgedFoodNutrient, FoodItem, FoodNutrient } from "@/types/fdc";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Chip, Divider, Surface, Text } from "react-native-paper";
import { IconSymbol } from "./ui/IconSymbol";

interface NutritionDetailsCardProps {
  food: FoodItem;
}

export const NutritionDetailsCard: React.FC<NutritionDetailsCardProps> = ({
  food,
}) => {
  const { theme } = useTheme();

  // Helper function para verificar si un nutriente es del tipo FoodNutrient
  const isFoodNutrient = (
    nutrient: AbridgedFoodNutrient | FoodNutrient
  ): nutrient is FoodNutrient => {
    return "nutrient" in nutrient;
  };

  const renderNutrientValue = (
    nutrient: AbridgedFoodNutrient | FoodNutrient
  ) => {
    if (!nutrient || nutrient.amount === undefined) return "N/A";
    const amount = Number(nutrient.amount);

    let unit = "";
    if (isFoodNutrient(nutrient)) {
      unit = nutrient.nutrient?.unitName || "";
    } else {
      unit = nutrient.unitName || "";
    }

    if (amount === 0) return "0";
    if (amount < 0.01) return "< 0.01";

    return `${amount.toFixed(2)} ${unit}`;
  };

  const getNutrientName = (
    nutrient: AbridgedFoodNutrient | FoodNutrient
  ): string => {
    if (isFoodNutrient(nutrient)) {
      return nutrient.nutrient?.name || "Desconocido";
    } else {
      return nutrient.name || "Desconocido";
    }
  };

  const getMainNutrients = () => {
    if (!food.foodNutrients) return [];

    const mainNutrientNames = [
      { name: "Energy", icon: "bolt.fill", color: theme.colors.error },
      {
        name: "Protein",
        icon: "figure.strengthtraining.traditional",
        color: theme.colors.primary,
      },
      {
        name: "Total lipid (fat)",
        icon: "drop.fill",
        color: theme.colors.tertiary,
      },
      {
        name: "Carbohydrate, by difference",
        icon: "leaf.fill",
        color: theme.colors.secondary,
      },
      {
        name: "Fiber, total dietary",
        icon: "heart.fill",
        color: theme.colors.primary,
      },
      {
        name: "Sugars, total including NLEA",
        icon: "cube.fill",
        color: theme.colors.error,
      },
    ];

    return mainNutrientNames
      .map(({ name, icon, color }) => {
        const nutrient = food.foodNutrients?.find((n) => {
          const nutrientName = getNutrientName(n);
          return nutrientName.toLowerCase().includes(name.toLowerCase());
        });

        if (nutrient) {
          return {
            ...nutrient,
            displayName: name,
            icon,
            color,
            nutrientName: getNutrientName(nutrient),
          };
        }
        return null;
      })
      .filter(
        (n): n is NonNullable<typeof n> => n !== null && n.amount !== undefined
      );
  };

  const getVitaminsAndMinerals = () => {
    if (!food.foodNutrients) return [];

    const vitaminsAndMinerals = [
      "Vitamin C, total ascorbic acid",
      "Vitamin A, RAE",
      "Vitamin K (phylloquinone)",
      "Folate, total",
      "Calcium, Ca",
      "Iron, Fe",
      "Magnesium, Mg",
      "Phosphorus, P",
      "Potassium, K",
      "Sodium, Na",
      "Zinc, Zn",
    ];

    return food.foodNutrients
      .filter((nutrient) => {
        const nutrientName = getNutrientName(nutrient);
        return vitaminsAndMinerals.some((vm) => nutrientName.includes(vm));
      })
      .slice(0, 10);
  };

  const mainNutrients = getMainNutrients();
  const vitaminsAndMinerals = getVitaminsAndMinerals();

  return (
    <View style={styles.container}>
      {/* Información básica del alimento */}
      <Surface
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        elevation={2}
      >
        <View style={styles.cardHeader}>
          <IconSymbol
            name="info.circle.fill"
            size={24}
            color={theme.colors.primary}
          />
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.onSurface, marginLeft: 8 }}
          >
            Información del Producto
          </Text>
        </View>

        <Text
          variant="bodyLarge"
          style={{ color: theme.colors.onSurface, marginBottom: 8 }}
        >
          {food.description}
        </Text>

        <View style={styles.chipContainer}>
          <Chip compact mode="outlined">
            {food.dataType}
          </Chip>
          {"brandOwner" in food && food.brandOwner && (
            <Chip compact>Marca: {food.brandOwner}</Chip>
          )}
          <Chip compact>ID: {food.fdcId}</Chip>
        </View>

        {"ingredients" in food && food.ingredients && (
          <View style={styles.ingredientsSection}>
            <Text
              variant="titleSmall"
              style={{ color: theme.colors.onSurface, marginBottom: 8 }}
            >
              Ingredientes:
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
              {food.ingredients}
            </Text>
          </View>
        )}

        {"servingSize" in food && food.servingSize && (
          <View style={styles.servingSection}>
            <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
              Tamaño de porción: {food.servingSize}{" "}
              {food.servingSizeUnit || "g"}
            </Text>
          </View>
        )}
      </Surface>

      {/* Macronutrientes principales */}
      {mainNutrients.length > 0 && (
        <Surface
          style={[styles.card, { backgroundColor: theme.colors.surface }]}
          elevation={2}
        >
          <View style={styles.cardHeader}>
            <IconSymbol
              name="chart.bar.fill"
              size={24}
              color={theme.colors.secondary}
            />
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onSurface, marginLeft: 8 }}
            >
              Macronutrientes
            </Text>
          </View>
          {mainNutrients.map((nutrient, index) => (
            <View key={index}>
              <View style={styles.nutrientRow}>
                <View style={styles.nutrientInfo}>
                  <IconSymbol
                    name={nutrient.icon as any}
                    size={20}
                    color={nutrient.color}
                    style={styles.nutrientIcon}
                  />
                  <View style={styles.nutrientText}>
                    <Text
                      variant="bodyMedium"
                      style={{ color: theme.colors.onSurface }}
                    >
                      {nutrient.displayName}
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.outline }}
                    >
                      {nutrient.nutrientName}
                    </Text>
                  </View>
                </View>
                <Text
                  variant="titleSmall"
                  style={{ color: theme.colors.primary }}
                >
                  {renderNutrientValue(nutrient)}
                </Text>
              </View>
              {index < mainNutrients.length - 1 && (
                <Divider style={{ marginVertical: 8 }} />
              )}
            </View>
          ))}{" "}
        </Surface>
      )}

      {/* Vitaminas y minerales */}
      {vitaminsAndMinerals.length > 0 && (
        <Surface
          style={[styles.card, { backgroundColor: theme.colors.surface }]}
          elevation={2}
        >
          <View style={styles.cardHeader}>
            <IconSymbol
              name="pills.fill"
              size={24}
              color={theme.colors.tertiary}
            />
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onSurface, marginLeft: 8 }}
            >
              Vitaminas y Minerales
            </Text>
          </View>

          <View style={styles.vitaminsGrid}>
            {vitaminsAndMinerals.map((nutrient, index) => (
              <View key={index} style={styles.vitaminItem}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurface, fontWeight: "bold" }}
                >
                  {getNutrientName(nutrient).split(",")[0]}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.primary }}
                >
                  {renderNutrientValue(nutrient)}
                </Text>
              </View>
            ))}
          </View>
        </Surface>
      )}

      {/* Información adicional si está disponible */}
      {"publicationDate" in food && food.publicationDate && (
        <Surface
          style={[
            styles.card,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
          elevation={1}
        >
          <View style={styles.cardHeader}>
            <IconSymbol
              name="calendar.circle"
              size={20}
              color={theme.colors.outline}
            />
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant, marginLeft: 8 }}
            >
              Fecha de publicación:{" "}
              {new Date(food.publicationDate).toLocaleDateString()}
            </Text>
          </View>
        </Surface>
      )}

      {/* Disclaimer */}
      <Surface
        style={[
          styles.disclaimerCard,
          { backgroundColor: theme.colors.secondaryContainer },
        ]}
        elevation={1}
      >
        <IconSymbol
          name="info.circle"
          size={20}
          color={theme.colors.onSecondaryContainer}
        />
        <Text
          variant="bodySmall"
          style={{
            color: theme.colors.onSecondaryContainer,
            marginLeft: 8,
            flex: 1,
          }}
        >
          Los valores nutricionales son proporcionados por la base de datos de
          alimentos del USDA y pueden variar según la preparación y origen del
          producto.
        </Text>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  ingredientsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  servingSection: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 8,
  },
  nutrientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  nutrientInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  nutrientIcon: {
    marginRight: 12,
  },
  nutrientText: {
    flex: 1,
  },
  vitaminsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  vitaminItem: {
    flex: 1,
    minWidth: "45%",
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 6,
    alignItems: "center",
  },
  disclaimerCard: {
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "flex-start",
  },
});

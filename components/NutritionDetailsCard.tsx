import { useTheme } from "@/contexts/ThemeContext";
import { AbridgedFoodNutrient, FoodItem, FoodNutrient } from "@/types/fdc";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Chip, Divider, Surface, Text } from "react-native-paper";
import Animated, { FadeIn, Layout } from "react-native-reanimated";

const AnimatedSurface = Animated.createAnimatedComponent(Surface);
const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedView = Animated.createAnimatedComponent(View);

interface NutritionDetailsCardProps {
  food: FoodItem;
}

export const NutritionDetailsCard: React.FC<NutritionDetailsCardProps> = ({
  food,
}) => {
  const { theme } = useTheme();

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
    if (amount < 0.01 && amount > 0) return "<0.01";

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
      { name: "Energy", icon: "flash", color: theme.colors.error },
      {
        name: "Protein",
        icon: "food-steak",
        color: theme.colors.primary,
      },
      {
        name: "Total lipid (fat)",
        icon: "oil",
        color: theme.colors.tertiary,
      },
      {
        name: "Carbohydrate, by difference",
        icon: "bread-slice",
        color: theme.colors.secondary,
      },
      {
        name: "Fiber, total dietary",
        icon: "fruit-cherries",
        color: theme.colors.primary,
      },
      {
        name: "Sugars, total including NLEA",
        icon: "candycane",
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
        (n): n is NonNullable<typeof n> =>
          n !== null && n.amount !== undefined && n.amount !== 0
      );
  };

  const getVitaminsAndMinerals = () => {
    if (!food.foodNutrients) return [];

    const vitaminsAndMinerals = [
      "Vitamin C",
      "Vitamin A",
      "Vitamin D",
      "Vitamin E",
      "Vitamin K",
      "Thiamin",
      "Riboflavin",
      "Niacin",
      "Vitamin B-6",
      "Folate",
      "Vitamin B-12",
      "Calcium, Ca",
      "Iron, Fe",
      "Magnesium, Mg",
      "Phosphorus, P",
      "Potassium, K",
      "Sodium, Na",
      "Zinc, Zn",
      "Copper, Cu",
      "Manganese, Mn",
      "Selenium, Se",
    ];

    return food.foodNutrients
      .filter((nutrient) => {
        const nutrientName = getNutrientName(nutrient);
        return (
          vitaminsAndMinerals.some((vm) => nutrientName.includes(vm)) &&
          nutrient.amount !== undefined &&
          nutrient.amount !== 0
        );
      })
      .sort((a, b) => {
        const nameA = getNutrientName(a).split(",")[0];
        const nameB = getNutrientName(b).split(",")[0];
        return nameA.localeCompare(nameB);
      })
      .slice(0, 15);
  };

  const mainNutrients = getMainNutrients();
  const vitaminsAndMinerals = getVitaminsAndMinerals();

  return (
    <AnimatedView
      style={styles.container}
      entering={FadeIn.delay(200).duration(800)}
      layout={Layout.springify()}
    >
      {/* Información básica del alimento */}
      <AnimatedSurface
        style={[
          styles.card,
          { backgroundColor: theme.colors.surfaceContainerHigh },
          // Sombra más sutil y Material-ish
          {
            shadowColor: theme.colors.shadow, // Usar el color de sombra del tema
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2, // Opacidad reducida
            shadowRadius: 3,
            elevation: theme.dark ? 4 : 5,
          },
        ]}
        // Ya no necesitamos la prop `elevation` directa aquí, la manejamos en el estilo
        entering={FadeIn.delay(300).duration(600)}
        layout={Layout.springify()}
      >
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons
            name="food-apple-outline"
            size={28}
            color={theme.colors.primary}
            style={styles.cardHeaderIcon}
          />
          <Text
            variant="titleLarge"
            style={{ color: theme.colors.onSurface, marginLeft: 12 }}
          >
            Información del Producto
          </Text>
        </View>

        <Text
          variant="headlineSmall"
          style={{ color: theme.colors.onSurface, marginBottom: 12 }}
        >
          {String(food.description || "Sin descripción")}
        </Text>

        <View style={styles.chipContainer}>
          <Chip
            compact
            mode="flat"
            style={{ backgroundColor: theme.colors.primaryContainer }}
            textStyle={{ color: theme.colors.onPrimaryContainer }}
            icon={() => (
              <MaterialCommunityIcons
                name="database"
                size={16}
                color={theme.colors.onPrimaryContainer}
              />
            )}
          >
            {food.dataType}
          </Chip>
          {"brandOwner" in food && food.brandOwner && (
            <Chip
              compact
              mode="flat"
              style={{ backgroundColor: theme.colors.tertiaryContainer }}
              textStyle={{ color: theme.colors.onTertiaryContainer }}
              icon={() => (
                <MaterialCommunityIcons
                  name="store"
                  size={16}
                  color={theme.colors.onTertiaryContainer}
                />
              )}
            >
              {String(food.brandOwner)}
            </Chip>
          )}
          <Chip
            compact
            mode="flat"
            style={{ backgroundColor: theme.colors.secondaryContainer }}
            textStyle={{ color: theme.colors.onSecondaryContainer }}
            icon={() => (
              <MaterialCommunityIcons
                name="identifier"
                size={16}
                color={theme.colors.onSecondaryContainer}
              />
            )}
          >
            ID: {String(food.fdcId)}
          </Chip>
        </View>

        {"ingredients" in food && food.ingredients && (
          <View
            style={[
              styles.ingredientsSection,
              { borderTopColor: theme.colors.outlineVariant },
            ]}
          >
            <Text
              variant="titleSmall"
              style={{ color: theme.colors.onSurface, marginBottom: 8 }}
            >
              Ingredientes:
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
              {String(food.ingredients)}
            </Text>
          </View>
        )}

        {"servingSize" in food && food.servingSize && (
          <View
            style={[
              styles.servingSection,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
          >
            <Text
              variant="bodyLarge"
              style={{ color: theme.colors.onPrimaryContainer }}
            >
              Tamaño de porción: {String(food.servingSize)}
              {String(food.servingSizeUnit || "g")}
            </Text>
          </View>
        )}
      </AnimatedSurface>

      {/* Macronutrientes principales */}
      {mainNutrients.length > 0 && (
        <AnimatedSurface
          style={[
            styles.card,
            { backgroundColor: theme.colors.surfaceContainer },
            {
              shadowColor: theme.colors.shadow,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.15,
              shadowRadius: 2,
              elevation: theme.dark ? 2 : 4,
            },
          ]}
          // Ya no necesitamos la prop `elevation` directa aquí
          entering={FadeIn.delay(400).duration(600)}
          layout={Layout.springify()}
        >
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="nutrition"
              size={28}
              color={theme.colors.secondary}
              style={styles.cardHeaderIcon}
            />
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.onSurface, marginLeft: 12 }}
            >
              Macronutrientes
            </Text>
          </View>
          {mainNutrients.map((nutrient, index) => (
            <AnimatedView
              key={index}
              style={styles.nutrientRow}
              entering={FadeIn.delay(450 + index * 50).duration(500)}
              layout={Layout.springify()}
            >
              <View style={styles.nutrientInfo}>
                <MaterialCommunityIcons
                  name={nutrient.icon as any}
                  size={24}
                  color={nutrient.color}
                  style={styles.nutrientIcon}
                />
                <View style={styles.nutrientText}>
                  <Text
                    variant="bodyLarge"
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
                variant="titleMedium"
                style={{ color: theme.colors.primary }}
              >
                {renderNutrientValue(nutrient)}
              </Text>
              {index < mainNutrients.length - 1 && (
                <Divider
                  style={[
                    styles.rowDivider,
                    { backgroundColor: theme.colors.outlineVariant },
                  ]}
                />
              )}
            </AnimatedView>
          ))}
        </AnimatedSurface>
      )}

      {/* Vitaminas y minerales */}
      {vitaminsAndMinerals.length > 0 && (
        <AnimatedSurface
          style={[
            styles.card,
            { backgroundColor: theme.colors.surfaceContainerLow },
            {
              shadowColor: theme.colors.shadow,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 1.5,
              elevation: theme.dark ? 1 : 2,
            },
          ]}
          // Ya no necesitamos la prop `elevation` directa aquí
          entering={FadeIn.delay(500).duration(600)}
          layout={Layout.springify()}
        >
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="pill"
              size={28}
              color={theme.colors.tertiary}
              style={styles.cardHeaderIcon}
            />
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.onSurface, marginLeft: 12 }}
            >
              Vitaminas y Minerales
            </Text>
          </View>

          <View style={styles.vitaminsGrid}>
            {vitaminsAndMinerals.map((nutrient, index) => (
              <AnimatedView
                key={index}
                style={[
                  styles.vitaminItem,
                  { backgroundColor: theme.colors.surfaceVariant },
                ]}
                entering={FadeIn.delay(550 + index * 30).duration(400)}
                layout={Layout.springify()}
              >
                <Text
                  variant="bodyMedium"
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {getNutrientName(nutrient).split(",")[0]}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{
                    color: theme.colors.primary,
                    textAlign: "center",
                    marginTop: 4,
                  }}
                >
                  {renderNutrientValue(nutrient)}
                </Text>
              </AnimatedView>
            ))}
          </View>
        </AnimatedSurface>
      )}

      {/* Disclaimer */}
      <AnimatedSurface
        style={[
          styles.disclaimerCard,
          { backgroundColor: theme.colors.secondaryContainer },
          {
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 0.5 },
            shadowOpacity: 0.05,
            shadowRadius: 1,
            elevation: theme.dark ? 0 : 1,
          },
        ]}
        // Ya no necesitamos la prop `elevation` directa aquí
        entering={FadeIn.delay(700).duration(500)}
        layout={Layout.springify()}
      >
        <MaterialCommunityIcons
          name="information-outline"
          size={24}
          color={theme.colors.onSecondaryContainer}
          style={styles.disclaimerIcon}
        />
        <Text
          variant="bodySmall"
          style={{
            color: theme.colors.onSecondaryContainer,
            marginLeft: 12,
            flex: 1,
            lineHeight: 20,
          }}
        >
          Los valores nutricionales son proporcionados por la base de datos de
          alimentos del USDA y pueden variar según la preparación y origen del
          producto. Esta información es solo una referencia y no debe sustituir
          el consejo profesional.
        </Text>
      </AnimatedSurface>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16, // Reducir un poco el espacio entre tarjetas para un look más compacto pero aún legible
    padding: 16,
  },
  card: {
    padding: 18, // Ligeramente menos padding para un look más esbelto
    borderRadius: 12, // Mantener el redondeado para un aspecto moderno
    // La elevación (shadow) se maneja ahora directamente en el estilo del componente AnimatedSurface
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16, // Ligeramente menos margen abajo
  },
  cardHeaderIcon: {
    marginRight: 10, // Margen a la derecha del icono del header
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8, // Ligeramente menos espacio entre chips para compacidad
    marginTop: 8,
    marginBottom: 12, // Añadir margen inferior
  },
  ingredientsSection: {
    marginTop: 18, // Margen ajustado
    paddingTop: 18, // Padding ajustado
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  servingSection: {
    marginTop: 18,
    padding: 14, // Ligeramente menos padding
    borderRadius: 10, // Ligeramente menos redondeado
    alignItems: "center",
    justifyContent: "center",
  },
  nutrientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10, // Ligeramente menos padding vertical
    position: "relative",
  },
  nutrientInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  nutrientIcon: {
    marginRight: 12, // Ligeramente menos margen
  },
  nutrientText: {
    flex: 1,
  },
  rowDivider: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 0,
  },
  vitaminsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10, // Ligeramente menos espacio entre los elementos
  },
  vitaminItem: {
    width: "48%", // Ajustar para 2 columnas con espacio
    padding: 10, // Ligeramente menos padding
    borderRadius: 8, // Ligeramente menos redondeado
    alignItems: "center",
    justifyContent: "center",
  },
  disclaimerCard: {
    padding: 14, // Ligeramente menos padding
    borderRadius: 10, // Ligeramente menos redondeado
    flexDirection: "row",
    alignItems: "flex-start",
  },
  disclaimerIcon: {
    marginTop: 2,
  },
});

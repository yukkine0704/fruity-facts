import { useTheme } from "@/contexts/ThemeContext";
import { AbridgedFoodNutrient, FoodItem, FoodNutrient } from "@/types/fdc";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Importamos MaterialCommunityIcons
import React from "react";
import { StyleSheet, View } from "react-native";
import { Chip, Divider, Surface, Text } from "react-native-paper";
import Animated, { FadeIn, Layout } from "react-native-reanimated";

// Usamos Animated.createAnimatedComponent para los componentes de Paper si es necesario animarlos directamente
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
    if (amount < 0.01 && amount > 0) return "<0.01"; // Mejorado para pequeños valores

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
      { name: "Energy", icon: "flash", color: theme.colors.error }, // Cambiado a 'flash'
      {
        name: "Protein",
        icon: "food-steak", // Cambiado a 'food-steak'
        color: theme.colors.primary,
      },
      {
        name: "Total lipid (fat)",
        icon: "oil", // Cambiado a 'oil'
        color: theme.colors.tertiary,
      },
      {
        name: "Carbohydrate, by difference",
        icon: "bread-slice", // Cambiado a 'bread-slice'
        color: theme.colors.secondary,
      },
      {
        name: "Fiber, total dietary",
        icon: "fruit-cherries", // Cambiado a 'fruit-cherries'
        color: theme.colors.primary,
      },
      {
        name: "Sugars, total including NLEA",
        icon: "candycane", // Cambiado a 'candycane'
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
      ); // Filtrar nutrientes con cantidad 0
  };

  const getVitaminsAndMinerals = () => {
    if (!food.foodNutrients) return [];

    const vitaminsAndMinerals = [
      "Vitamin C",
      "Vitamin A",
      "Vitamin D", // Agregado
      "Vitamin E", // Agregado
      "Vitamin K",
      "Thiamin", // B1
      "Riboflavin", // B2
      "Niacin", // B3
      "Vitamin B-6", // B6
      "Folate", // B9
      "Vitamin B-12", // B12
      "Calcium, Ca",
      "Iron, Fe",
      "Magnesium, Mg",
      "Phosphorus, P",
      "Potassium, K",
      "Sodium, Na",
      "Zinc, Zn",
      "Copper, Cu", // Agregado
      "Manganese, Mn", // Agregado
      "Selenium, Se", // Agregado
    ];

    return food.foodNutrients
      .filter((nutrient) => {
        const nutrientName = getNutrientName(nutrient);
        return (
          vitaminsAndMinerals.some((vm) => nutrientName.includes(vm)) &&
          nutrient.amount !== undefined &&
          nutrient.amount !== 0
        ); // Filtrar nutrientes con cantidad 0
      })
      .sort((a, b) => {
        // Ordenar alfabéticamente por nombre de nutriente para mejor presentación
        const nameA = getNutrientName(a).split(",")[0];
        const nameB = getNutrientName(b).split(",")[0];
        return nameA.localeCompare(nameB);
      })
      .slice(0, 15); // Mostrar hasta 15 vitaminas/minerales
  };

  const mainNutrients = getMainNutrients();
  const vitaminsAndMinerals = getVitaminsAndMinerals();

  return (
    <AnimatedView
      style={styles.container}
      entering={FadeIn.delay(200).duration(800)} // Animación de entrada para todo el contenedor
      layout={Layout.springify()} // Animación de layout para los cambios
    >
      {/* Información básica del alimento */}
      <AnimatedSurface
        style={[
          styles.card,
          { backgroundColor: theme.colors.surfaceContainerHigh }, // Color de superficie más destacado
        ]}
        elevation={theme.dark ? 4 : 5} // Mayor elevación para Material 3
        entering={FadeIn.delay(300).duration(600)}
        layout={Layout.springify()}
      >
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons // Usamos MaterialCommunityIcons
            name="food-apple-outline" // Icono genérico para alimento
            size={28} // Tamaño un poco más grande
            color={theme.colors.primary}
            style={styles.cardHeaderIcon} // Nuevo estilo para el icono del encabezado
          />
          <Text
            variant="titleLarge" // Más prominente
            style={{ color: theme.colors.onSurface, marginLeft: 12 }}
          >
            Información del Producto
          </Text>
        </View>

        <Text
          variant="headlineSmall" // Más grande para la descripción principal
          style={{ color: theme.colors.onSurface, marginBottom: 12 }}
        >
          {String(food.description || "Sin descripción")}
        </Text>

        <View style={styles.chipContainer}>
          <Chip
            compact
            mode="flat" // Usamos modo flat para Material 3
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
              Tamaño de porción: {String(food.servingSize)}{" "}
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
            { backgroundColor: theme.colors.surfaceContainer }, // Otro color de superficie
          ]}
          elevation={theme.dark ? 2 : 4} // Menor elevación
          entering={FadeIn.delay(400).duration(600)}
          layout={Layout.springify()}
        >
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="nutrition" // Icono de Material 3 para nutrición
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
              entering={FadeIn.delay(450 + index * 50).duration(500)} // Animación escalonada
              layout={Layout.springify()}
            >
              <View style={styles.nutrientInfo}>
                <MaterialCommunityIcons
                  name={nutrient.icon as any}
                  size={24} // Iconos más grandes
                  color={nutrient.color}
                  style={styles.nutrientIcon}
                />
                <View style={styles.nutrientText}>
                  <Text
                    variant="bodyLarge" // Texto de nutriente principal más grande
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
                variant="titleMedium" // Valor más grande
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
          ))}{" "}
        </AnimatedSurface>
      )}

      {/* Vitaminas y minerales */}
      {vitaminsAndMinerals.length > 0 && (
        <AnimatedSurface
          style={[
            styles.card,
            { backgroundColor: theme.colors.surfaceContainerLow }, // Otro color de superficie
          ]}
          elevation={theme.dark ? 1 : 2} // Menor elevación
          entering={FadeIn.delay(500).duration(600)}
          layout={Layout.springify()}
        >
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="pill" // Icono para vitaminas/minerales
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
                  { backgroundColor: theme.colors.surfaceVariant }, // Color de fondo para items
                ]}
                entering={FadeIn.delay(550 + index * 30).duration(400)} // Animación escalonada más rápida
                layout={Layout.springify()}
              >
                <Text
                  variant="bodyMedium"
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    fontWeight: "bold",
                    textAlign: "center", // Centrar el texto
                  }}
                >
                  {getNutrientName(nutrient).split(",")[0]}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{
                    color: theme.colors.primary,
                    textAlign: "center", // Centrar el valor
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

      {/* Información adicional si está disponible */}
      {"publicationDate" in food && food.publicationDate && (
        <AnimatedSurface
          style={[
            styles.card,
            { backgroundColor: theme.colors.surfaceDisabled }, // Un color más discreto para info extra
          ]}
          elevation={theme.dark ? 0 : 1}
          entering={FadeIn.delay(600).duration(500)}
          layout={Layout.springify()}
        >
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="calendar-month-outline" // Icono de calendario
              size={22}
              color={theme.colors.outline}
              style={styles.cardHeaderIcon}
            />
            <Text
              variant="bodyLarge"
              style={{ color: theme.colors.onSurfaceVariant, marginLeft: 12 }}
            >
              Fecha de publicación:{" "}
              {new Date(food.publicationDate).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        </AnimatedSurface>
      )}

      {/* Disclaimer */}
      <AnimatedSurface
        style={[
          styles.disclaimerCard,
          { backgroundColor: theme.colors.secondaryContainer },
        ]}
        elevation={theme.dark ? 0 : 1}
        entering={FadeIn.delay(700).duration(500)}
        layout={Layout.springify()}
      >
        <MaterialCommunityIcons
          name="information-outline" // Icono de información
          size={24} // Más grande
          color={theme.colors.onSecondaryContainer}
          style={styles.disclaimerIcon} // Nuevo estilo para el icono del disclaimer
        />
        <Text
          variant="bodySmall"
          style={{
            color: theme.colors.onSecondaryContainer,
            marginLeft: 12, // Más margen
            flex: 1,
            lineHeight: 20, // Mejorar legibilidad
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
    gap: 20, // Más espacio entre las tarjetas
    padding: 16,
  },
  card: {
    padding: 20, // Más padding dentro de la tarjeta
    borderRadius: 16, // Más redondeado
    // Elevated style para Material 3 se maneja con la prop `elevation` de Surface
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20, // Más margen abajo
  },
  cardHeaderIcon: {
    marginRight: 8, // Margen a la derecha del icono del header
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10, // Más espacio entre chips
    marginTop: 8,
    marginBottom: 16, // Añadir margen inferior
  },
  ingredientsSection: {
    marginTop: 20, // Más margen
    paddingTop: 20, // Más padding
    borderTopWidth: StyleSheet.hairlineWidth, // Línea más fina
  },
  servingSection: {
    marginTop: 20,
    padding: 16, // Más padding
    borderRadius: 12, // Más redondeado
    alignItems: "center", // Centrar texto
    justifyContent: "center",
  },
  nutrientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12, // Más padding vertical
    position: "relative", // Para el divisor absoluto
  },
  nutrientInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  nutrientIcon: {
    marginRight: 16, // Más margen
  },
  nutrientText: {
    flex: 1,
  },
  rowDivider: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth, // Divisor fino
    marginHorizontal: 0, // Asegura que ocupe todo el ancho
  },
  vitaminsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Distribuir uniformemente
    gap: 12, // Espacio entre los elementos
  },
  vitaminItem: {
    width: "48%", // Ajustar para 2 columnas con espacio
    padding: 12, // Más padding
    borderRadius: 10, // Más redondeado
    alignItems: "center",
    justifyContent: "center",
  },
  disclaimerCard: {
    padding: 16, // Más padding
    borderRadius: 12, // Más redondeado
    flexDirection: "row",
    alignItems: "flex-start",
  },
  disclaimerIcon: {
    marginTop: 2, // Ajustar posición del icono
  },
});

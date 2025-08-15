// app/fruit-details/[fruitName].tsx

import FoodDetailsSkeleton from "@/components/skeletons/food-details-skeleton";
import { useFoodDetails } from "@/hooks/useFDCStore";
import { isFoodNutrient } from "@/types/fdc"; // Importamos el type guard necesario
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { AlertTriangle, ChevronLeft, Circle, Vegan } from "lucide-react-native";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, IconButton, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

interface NutrientItemProps {
  name: string;
  amount: number;
  unit: string;
  isMain?: boolean;
}

// Componente para mostrar un solo nutriente
const NutrientItem = ({
  name,
  amount,
  unit,
  isMain = false,
}: NutrientItemProps) => {
  const theme = useTheme();
  const color = isMain ? theme.colors.primary : theme.colors.onSurfaceVariant;
  const fontWeight = isMain ? "bold" : "normal";
  const iconSize = isMain ? 12 : 8;

  return (
    <View style={styles.nutrientItem}>
      <Circle size={iconSize} color={color} style={{ marginRight: 8 }} />
      <Text
        variant="bodyMedium"
        style={{ color: theme.colors.onSurface, fontWeight }}
      >
        {name}:{" "}
      </Text>
      <Text
        variant="bodyLarge"
        style={{ color: theme.colors.onSurface, fontWeight }}
      >
        {amount.toFixed(2)} {unit}
      </Text>
    </View>
  );
};

export default function FoodDetailsScreen() {
  const { fdcId } = useLocalSearchParams();
  const theme = useTheme();
  const navigation = useNavigation();
  const { currentFood, isLoading, error, loadFood, getMainNutrients } =
    useFoodDetails();

  useEffect(() => {
    // Verificamos que fdcId exista y sea un valor válido antes de cargar
    if (fdcId && typeof fdcId === "string") {
      loadFood(Number(fdcId));
    }
  }, [fdcId, loadFood]); // Añadimos 'loadFood' como dependencia para evitar advertencias

  const renderContent = () => {
    if (isLoading) {
      return <FoodDetailsSkeleton />;
    }

    if (error) {
      return (
        <View style={styles.centeredContainer}>
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
                  No pudimos cargar los detalles del alimento.
                </Text>
              </View>
              <IconButton
                icon="refresh"
                iconColor={theme.colors.onErrorContainer}
                size={24}
                onPress={() =>
                  fdcId && typeof fdcId === "string" && loadFood(Number(fdcId))
                }
              />
            </View>
          </Card>
        </View>
      );
    }

    if (!currentFood) {
      return (
        <View style={styles.centeredContainer}>
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            No se encontró información para este alimento.
          </Text>
        </View>
      );
    }

    // Obtener los nutrientes principales del hook
    const mainNutrients = getMainNutrients();

    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Imagen o Icono de la comida */}
        <View
          style={[
            styles.imageContainer,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          <Vegan size={120} color={theme.colors.onSurfaceVariant} />
        </View>

        {/* Información principal */}
        <View style={styles.infoContainer}>
          <Text
            variant="headlineMedium"
            style={[styles.title, { color: theme.colors.onSurface }]}
          >
            {currentFood.description}
          </Text>
          <View style={styles.metaInfo}>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Tipo: {currentFood.dataType}
            </Text>
            {"brandOwner" in currentFood && currentFood.brandOwner && (
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Marca: {currentFood.brandOwner}
              </Text>
            )}
          </View>
        </View>

        {/* Sección de Nutrientes */}
        <View style={styles.sectionContainer}>
          <Text
            variant="titleLarge"
            style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
          >
            Información Nutricional
          </Text>
          <View style={styles.nutrientsList}>
            {mainNutrients.length > 0 ? (
              mainNutrients.map((nutrient, index) => {
                const name = isFoodNutrient(nutrient)
                  ? nutrient.nutrient?.name
                  : nutrient.name;
                const amount = nutrient.amount || 0;
                const unit = isFoodNutrient(nutrient)
                  ? nutrient.nutrient?.unitName
                  : nutrient.unitName;

                if (!name || amount === null || !unit) return null;

                const isMainNutrient = [
                  "Protein",
                  "Total lipid (fat)",
                  "Carbohydrate, by difference",
                  "Energy",
                ].some((n) => name.toLowerCase().includes(n.toLowerCase()));

                return (
                  <NutrientItem
                    key={index}
                    name={name}
                    amount={amount}
                    unit={unit}
                    isMain={isMainNutrient}
                  />
                );
              })
            ) : (
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                No hay información nutricional disponible.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <IconButton
        icon={() => <ChevronLeft size={24} color={theme.colors.onBackground} />}
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      />

      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 10,
    zIndex: 10,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  scrollContainer: {
    padding: 16,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  infoContainer: {
    marginBottom: 24,
    gap: 8,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
  },
  metaInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: 8,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.1)",
    paddingBottom: 8,
  },
  nutrientsList: {
    gap: 12,
  },
  nutrientItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  // Estilos de error
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

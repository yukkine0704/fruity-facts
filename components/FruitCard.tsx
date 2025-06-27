import { useTheme } from "@/contexts/ThemeContext";
import { Fruit } from "@/types/fruit";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Card, Chip, Surface, Text } from "react-native-paper";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface FruitCardProps {
  fruit: Fruit;
  onPress?: (fruit: Fruit) => void;
  index?: number;
}

const AnimatedCard = Animated.createAnimatedComponent(Card);
const AnimatedSurface = Animated.createAnimatedComponent(Surface);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FruitCard: React.FC<FruitCardProps> = ({
  fruit,
  onPress,
  index = 0,
}) => {
  const { theme } = useTheme();

  // Valores animados
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const pressScale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Animación de entrada escalonada
    const delay = index * 120;

    scale.value = withDelay(
      delay,
      withSpring(1, {
        damping: 15,
        stiffness: 100,
        mass: 0.8,
      })
    );

    opacity.value = withDelay(delay, withTiming(1, { duration: 700 }));

    translateY.value = withDelay(
      delay,
      withSpring(0, {
        damping: 12,
        stiffness: 80,
        mass: 0.8,
      })
    );

    // Pequeña rotación inicial
    rotation.value = withDelay(
      delay + 250,
      withSequence(
        withTiming(2, { duration: 250 }),
        withTiming(0, { duration: 250 })
      )
    );
  }, [index]);

  const handlePressIn = () => {
    pressScale.value = withSpring(0.96, {
      damping: 15,
      stiffness: 200,
    });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
    });
  };

  const handlePress = () => {
    pressScale.value = withSequence(
      withTiming(0.98, { duration: 100 }),
      withSpring(1, { damping: 10, stiffness: 150 })
    );

    if (onPress) {
      runOnJS(onPress)(fruit);
    }
  };

  // Estilos animados
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value * pressScale.value },
        { translateY: translateY.value },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  const nutritionItemAnimatedStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(pressScale.value, [0.96, 1], [0.95, 1]);

    return {
      transform: [{ scale: scaleValue }],
    };
  });

  const getFruitIcon = (): keyof typeof MaterialCommunityIcons.glyphMap => {
    return "fruit-watermelon";
  };

  const getCalorieColor = (calories: number) => {
    if (calories < 50) return theme.colors.tertiary;
    if (calories < 80) return theme.colors.primary;
    return theme.colors.error;
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={cardAnimatedStyle}
    >
      <AnimatedCard
        style={[
          styles.card,
          { backgroundColor: theme.colors.surfaceContainerLow },
        ]}
        elevation={theme.dark ? 1 : 2}
      >
        <Card.Content style={styles.content}>
          {/* Header con icono y nombre */}
          <AnimatedSurface
            style={[
              styles.header,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
            elevation={theme.dark ? 0 : 1}
          >
            <MaterialCommunityIcons
              name={getFruitIcon()} // Ya no pasamos fruit.name
              size={36}
              color={theme.colors.onPrimaryContainer}
              style={styles.fruitIcon}
            />
            <Text
              variant="titleLarge"
              style={[
                styles.fruitName,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              {fruit.name}
            </Text>
          </AnimatedSurface>

          {/* Información taxonómica */}
          <Surface
            style={[
              styles.taxonomySection,
              { backgroundColor: theme.colors.surfaceContainerHigh },
            ]}
            elevation={theme.dark ? 0 : 1}
          >
            <Text
              variant="labelLarge"
              style={[
                styles.sectionTitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Clasificación
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              <Text style={{ fontWeight: "bold" }}>Familia:</Text>
              {fruit.family}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              <Text style={{ fontWeight: "bold" }}>Género:</Text> {fruit.genus}
            </Text>
          </Surface>

          {/* Información nutricional */}
          <Surface
            style={[
              styles.nutritionSection,
              { backgroundColor: theme.colors.secondaryContainer },
            ]}
            elevation={theme.dark ? 0 : 1}
          >
            <Text
              variant="labelLarge"
              style={[
                styles.sectionTitle,
                { color: theme.colors.onSecondaryContainer },
              ]}
            >
              Información Nutricional
            </Text>

            <Animated.View
              style={[styles.nutritionGrid, nutritionItemAnimatedStyle]}
            >
              {/* Calorías */}
              <Surface
                style={[
                  styles.nutritionItem,
                  {
                    backgroundColor: getCalorieColor(fruit.nutritions.calories),
                  },
                ]}
                elevation={theme.dark ? 0 : 1}
              >
                <MaterialCommunityIcons
                  name="fire"
                  size={16}
                  color={
                    getCalorieColor(fruit.nutritions.calories) ===
                    theme.colors.error
                      ? theme.colors.onError
                      : theme.colors.onPrimary
                  }
                />
                <Text
                  variant="labelSmall"
                  style={{
                    color:
                      getCalorieColor(fruit.nutritions.calories) ===
                      theme.colors.error
                        ? theme.colors.onError
                        : theme.colors.onPrimary,
                    fontWeight: "bold",
                  }}
                >
                  {fruit.nutritions.calories} cal
                </Text>
              </Surface>

              {/* Carbohidratos */}
              <Surface
                style={[
                  styles.nutritionItem,
                  { backgroundColor: theme.colors.tertiary },
                ]}
                elevation={theme.dark ? 0 : 1}
              >
                <MaterialCommunityIcons
                  name="grain"
                  size={16}
                  color={theme.colors.onTertiary}
                />
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.onTertiary, fontWeight: "bold" }}
                >
                  {fruit.nutritions.carbohydrates}g carb
                </Text>
              </Surface>

              {/* Azúcar */}
              <Surface
                style={[
                  styles.nutritionItem,
                  { backgroundColor: theme.colors.surfaceVariant },
                ]}
                elevation={theme.dark ? 0 : 1}
              >
                <MaterialCommunityIcons
                  name="candy"
                  size={16}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text
                  variant="labelSmall"
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    fontWeight: "bold",
                  }}
                >
                  {fruit.nutritions.sugar}g azúcar
                </Text>
              </Surface>

              {/* Proteína */}
              <Surface
                style={[
                  styles.nutritionItem,
                  { backgroundColor: theme.colors.primary },
                ]}
                elevation={theme.dark ? 0 : 1}
              >
                <MaterialCommunityIcons
                  name="weight-lifter"
                  size={16}
                  color={theme.colors.onPrimary}
                />
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.onPrimary, fontWeight: "bold" }}
                >
                  {fruit.nutritions.protein}g prot
                </Text>
              </Surface>
            </Animated.View>
          </Surface>

          {/* Footer con ID */}
          <Chip
            style={[
              styles.idChip,
              { backgroundColor: theme.colors.tertiaryContainer },
            ]}
            textStyle={{ color: theme.colors.onTertiaryContainer }}
            icon={() => (
              <MaterialCommunityIcons
                name="identifier"
                size={16}
                color={theme.colors.onTertiaryContainer}
              />
            )}
          >
            ID: {fruit.id}
          </Chip>
        </Card.Content>
      </AnimatedCard>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    overflow: "hidden",
  },
  content: {
    padding: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 16,
  },
  fruitIcon: {
    marginRight: 12,
  },
  fruitName: {
    fontWeight: "bold",
    flex: 1,
  },
  taxonomySection: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  nutritionSection: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
  },
  nutritionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    flexGrow: 1,
    justifyContent: "center",
    minWidth: "48%",
  },
  idChip: {
    alignSelf: "flex-end",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    paddingHorizontal: 4,
    height: 32,
  },
});
